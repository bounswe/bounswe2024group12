from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from v1.apps.headers import auth_header


# Define the Authorization header


@swagger_auto_schema(
    method='get',  
    responses={200: openapi.Response('OK', examples={'application/json': {'status': 'OK'}})},
    operation_description="Check API health",
    operation_summary="Health Check"
)
@api_view(['GET'])
@permission_classes([AllowAny])  # Require JWT authentication
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
@permission_classes([AllowAny])  # No authentication required
def hc_db(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({"db_status": "healthy"}, status=200)
    except Exception as e:
        return JsonResponse({"db_status": "unhealthy", "error": str(e)}, status=500)
    

@swagger_auto_schema(
    method='get',
    manual_parameters=[auth_header],
    responses={200: openapi.Response('OK', examples={'application/json': {'status': 'OK'}})},
    operation_description="Check API health with authentication",
    operation_summary="Health Check (with authentication)"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # test for authentication
def hc_auth(request):
    return JsonResponse({"status": "OK"}, status=200)