from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from django.contrib.accounts.models import User
# from django.contrib.accounts import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Sign-up view
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'mail': openapi.Schema(type=openapi.TYPE_STRING, description="User's email"),
            'username': openapi.Schema(type=openapi.TYPE_STRING, description="User's username"),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description="User's password")
        },
        required=['mail', 'username', 'password']
    ),
    responses={
        201: openapi.Response('User created successfully'),
        400: 'Invalid input'
    },
    operation_description="Create a new user account",
    operation_summary="Sign-up endpoint"
)
@api_view(['POST'])
def sign_up(request):
    email = request.data.get('mail')
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not email or not username or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # if User.objects.filter(email=email).exists():
    #     return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
    # user = User.objects.create_user(username=username, email=email, password=password)


    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

# Login view
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'mail': openapi.Schema(type=openapi.TYPE_STRING, description="User's email"),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description="User's password")
        },
        required=['mail', 'password']
    ),
    responses={
        200: openapi.Response('Login successful', examples={'application/json': {
            'username': 'user123',
            'token': 'eyJ0eXAiOiJKV1Q...'
        }}),
        400: 'Invalid credentials'
    },
    operation_description="Log in an existing user",
    operation_summary="Login endpoint"
)


@api_view(['POST'])
def login(request):
    email = request.data.get('mail')
    password = request.data.get('password')
    
    user = {
        'username': 'user123',
        'mail': email
        }
    # user = Our authenticate function (a)
    
    if user is not None:
        
        return Response({
            'username': user['username'],
            'token': str("some_token")
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
