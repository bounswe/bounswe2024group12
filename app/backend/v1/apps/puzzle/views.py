from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from v1.apps.headers import auth_header
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import requests
import os 
from django.shortcuts import render
import json
import v1.apps.puzzle.data.angles as angles


LICHESS_API_BASE_URL = "https://lichess.org/api"
LICHESS_ACCESS_TOKEN = os.getenv('LICHESS_ACCESS_TOKEN')

@swagger_auto_schema(
    method='get',
    operation_description="Fetch the daily puzzle from Lichess API.",
    responses={
        200: openapi.Response('Daily puzzle fetched successfully', examples={
            'application/json': {
  "game": {
    "clock": "3+0",
    "id": "AHGPPS44",
    "perf": {
      "key": "blitz",
      "name": "Blitz"
    },
    "pgn": "d4 d5 Bf4 Bf5 Nf3 e6 c4 Nf6 Nc3 Bd6 Bg3 Nbd7 e3 O-O c5 Bxg3 hxg3 h6 Bd3 Ne4 Qc2 Ndf6 Nd2 Nxc3 Bxf5 exf5 bxc3 Ne4 Nxe4 fxe4 Rb1 b6 Rh5 bxc5 Rb5 cxd4 cxd4 c6 Qxc6 Rc8 Qxd5 Qf6 Qxe4 Rc1+ Ke2 Qa6 Qd5 Rc2+ Kf3 g6 Rxh6 Qf6+ Ke4",
    "players": [
      {
        "color": "white",
        "flair": "travel-places.ambulance",
        "id": "ericrosen",
        "name": "EricRosen",
        "patron": True,
        "rating": 2642,
        "title": "IM"
      },
      {
        "color": "black",
        "id": "anton_volovikov",
        "name": "Anton_Volovikov",
        "rating": 2619,
        "title": "FM"
      }
    ],
    "rated": True
  },
  "puzzle": {
    "id": "PSjmf",
    "initialPly": 52,
    "plays": 566,
    "rating": 2705,
    "solution": [
      "g8g7",
      "d5e5",
      "f6e5"
    ],
    "themes": [
      "endgame",
      "master",
      "short",
      "masterVsMaster",
      "crushing"
    ]
  }
}
        }),
        500: openapi.Response('Error fetching daily puzzle')
    },
    operation_summary="Get Daily Puzzle"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def daily_puzzle(request):
    """
    Fetch the daily puzzle from Lichess API.
    """
    url = f"{LICHESS_API_BASE_URL}/puzzle/daily"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an error for HTTP errors (non-2xx responses)
        return JsonResponse(response.json(), safe=False, status=200)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'angle',
            openapi.IN_QUERY,
            description="The theme or opening to filter puzzles with. Available themes are listed in the Lichess source code.",
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'difficulty',
            openapi.IN_QUERY,
            description="The desired puzzle difficulty (easiest, easier, normal, harder, hardest). Defaults to 1500 if anonymous.",
            type=openapi.TYPE_STRING,
            
        )
    ],
    operation_description="Fetch a random puzzle from Lichess API with optional filters for theme or difficulty.",
    responses={
        200: openapi.Response('Random puzzle fetched successfully', examples={
            'application/json': {
                "game": {
                    "id": "XQgXJPWX",
                    "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ...",
                    "players": [
                        {"name": "Carlsen", "rating": 2870, "title": "GM"},
                        {"name": "Nepo", "rating": 2780, "title": "GM"}
                    ]
                },
                "puzzle": {
                    "id": "wUoWR",
                    "rating": 1850,
                    "themes": ["middlegame", "advantage"],
                    "solution": ["e4", "f5", "Qe7"]
                }
            }
        }),
        500: openapi.Response('Error fetching random puzzle')
    },
    operation_summary="Get Random Puzzle"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def random_puzzle(request):
    """
    Fetch a random puzzle from Lichess API with optional filters for theme or difficulty.
    """
    url = f"{LICHESS_API_BASE_URL}/puzzle/next"
    params = {}

    # Extract optional parameters from the request
    angle = request.query_params.get('angle')
    difficulty = request.query_params.get('difficulty')

    if angle:
        params['angle'] = angle
    if difficulty:
        params['difficulty'] = difficulty

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raise an error for HTTP errors (non-2xx responses)
        return JsonResponse(response.json(), safe=False, status=200)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)
    


