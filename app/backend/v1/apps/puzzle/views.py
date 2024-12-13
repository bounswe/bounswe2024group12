from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from v1.apps.headers import auth_header
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import requests
import os 

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
