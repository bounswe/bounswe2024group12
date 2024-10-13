from django.shortcuts import render

from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    method='get',
    responses={200: openapi.Response('OK', examples={'application/json': {'status': 'OK'}})}
)
@api_view(['GET'])
def hc(request):
    return JsonResponse({"status": "OK"}, status=200)

@swagger_auto_schema(
    method='get',
    responses={
        200: openapi.Response('Database is healthy', examples={'application/json': {'db_status': 'healthy'}}),
        500: openapi.Response('Database connection error', examples={'application/json': {'db_status': 'unhealthy', 'error': 'Error message'}})
    }
)
@api_view(['GET'])
def hc_db(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({"db_status": "healthy"}, status=200)
    except Exception as e:
        return JsonResponse({"db_status": "unhealthy", "error": str(e)}, status=500)
