from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from v1.apps.headers import auth_header
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Game, GameComment, GameBookmark, GameMoveBookmark, GameOpening, Annotation
import requests
import os
import json
import re
import io
import chess.pgn

from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .serializers import GameCommentSerializer, AnnotationSerializer


# Swagger Parameters

# Define the Lichess Masters database endpoint
LICHESS_MASTERS_API = "https://explorer.lichess.ovh/masters"
LICHESS_BROADCAST_API = "https://lichess.org/api/broadcast"
LICHESS_ACCESS_TOKEN = os.getenv('LICHESS_ACCESS_TOKEN')


year_param = openapi.Parameter(
    'year', openapi.IN_QUERY, description="Filter by year", type=openapi.TYPE_INTEGER
)
player_param = openapi.Parameter(
    'player', openapi.IN_QUERY, description="Filter by player surname (case-insensitive match)", type=openapi.TYPE_STRING
)
site_param = openapi.Parameter(
    'site', openapi.IN_QUERY, description="Filter by site (case-insensitive match)", type=openapi.TYPE_STRING
)
event_param = openapi.Parameter(
    'event', openapi.IN_QUERY, description="Filter by event (case-insensitive match)", type=openapi.TYPE_STRING
)
result_param = openapi.Parameter(
    'result', openapi.IN_QUERY, description="Filter by game result (e.g., '1-0', '1/2-1/2', '0-1')", type=openapi.TYPE_STRING
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[year_param, player_param, site_param, event_param, result_param],
    responses={
        200: openapi.Response('Filtered games', examples={
            'application/json': {
                "games": [
                    {
                        "id": 1,  
                        "event": "Amsterdam",
                        "site": "Amsterdam NED",
                        "white": "Browne, Walter S",
                        "black": "Karpov, Anatoly",
                        "result": "0-1",
                        "year": 1976,
                        "month": 10,
                        "day": 10,
                        "pgn": "PGN content here..."
                    }
                ]
            }
        }),
        400: openapi.Response('Invalid parameters', examples={'application/json': {'error': 'Invalid query parameter'}})
    },
    operation_description="Filter games based on various criteria.",
    operation_summary="Filter Games"
)
@api_view(['GET'])
@permission_classes([AllowAny])  # You can use IsAuthenticated if needed
def filter_games(request):

    try:
        # Get query parameters
        year = request.query_params.get('year')
        player = request.query_params.get('player')
        site = request.query_params.get('site')
        event = request.query_params.get('event')
        result = request.query_params.get('result')

        # Build the filter query
        filters = Q()
        if year:
            filters &= Q(year=year)
        if player:
            player_lower = player.lower()
            filters &= Q(white__icontains=player_lower) | Q(black__icontains=player_lower)
        if site:
            filters &= Q(site__icontains=site.lower())
        if event:
            filters &= Q(event__icontains=event.lower())
        if result:
            filters &= Q(result=result)

        # Query the database
        games = Game.objects.filter(filters)

        # Prepare response data
        games_data = [
            {
                "id": game.id,
                "event": game.event,
                "site": game.site,
                "white": game.white,
                "black": game.black,
                "result": game.result,
                "year": game.year,
                "month": game.month,
                "day": game.day,
                "pgn": game.pgn
            }
            for game in games
        ]

        return JsonResponse({"games": games_data}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


# Define the query parameters for Swagger documentation
fen_param = openapi.Parameter(
    'fen',
    in_=openapi.IN_QUERY,
    description="FEN of the root position (optional)",
    type=openapi.TYPE_STRING
)
play_param = openapi.Parameter(
    'play',
    in_=openapi.IN_QUERY,
    description="Comma-separated sequence of legal moves in UCI notation (optional)",
    type=openapi.TYPE_STRING
)
since_param = openapi.Parameter(
    'since',
    in_=openapi.IN_QUERY,
    description="Include only games from this year or later (optional)",
    type=openapi.TYPE_INTEGER
)
until_param = openapi.Parameter(
    'until',
    in_=openapi.IN_QUERY,
    description="Include only games from this year or earlier (optional)",
    type=openapi.TYPE_INTEGER
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[auth_header, fen_param, play_param, since_param, until_param],
    operation_description="Explore the Masters database from Lichess API. Fixed parameters `moves=10` and `topGames=10` are included, but additional optional parameters can be passed (e.g., `fen`, `play`, etc.).",
    responses={
        200: openapi.Response('Data fetched successfully', examples={'application/json': {'data': '...'}}),
        400: openapi.Response('Invalid request'),
        500: openapi.Response('Error fetching data'),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Require authentication
def explore(request):
    """
    Explore the Masters database from Lichess API with fixed and optional parameters.
    """

    # Fixed parameters
    params = {
        "moves": 10,  # Fixed number of most common moves to display
        "topGames": 10  # Fixed number of top games to include
    }

    # Fetch optional parameters from the request query string
    optional_params = ['fen', 'play', 'since', 'until']
    for param in optional_params:
        if param in request.query_params:
            params[param] = request.query_params[param]

    # Fetch the Lichess access token
    token = LICHESS_ACCESS_TOKEN

    # Ensure the token is set
    if not token:
        return JsonResponse({"error": "Lichess access token is missing in the environment variables."}, status=500)

    # Set the headers with the token
    headers = {
        "Authorization": f"Bearer {token}"
    }

    try:
        # Make a GET request to the Lichess API
        response = requests.get(LICHESS_MASTERS_API, params=params, headers=headers)
        response.raise_for_status()  # Raise an error for non-200 status codes

        # Return the response data to the client
        return JsonResponse(response.json(), safe=False, status=200)
    except requests.exceptions.RequestException as e:
        # Handle errors during the request
        return JsonResponse({"error": str(e)}, status=500)

game_id_param = openapi.Parameter(
    'game_id',
    in_=openapi.IN_PATH,
    description="The 8-char ID of the game to fetch PGN.",
    type=openapi.TYPE_STRING,
    required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[auth_header, game_id_param],
    responses={
        200: openapi.Response(
            description="Successfully retrieved and stored the Masters Game.",
            examples={
                'application/json': {
                    "game": {
                        "id": 1,
                        "event": "7th Norway Chess 2019",
                        "site": "Stavanger NOR",
                        "white": "Caruana, F.",
                        "black": "Carlsen, M.",
                        "result": "1/2-1/2",
                        "year": 2019,
                        "month": 6,
                        "day": 14,
                        "pgn": "[Event \"7th Norway Chess 2019\"]\n[Site \"Stavanger NOR\"]\n[Date \"2019.06.14\"]\n[Round \"9.1\"]\n[White \"Caruana, F.\"]\n[Black \"Carlsen, M.\"]\n[Result \"1/2-1/2\"]\n...\n"
                    }
                }
            }
        ),
        404: openapi.Response(
            description="Game not found.",
            examples={'application/json': {'error': 'Game not found'}}
        ),
        500: openapi.Response(
            description="Server error.",
            examples={'application/json': {'error': 'Internal server error'}}
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    },
    operation_description="Fetch the PGN representation of a master game from the Lichess Masters database. The PGN is then parsed, stored in the local database, and returned as a saved game object.",
    operation_summary="Get and Store Masters Game PGN"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Allow public access
def master_game(request, game_id):
    """
    Fetches the PGN of a game from the Lichess Masters database,
    parses and stores it into the database, and returns the stored game.
    """
    try:
        # Construct the Lichess API URL
        url = f"https://explorer.lichess.ovh/masters/pgn/{game_id}"

        # Set headers with the Lichess access token if available
        headers = {}
        if LICHESS_ACCESS_TOKEN:
            headers["Authorization"] = f"Bearer {LICHESS_ACCESS_TOKEN}"

        response = requests.get(url, headers=headers)

        # Check the response status
        if response.status_code == 200:
            pgn_text = response.text

            # Parse the PGN
            pgn_file = io.StringIO(pgn_text)
            game = chess.pgn.read_game(pgn_file)

            if game is None:
                return JsonResponse({"error": "Invalid PGN format."}, status=400)

            # Extract headers
            event = game.headers.get("Event", None)
            site = game.headers.get("Site", None)
            date = game.headers.get("Date", None)
            white = game.headers.get("White", None)
            black = game.headers.get("Black", None)
            result = game.headers.get("Result", None)

            # Parse date into year, month, day if possible
            year, month, day = None, None, None
            if date and date != "????.??.??":
                parts = date.split(".")
                if len(parts) == 3:
                    try:
                        year = int(parts[0])
                        month = int(parts[1])
                        day = int(parts[2])
                    except ValueError:
                        pass

            # Store the game in the database
            db_game = Game.objects.create(
                event=event,
                site=site,
                white=white,
                black=black,
                result=result,
                year=year,
                month=month,
                day=day,
                pgn=pgn_text
            )

            # Return the saved game data
            game_data = {
                "id": db_game.id,
                "event": db_game.event,
                "site": db_game.site,
                "white": db_game.white,
                "black": db_game.black,
                "result": db_game.result,
                "year": db_game.year,
                "month": db_game.month,
                "day": db_game.day,
                "pgn": db_game.pgn
            }
            return JsonResponse({"game": game_data}, status=200)

        elif response.status_code == 404:
            return JsonResponse({"error": "Game not found"}, status=404)
        else:
            return JsonResponse({"error": "Failed to fetch game data"}, status=response.status_code)

    except Exception as e:
        return JsonResponse({"error": "Internal server error", "details": str(e)}, status=500)

@swagger_auto_schema(
    method='post',
    operation_description="Add a comment to a specific move in a game.",
    operation_summary="Add Game Comment",
    manual_parameters=[auth_header],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'position_fen': openapi.Schema(type=openapi.TYPE_STRING, description="FEN string of the commented position"),
            'comment_fens': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_STRING),
                description="List of FENs related to the comment (optional)"
            ),
            'comment_text': openapi.Schema(type=openapi.TYPE_STRING, description="Text of the comment")
        },
        required=['position_fen', 'comment_text']
    ),
    responses={
        201: openapi.Response(description="Comment added successfully", examples={
            'application/json': {
                'id': 1,
                'user': 'example_user',
                'game': 5,
                'position_fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                'comment_fens': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                'fens_list': ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'],
                'comment_text': 'Great move!',
                'created_at': '2024-11-22T12:00:00Z'
            }
        }),
        400: openapi.Response(description="Invalid data"),
        404: openapi.Response(description="Game not found"),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_game_comment(request, game_id):
    """
    Endpoint for adding comment to a game position(move)
    """
    data = request.data
    data['game'] = game_id  # Add game ID to the request data
    serializer = GameCommentSerializer(data=data)
    if serializer.is_valid():
        comment = serializer.save(user=request.user)
        response_data = {
            'id': comment.id,
            'user': comment.user.username,
            'game': comment.game.id,
            'position_fen': comment.position_fen,
            'comment_fens': comment.comment_fens,
            'fens_list': comment.get_fens_list(),
            'comment_text': comment.comment_text,
            'created_at': comment.created_at
        }
        return JsonResponse(response_data, status=201)
    return JsonResponse(serializer.errors, status=400)

@swagger_auto_schema(
    method='get',
    operation_description="List all comments for a specific game.",
    operation_summary="List Game Comments",
    responses={
        200: openapi.Response(description="Comments retrieved successfully", examples={
            'application/json': {
                'comments': [
                    {
                        'id': 1,
                        'user': 'example_user',
                        'game': 5,
                        'position_fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        'comment_fens': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        'fens_list': ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'],
                        'comment_text': 'Great move!',
                        'created_at': '2024-11-22T12:00:00Z'
                    }
                ]
            }
        }),
        404: openapi.Response(description="Game not found")
    },
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_game_comments(request, game_id):
    """
    Lists all the comments of a game.
    """
    comments = GameComment.objects.filter(game_id=game_id).order_by('created_at')
    response_data = [
        {
            'id': comment.id,
            'user': comment.user.username,
            'game': comment.game.id,
            'position_fen': comment.position_fen,
            'comment_fens': comment.comment_fens,
            'fens_list': comment.get_fens_list(),
            'comment_text': comment.comment_text,
            'created_at': comment.created_at
        }
        for comment in comments
    ]
    return JsonResponse({'comments': response_data}, status=200)

@swagger_auto_schema(
    method='post',
    operation_description="Toggle bookmark for a specific game. If the game is not bookmarked, it will be bookmarked. If it is already bookmarked, the bookmark will be removed.",
    operation_summary="Toggle Bookmark on a Game",
    manual_parameters=[auth_header],
    responses={
        201: openapi.Response(
            description="Game bookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Game bookmarked successfully'
                }
            }
        ),
        200: openapi.Response(
            description="Game unbookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Game unbookmarked successfully'
                }
            }
        ),
        404: openapi.Response(
            description="Game not found",
            examples={
                'application/json': {
                    'error': 'Game not found'
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_game_bookmark(request, game_id):
    #Bookmark or unbookmark a game.
    user = request.user
    game = get_object_or_404(Game, id=game_id)

    bookmark, created = GameBookmark.objects.get_or_create(user=user, game=game)

    if not created:  # If the bookmark already exists, remove it
        bookmark.delete()
        return Response({"message": "Game unbookmarked"}, status=status.HTTP_200_OK)
    
    return Response({"message": "Game bookmarked"}, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='post',
    operation_description="Toggle bookmark for a specific move in a game. If the move is not bookmarked, it will be bookmarked. If it is already bookmarked, the bookmark will be removed.",
    operation_summary="Toggle Bookmark on a Game Move",
    manual_parameters=[auth_header],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'fen': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="FEN string representing the game move to bookmark"
            )
        },
        required=['fen'],
        example={
            'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
        }
    ),
    responses={
        201: openapi.Response(
            description="Game move bookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Game move bookmarked successfully'
                }
            }
        ),
        200: openapi.Response(
            description="Game move unbookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Game move unbookmarked successfully'
                }
            }
        ),
        404: openapi.Response(
            description="Game or move not found",
            examples={
                'application/json': {
                    'error': 'Game or move not found'
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_game_move_bookmark(request, game_id):
    #Bookmark or unbookmark a move in a game.
    user = request.user
    game = get_object_or_404(Game, id=game_id)
    fen = request.data.get('fen')

    if not fen:
        return Response({"error": "FEN is required"}, status=status.HTTP_400_BAD_REQUEST)

    bookmark, created = GameMoveBookmark.objects.get_or_create(user=user, game=game, fen=fen)

    if not created:  # If the bookmark already exists, remove it
        bookmark.delete()
        return Response({"message": "Game move unbookmarked"}, status=status.HTTP_200_OK)
    
    return Response({"message": "Game move bookmarked"}, status=status.HTTP_201_CREATED)


# Swagger parameter
eco_code_param = openapi.Parameter(
    'eco_code',
    in_=openapi.IN_QUERY,
    description="The ECO code of the chess opening (e.g., 'C50')",
    type=openapi.TYPE_STRING,
    required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[eco_code_param],
    responses={
        200: openapi.Response(description="Chess opening found", examples={
            'application/json': {
                "eco_code": "C50",
                "name": "Giuoco Pianissimo (Italian Game)",
                "description": "A quiet version of the Italian Game, emphasizing slow development and pawn structure."
            }
        }),
        404: openapi.Response(description="Opening not found", examples={
            'application/json': {
                "error": "Opening with ECO code C50 not found"
            }
        })
    },
    operation_description="Retrieve a chess opening by its ECO code.",
    operation_summary="Get Chess Opening by ECO Code"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_opening_by_eco(request):
    """
    Retrieve the opening name and description by ECO code.
    """
    eco_code = request.query_params.get('eco_code', None)
    
    if not eco_code:
        return Response({"error": "ECO code is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        opening = GameOpening.objects.get(eco_code=eco_code.upper())
        return Response({
            "eco_code": opening.eco_code,
            "name": opening.name,
            "description": opening.description
        }, status=status.HTTP_200_OK)
    except GameOpening.DoesNotExist:
        return Response({"error": f"Opening with ECO code {eco_code} not found"}, status=status.HTTP_404_NOT_FOUND)
    


nb_param = openapi.Parameter(
    'nb', openapi.IN_QUERY, description="Max number of tournaments to fetch (default: 20)", type=openapi.TYPE_INTEGER
)
html_param = openapi.Parameter(
    'html', openapi.IN_QUERY, description="Convert description field to HTML if true", type=openapi.TYPE_BOOLEAN
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[nb_param, html_param],
    responses={
        200: openapi.Response(
            description="Successfully fetched current tournaments",
            examples={
                "application/json": {
                    "tournaments": [
                        {
                            "tour": {
                                "id": "qKy2yAcs",
                                "name": "Norway Chess 2024 | Open",
                                "slug": "norway-chess-2024--open",
                                "info": {
                                    "format": "5-round Swiss",
                                    "players": "featured, players, list",
                                    "tc": "Classical"
                                }
                            },
                            "createdAt": 1716672627410,
                            "dates": [1724719373834, 1750560409830],
                            "tier": 5,
                            "image": "https://image.lichess1.org/tour.jpg",
                            "description": "The **Norway Chess 2024** tournament...",
                            "url": "https://lichess.org/broadcast/"
                        }
                    ]
                }
            }
        ),
        500: openapi.Response(description="Error fetching tournaments"),
    },
    operation_description="Fetch current tournaments from the Lichess API.",
    operation_summary="Fetch Current Tournaments"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_current_tournaments(request):
    """
    Fetches current tournaments from the Lichess API and returns them.
    """
    params = {}
    nb = request.query_params.get('nb', 20)  # Default to 20
    html = request.query_params.get('html', 'false').lower()

    if nb.isdigit():
        params['nb'] = int(nb)
    if html in ['true', '1']:
        params['html'] = 'true'

    try:
        # Make a request to the Lichess API
        response = requests.get(LICHESS_BROADCAST_API, params=params, headers={"Accept": "application/x-ndjson"})

        # Raise an exception for non-200 responses
        response.raise_for_status()

        # Convert NDJSON to JSON
        tournaments = []
        for line in response.text.splitlines():
            tournaments.append(json.loads(line))  # Correct JSON parsing

        return Response({"tournaments": tournaments}, status=200)

    except requests.exceptions.RequestException as e:
        return Response({"error": f"Error fetching tournaments: {str(e)}"}, status=500)
    
# Swagger parameters for the path
tournament_slug_param = openapi.Parameter(
    'tournamentSlug',
    in_=openapi.IN_PATH,
    description="The tournament slug used to identify the tournament.",
    type=openapi.TYPE_STRING,
    required=True
)

round_slug_param = openapi.Parameter(
    'roundSlug',
    in_=openapi.IN_PATH,
    description="The round slug used to identify the tournament round.",
    type=openapi.TYPE_STRING,
    required=True
)

round_id_param = openapi.Parameter(
    'roundId',
    in_=openapi.IN_PATH,
    description="The round ID (8 characters) used to fetch round details.",
    type=openapi.TYPE_STRING,
    required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[tournament_slug_param, round_slug_param, round_id_param],
    responses={
        200: openapi.Response(
            description="Tournament round data retrieved successfully",
            examples={
                "application/json": {
                    
                "round": {
                    "id": "p9DoebWl",
                    "name": "Round 1",
                    "slug": "round-1",
                    "createdAt": 1716014105255,
                    "ongoing": False,
                    "startsAt": 1716045300000,
                    "finishedAt": 1716062100000,
                    "url": "https://lichess.org/broadcast/casablanca-chess-2024/round-1/p9DoebWl"
                },
                "tour": {
                    "id": "ZuOkdeXK",
                    "name": "Casablanca Chess 2024",
                    "slug": "casablanca-chess-2024",
                    "description": "May 18th - 19th  | 4-player double round-robin | Rapid time control | Carlsen, Nakamura, Anand",
                    "createdAt": 1716014078747,
                    "tier": 5,
                    "image": "https://image.lichess1.org/display?h=400&op=thumbnail&path=loepare:relay:ZuOkdeXK:iq0feQJe.jpg&w=800&sig=36e58a1a648af5b9fe6d3f5725c7a2f52d853153",
                    "url": "https://lichess.org/broadcast/casablanca-chess-2024/ZuOkdeXK"
                },
                "study": {
                    "writeable": False
                },
                "games": [
                    {
                    "id": "59lrdLPv",
                    "name": "Carlsen, Magnus - Anand, Viswanathan",
                    "fen": "r1b2rk1/pppp1ppp/1bn5/n2RP1B1/Q1B1P3/N1P2N2/Pq4PP/1R5K b - - 3 16",
                    "players": [
                        {
                        "name": "Carlsen, Magnus",
                        "title": "GM",
                        "rating": 2828,
                        "clock": 56000,
                        "fed": "NOR"
                        },
                        {
                        "name": "Anand, Viswanathan",
                        "title": "GM",
                        "rating": 2749,
                        "clock": 56000,
                        "fed": "IND"
                        }
                    ],
                    "lastMove": "a1b1",
                    "thinkTime": 63,
                    "status": "*"
                    },
                    {
                    "id": "upvSjlTk",
                    "name": "Nakamura, Hikaru - Amin, Bassem",
                    "fen": "r1b2rk1/pp1p1ppp/6n1/3p2B1/4P2P/5N2/P4PP1/b2Q1BK1 b - - 1 18",
                    "players": [
                        {
                        "name": "Nakamura, Hikaru",
                        "title": "GM",
                        "rating": 2746,
                        "fed": "USA"
                        },
                        {
                        "name": "Amin, Bassem",
                        "title": "GM",
                        "rating": 2583,
                        "fed": "EGY"
                        }
                    ],
                    "lastMove": "b3d1",
                    "thinkTime": 4,
                    "status": "*"
                    }
                ],
                "group": {
                    "name": "UzChess Cup 2024",
                    "tours": [
                    {
                        "id": "YtMYEYu9",
                        "name": "Masters"
                    },
                    {
                        "id": "d6fsqyMV",
                        "name": "Challengers"
                    },
                    {
                        "id": "vntwlrw6",
                        "name": "Futures"
                    }
                    ]
                }
                
                },
            }
       
        ),
        500: "Error fetching data from Lichess API"
    },
    operation_description="Fetch details of a specific tournament round.",
    operation_summary="Get Tournament Round Details"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_tournament_round(request, tournamentSlug, roundSlug, roundId):
    """
    Fetches tournament round details from Lichess API.
    """
    # Build the Lichess API endpoint URL
    lichess_url = f"{LICHESS_BROADCAST_API}/{tournamentSlug}/{roundSlug}/{roundId}"
    
    try:
        # Make the API request
        response = requests.get(lichess_url)
        response.raise_for_status()

        # Return the data as is
        return Response(response.json(), status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({"error": f"Error fetching data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# Swagger parameter for roundId
round_id_param = openapi.Parameter(
    'roundId',
    in_=openapi.IN_PATH,
    description="The round ID (8 characters) used to fetch the PGN.",
    type=openapi.TYPE_STRING,
    required=True
)

def parse_pgn_with_game_ids(pgn_text):
    """
    Parses PGN text and maps game IDs (from the Site field) to their corresponding PGN,
    ensuring all PGN content (headers + moves) is captured correctly.
    """
    games = {}
    current_game_id = None
    current_pgn = []
    print("pgn_text", pgn_text)
    # Split PGN data into blocks: headers + moves separated by at least two newlines
    pgn_blocks = re.split(r'\n\n\n', pgn_text.strip())

    for block in pgn_blocks:
        print("block", block)
        lines = block.strip().splitlines()
        current_game_id = None
        current_pgn = []

        # Extract game ID from the Site header
        for line in lines:
            current_pgn.append(line)  # Add every line to the current PGN
            if line.startswith("[Site"):
                match = re.search(r"https://lichess\.org/broadcast/.*/.*/(?P<game_id>\w+)", line)
                if match:
                    print("match", match)
                    current_game_id = match.group("game_id")
        
        # If a valid game ID is found, store the PGN
        if current_game_id:
            games[current_game_id] = "\n".join(current_pgn)

    return games


def parse_pgn_with_player_names(pgn_text):
    """
    Parses PGN text and maps games using player names as keys in the format:
    'WhitePlayer - BlackPlayer'.
    """
    games = {}
    current_pgn = []
    white_player = None
    black_player = None

    # Split PGN data into blocks: headers + moves separated by at least two newlines
    pgn_blocks = re.split(r'\n\n\n', pgn_text.strip())

    for block in pgn_blocks:
        lines = block.strip().splitlines()
        current_pgn = []
        white_player = None
        black_player = None

        for line in lines:
            current_pgn.append(line)  # Add all lines (headers + moves) to the current PGN
            if line.startswith("[White "):
                white_player = re.search(r'\"(.+?)\"', line).group(1)
            elif line.startswith("[Black "):
                black_player = re.search(r'\"(.+?)\"', line).group(1)

        # Generate the key: "WhitePlayer - BlackPlayer"
        if white_player and black_player:
            game_key = f"{white_player} - {black_player}"
            games[game_key] = "\n".join(current_pgn)

    return games

@swagger_auto_schema(
    method='get',
    manual_parameters=[round_id_param],
    responses={
        200: openapi.Response(
            description="PGN representation mapped by player names",
            examples={
                "application/json": {
                    "games": {
                        "Predojevic, Borki - Harikrishna, Pentala": "[Event \"Deutsche Schachbundesliga 24-25\"]\n[Site \"https://lichess.org/broadcast/-/-/uU0gySB0\"]\n[Date \"2024.09.28\"]\n[Round \"1.16\"]\n[White \"Predojevic, Borki\"]\n[Black \"Harikrishna, Pentala\"]\n[Result \"1/2-1/2\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6",
                        "Carlsen, Magnus - Anand, Viswanathan": "[Event \"Another Tournament\"]\n[Site \"https://lichess.org/broadcast/-/-/anotherID\"]\n[Date \"2024.09.28\"]\n[Round \"1.2\"]\n[White \"Carlsen, Magnus\"]\n[Black \"Anand, Viswanathan\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"
                    }
                }
            }
        ),
        404: "Tournament round not found",
        500: "Error fetching PGN from Lichess API"
    },
    operation_description="Fetch and return PGNs mapped to player names for a specific tournament round.",
    operation_summary="Get Tournament Round PGNs Mapped by Player Names"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_tournament_round_pgn(request, roundId):
    """
    Fetch PGN representation of all games in a specific tournament round,
    and map them to player names extracted from the PGN headers.
    """
    # Construct the API URL for the PGN
    lichess_url = f"{LICHESS_BROADCAST_API}/round/{roundId}.pgn"

    try:
        # Fetch the PGN from Lichess
        response = requests.get(lichess_url)
        response.raise_for_status()

        # Parse PGN and map it to player names
        pgn_text = response.text
        games = parse_pgn_with_player_names(pgn_text)

        if not games:
            return Response({"error": "No valid games found in the PGN data"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"games": games}, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException as e:
        return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    method='get',
    operation_description="Fetch all annotations for a specific game. Returns a list of annotations related to the game's moves.",
    operation_summary="Get All Annotations for a Game",
    manual_parameters=[auth_header],
    responses={
        200: openapi.Response(
            description="List of annotations for the game retrieved successfully",
            examples={
                'application/json': [
                    {
                        "@context": "http://www.w3.org/ns/anno.jsonld",
                        "id": "341c8d29-867d-43f6-8892-9f675ea7d8c5",
                        "type": "Annotation",
                        "created": "2024-03-14T12:00:00Z",
                        "modified": "2024-03-14T12:00:00Z",
                        "creator": {
                            "id": "user-1",
                            "name": "currentUser",
                            "type": "Person"
                        },
                        "body": {
                            "type": "TextualBody",
                            "value": "Opening position - Classic setup",
                            "format": "text/plain"
                        },
                        "target": {
                            "type": "ChessPosition",
                            "source": "http://example.com/games/7",
                            "state": {
                                "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                                "moveNumber": 1
                            }
                        },
                        "motivation": "commenting"
                    }
                ]
            }
        ),
        404: openapi.Response(
            description="Game not found",
            examples={
                'application/json': {
                    "error": "Game not found"
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@swagger_auto_schema(
    method='post',
    operation_description="Create a new annotation for a specific game.",
    operation_summary="Create an Annotation for a Game",
    manual_parameters=[auth_header],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "@context": openapi.Schema(type=openapi.TYPE_STRING, description="Context for the annotation", example="http://www.w3.org/ns/anno.jsonld"),
            "type": openapi.Schema(type=openapi.TYPE_STRING, description="Type of annotation", example="Annotation"),
            "body": openapi.Schema(
                type=openapi.TYPE_OBJECT, 
                properties={
                    "type": openapi.Schema(type=openapi.TYPE_STRING, description="Type of body", example="TextualBody"),
                    "value": openapi.Schema(type=openapi.TYPE_STRING, description="Content of the annotation", example="Opening position - Classic setup"),
                    "format": openapi.Schema(type=openapi.TYPE_STRING, description="Format of the annotation body", example="text/plain")
                }
            ),
            "target": openapi.Schema(
                type=openapi.TYPE_OBJECT, 
                properties={
                    "state": openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        "fen": openapi.Schema(type=openapi.TYPE_STRING, description="FEN notation", example="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"),
                        "moveNumber": openapi.Schema(type=openapi.TYPE_INTEGER, description="Move number", example=1)
                    }),
                    "source": openapi.Schema(type=openapi.TYPE_STRING, description="URL of the game", example="http://localhost/games/1")
                }
            ),
            "motivation": openapi.Schema(type=openapi.TYPE_STRING, description="Reason for annotation", example="commenting")
        }
    ),
    responses={
        201: openapi.Response(
            description="Annotation created successfully",
            examples={
                'application/json': {
                    "id": "341c8d29-867d-43f6-8892-9f675ea7d8c5",
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "type": "Annotation",
                    "body": {
                        "value": "Opening position - Classic setup"
                    },
                    "target": {
                        "state": {
                            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                        }
                    },
                    "motivation": "commenting"
                }
            }
        ),
        400: openapi.Response(
            description="Bad request",
            examples={
                'application/json': {
                    "error": "Invalid data"
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def annotations_list_create(request, game_id):
    if request.method == 'GET':
        annotations = Annotation.objects.filter(game_id=game_id)
        serializer = AnnotationSerializer(annotations, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data
        game = get_object_or_404(Game, id=game_id)  # Oyunu veritabanından al
        data['creator'] = request.user.id  # Yaratıcıyı ekle
        serializer = AnnotationSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            # save() metodu ile ForeignKey ilişkilendirmesini yapıyoruz.
            annotation = serializer.save(game=game, creator=request.user)
            response_serializer = AnnotationSerializer(annotation)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description="Update an existing annotation for a specific game.",
    operation_summary="Update an Annotation for a Game",
    manual_parameters=[auth_header],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "body": openapi.Schema(
                type=openapi.TYPE_OBJECT, 
                properties={
                    "value": openapi.Schema(type=openapi.TYPE_STRING, description="Updated comment", example="Updated content"),
                }
            ),
            "modified": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="The modification timestamp", example="2024-03-14T12:10:00Z")
        }
    ),
    responses={
        200: openapi.Response(
            description="Annotation updated successfully",
            examples={
                'application/json': {
                    "id": "341c8d29-867d-43f6-8892-9f675ea7d8c5",
                    "body": {
                        "value": "Updated content"
                    }
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete an annotation for a specific game.",
    operation_summary="Delete an Annotation for a Game",
    responses={
        200: openapi.Response(
            description="Annotation deleted successfully",
            examples={
                'application/json': {
                    "message": "Annotation deleted successfully"
                }
            }
        ),
        401: openapi.Response(
            description="Authentication required",
            examples={
                'application/json': {
                    "detail": "Authentication credentials were not provided."
                }
            }
        )
    }
)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def annotation_detail(request, game_id, anno_id):
    annotation = get_object_or_404(Annotation, id=anno_id, game_id=game_id)
    
    if request.method == 'PUT':
        if request.user != annotation.creator:
            return Response({"error": "Only the creator can update this annotation."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = AnnotationSerializer(annotation, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            annotation = serializer.save()
            response_serializer = AnnotationSerializer(annotation)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        if request.user != annotation.creator:
            return Response({"error": "Only the creator can delete this annotation."}, status=status.HTTP_403_FORBIDDEN)
        
        annotation.delete()
        return Response({"message": "Annotation deleted successfully."}, status=status.HTTP_200_OK)