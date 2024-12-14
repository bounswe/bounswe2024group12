from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from v1.apps.accounts.models import CustomUser, Follow
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

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
@permission_classes([AllowAny])
def sign_up(request):
    email = request.data.get('mail')
    username = request.data.get('username')
    password = request.data.get('password')

    if not email or not username or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
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
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('mail')
    password = request.data.get('password')

    # Find the user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    # Authenticate the user
    user = authenticate(username=user.username, password=password)

    if user is not None:
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'username': user.username,
            'token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

@swagger_auto_schema(
    method='post',
    operation_description="Toggle follow/unfollow for a specific user. If the user is not followed, the current user will follow them. If the user is already followed, the follow will be removed.",
    operation_summary="Toggle Follow on a User",
    responses={
        201: openapi.Response(
            description="User followed successfully",
            examples={
                'application/json': {
                    'message': 'User followed successfully'
                }
            }
        ),
        200: openapi.Response(
            description="User unfollowed successfully",
            examples={
                'application/json': {
                    'message': 'User unfollowed successfully'
                }
            }
        ),
        404: openapi.Response(
            description="User not found",
            examples={
                'application/json': {
                    'error': 'User not found'
                }
            }
        )
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, user_id):
    try:
        following_user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    follower = request.user
    if follower == following_user:
        return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

    follow_instance, created = Follow.objects.get_or_create(follower=follower, following=following_user)

    if not created:
        follow_instance.delete()
        return Response({"message": "User unfollowed successfully"}, status=status.HTTP_200_OK)
    
    return Response({"message": "User followed successfully"}, status=status.HTTP_201_CREATED)
