from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# Define the Authorization header
auth_header = openapi.Parameter(
    'Authorization',
    in_=openapi.IN_HEADER,
    description="JWT Authorization header. Example: 'Bearer <token>token_string'",
    type=openapi.TYPE_STRING
)

@swagger_auto_schema(
    method='get',
    manual_parameters=[auth_header],  # Indicate Authorization header is required
    responses={200: openapi.Response('OK', examples={'application/json': {'status': 'OK'}})},
    operation_description="Check API health (requires JWT token)",
    operation_summary="Health Check (requires authentication)"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Require JWT authentication
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
    

# Mock endpoint for testing
@api_view(['GET'])
@permission_classes([AllowAny])  # No authentication required
def mock(request):
    return JsonResponse({"message": "This is a mock endpoint for testing purposes."})