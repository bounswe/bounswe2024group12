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
from v1.apps.posts.models import PostBookmark, Like
from v1.apps.games.models import GameBookmark, GameMoveBookmark
from django.shortcuts import get_object_or_404
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


#Get all user-related data for the user page.
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve all user-related information for the authenticated user's profile page. This includes the user's general information (username, email, etc.), bookmarks (post, game, and game move), likes, followers, and followings.",
    operation_summary="Get User Page Data",
    responses={
        200: openapi.Response(
            description="User page data retrieved successfully",
            examples={
                'application/json': {
                    "username": "chessmaster",
                    "email": "chessmaster@example.com",
                    "first_name": "Chess",
                    "last_name": "Master",
                    "date_joined": "2024-01-12T15:23:45Z",
                    "post_bookmarks": [
                        {
                            "post__id": 1,
                            "post__title": "The Greatest Chess Game of All Time"
                        },
                        {
                            "post__id": 2,
                            "post__title": "How to Win in 10 Moves"
                        }
                    ],
                    "game_bookmarks": [
                        {
                            "game__id": 7,
                            "game__white": "Kasparov",
                            "game__black": "Deep Blue",
                            "game__year": 1997
                        },
                        {
                            "game__id": 10,
                            "game__white": "Fischer",
                            "game__black": "Spassky",
                            "game__year": 1972
                        }
                    ],
                    "game_move_bookmarks": [
                        {
                            "game__id": 7,
                            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
                        }
                    ],
                    "post_likes": [
                        {
                            "post__id": 5,
                            "post__title": "Top 5 Chess Strategies"
                        },
                        {
                            "post__id": 9,
                            "post__title": "Chess Openings for Beginners"
                        }
                    ],
                    "followers": [
                        {
                            "follower__id": 2,
                            "follower__username": "another_user"
                        }
                    ],
                    "following": [
                        {
                            "following__id": 5,
                            "following__username": "grandmaster"
                        }
                    ]
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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_page(request):
    user = request.user

    # Get Bookmarks
    post_bookmarks = PostBookmark.objects.filter(user=user).values('post__id', 'post__title')
    game_bookmarks = GameBookmark.objects.filter(user=user).values('game__id', 'game__white', 'game__black', 'game__year')
    game_move_bookmarks = GameMoveBookmark.objects.filter(user=user).values('game__id', 'fen')

    # Get Likes
    post_likes = Like.objects.filter(user=user).values('post__id', 'post__title')

    # Get Followers and Following
    followers = Follow.objects.filter(following=user).values('follower__id', 'follower__username')
    following = Follow.objects.filter(follower=user).values('following__id', 'following__username')

    # Return user data
    user_data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
        'post_bookmarks': list(post_bookmarks),
        'game_bookmarks': list(game_bookmarks),
        'game_move_bookmarks': list(game_move_bookmarks),
        'post_likes': list(post_likes),
        'followers': list(followers),
        'following': list(following),
    }

    return Response(user_data, status=status.HTTP_200_OK)



@swagger_auto_schema(
    method='get',
    operation_description="Retrieve public profile of a specific user by user_id. Returns user's basic information, post likes, followers, and following details.",
    operation_summary="Get User Profile by User ID",
    responses={
        200: openapi.Response(
            description="User profile retrieved successfully",
            examples={
                'application/json': {
                    'username': 'chessmaster',
                    'email': 'chessmaster@example.com',
                    'first_name': 'Garry',
                    'last_name': 'Kasparov',
                    'date_joined': '2023-12-10T18:25:43.511Z',
                    'post_likes': [
                        {'post_id': 1, 'post_title': 'How to Win in 10 Moves'},
                        {'post_id': 2, 'post_title': 'The Greatest Chess Game of All Time'}
                    ],
                    'followers': [
                        {'follower_id': 2, 'follower_username': 'john_doe'},
                        {'follower_id': 3, 'follower_username': 'jane_doe'}
                    ],
                    'following': [
                        {'following_id': 4, 'following_username': 'chess_pro'},
                        {'following_id': 5, 'following_username': 'game_master'}
                    ]
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
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_profile(request, user_id):
    # Retrieve user
    user = get_object_or_404(CustomUser, id=user_id)
    post_likes = Like.objects.filter(user=user).values('post__id', 'post__title')
    followers = Follow.objects.filter(following=user).values('follower__id', 'follower__username')
    following = Follow.objects.filter(follower=user).values('following__id', 'following__username')
    
    response_data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
        'post_likes': list(post_likes),  # post id and title
        'followers': list(followers),  # follower id and username
        'following': list(following)  # following id and username
    }
    
    return Response(response_data, status=status.HTTP_200_OK)