@swagger_auto_schema(
    method='get',
    operation_description="Fetch a list of available themes and descriptions for puzzles.",
    responses={
        200: openapi.Response('Themes and angles fetched successfully', examples={
            'application/json': {
               "castling": "Bring the king to safety, and deploy the rook for attack.",
                "capturingDefender": "Removing a piece that is critical to defence of another piece, allowing the now undefended piece to be captured on a following move.",
                "...": "..."
            }
        }),
        500: openapi.Response('Error fetching themes and angles')
    },
)
@api_view(['GET'])
@permission_classes([AllowAny])
def puzzle_angles_json(request):
    """
    Fetch a list of available angles for puzzles.
    """
    return JsonResponse(angles.angles, safe=False, status=200)
    
    

puzzle_id_param = openapi.Parameter(
    'id',
    openapi.IN_PATH,
    description="The puzzle ID",
    type=openapi.TYPE_STRING,
    required=True
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[puzzle_id_param],
    responses={
        200: openapi.Response(
            description="The requested puzzle",
            examples={
                'application/json': {
        "game": {
            "id": "AHGPPS44",
            "perf": {
            "key": "blitz",
            "name": "Blitz"
            },
            "rated": True,
            "players": [
            {
                "name": "EricRosen",
                "title": "IM",
                "flair": "travel-places.ambulance",
                "patron": True,
                "id": "ericrosen",
                "color": "white",
                "rating": 2642
            },
            {
                "name": "Anton_Volovikov",
                "title": "FM",
                "id": "anton_volovikov",
                "color": "black",
                "rating": 2619
            }
            ],
            "pgn": "d4 d5 Bf4 Bf5 Nf3 e6 c4 Nf6 Nc3 Bd6 Bg3 Nbd7 e3 O-O c5 Bxg3 hxg3 h6 Bd3 Ne4 Qc2 Ndf6 Nd2 Nxc3 Bxf5 exf5 bxc3 Ne4 Nxe4 fxe4 Rb1 b6 Rh5 bxc5 Rb5 cxd4 cxd4 c6 Qxc6 Rc8 Qxd5 Qf6 Qxe4 Rc1+ Ke2 Qa6 Qd5 Rc2+ Kf3 g6 Rxh6 Qf6+ Ke4",
            "clock": "3+0"
        },
        "puzzle": {
            "id": "PSjmf",
            "rating": 2735,
            "plays": 627,
            "solution": [
            "g8g7",
            "d5e5",
            "f6e5"
            ],
            "themes": [
            "endgame",
            "master",
            "short",
            "masterVsMaster",
            "crushing"
            ],
            "initialPly": 52
        }
        }
            }
        ),
        404: openapi.Response(description="Puzzle not found"),
        500: openapi.Response(description="Internal server error")
    },
    operation_description="Get a single Lichess puzzle by its ID.",
    operation_summary="Get Puzzle by ID"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_puzzle_by_id(request, id):
    """
    Fetches a puzzle by its ID from the Lichess API.
    """
    try:
        url = f"{LICHESS_API_BASE_URL}/puzzle/{id}"
        response = requests.get(url)

        if response.status_code == 200:
            return JsonResponse(response.json(), safe=False, status=200)
        elif response.status_code == 404:
            return JsonResponse({"error": "Puzzle not found"}, status=404)
        else:
            return JsonResponse({"error": "Failed to fetch puzzle"}, status=response.status_code)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": "Internal server error", "details": str(e)}, status=500)