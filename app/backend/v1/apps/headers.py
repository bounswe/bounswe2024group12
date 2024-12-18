from drf_yasg import openapi


# Define the Authorization header
auth_header = openapi.Parameter(
    'Authorization',
    in_=openapi.IN_HEADER,
    description="JWT Authorization header.You should enter 'token' that you get from Login. Example: 'Bearer <token>token_string'",
    type=openapi.TYPE_STRING,
    required=True
)