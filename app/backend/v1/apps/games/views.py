from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from v1.apps.headers import auth_header
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Game, GameComment, GameBookmark, GameMoveBookmark
import requests
import os

from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .serializers import GameCommentSerializer


# Swagger Parameters

# Define the Lichess Masters database endpoint
LICHESS_MASTERS_API = "https://explorer.lichess.ovh/masters"
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
            description="The PGN representation of Masters Game.",
            examples={'application/json': {'pgn': '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ...'}}
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
    operation_description="Fetch the PGN representation of a master game from public API's.",
    operation_summary="Get PGN for a specific game"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Allow public access
def master_game(request, game_id):
    """
    Fetches the PGN of a game from the Lichess Masters database.
    """
    try:
        # Construct the Lichess API URL
        url = f"https://explorer.lichess.ovh/masters/pgn/{game_id}"

        # Make the GET request with the Authorization header
        headers = {
            "Authorization": f"Bearer {LICHESS_ACCESS_TOKEN}"
        }
        response = requests.get(url, headers=headers)

        # Check the response status
        if response.status_code == 200:
            return JsonResponse({"pgn": response.text}, status=200)
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