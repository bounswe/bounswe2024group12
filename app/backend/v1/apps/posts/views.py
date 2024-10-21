from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from v1.apps.posts.models import Post
from v1.apps.posts.serializers import PostSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination


# Swagger documentation for POST /api/v1/posts/create/
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_image': openapi.Schema(type=openapi.TYPE_STRING, description='Base64 encoded image string'),  # Updated for base64
            'title': openapi.Schema(type=openapi.TYPE_STRING, description='Post title'),
            'fen': openapi.Schema(type=openapi.TYPE_STRING, description='FEN notation string'),
            'post_text': openapi.Schema(type=openapi.TYPE_STRING, description='Text content for the post'),
            'tags': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_STRING),
                description='List of tags as strings'
            ),
        },
        required=['title'],  # All fields are optional except title
        example={
            'post_image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',  # Example base64 string
            'title': 'My Chess Post',
            'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',  # Sample FEN string
            'post_text': 'This is an example post about a chess position.',  # Sample text content
            'tags': ['a', 'b', 'c']
        }
    ),
    operation_description="Create a post with an optional base64-encoded image, FEN notation, text content and a list of tags. Requires authentication.",
    operation_summary="Create a new post",
    responses={
        201: openapi.Response(
            description="Post created successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'post_image': '/media/post_images/example.jpg',  # Example image path
                    'title': 'My Chess Post',
                    'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                    'post_text': 'This is an example post about a chess position.',
                    'tags': ['a', 'b', 'c'],
                    'created_at': '2024-10-16T12:00:00Z',
                    'username': 'example_user'
                }
            }
        ),
        400: openapi.Response(
            description="Invalid input",
            examples={
                'application/json': {
                    'post_image': ['Invalid image format.'],
                    'fen': ['This field is required.'],
                }
            }
        )
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save(user=request.user)  # Assuming the user is authenticated
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Swagger documentation for GET /api/v1/posts/{post_id}/
@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'post_id',  # Name of the path parameter
            openapi.IN_PATH,  # Indicates this parameter is in the URL path
            description="ID of the post to retrieve",  # Description of what this parameter is
            type=openapi.TYPE_INTEGER  # Type of the parameter (integer)
        )
    ],
    responses={
        200: openapi.Response(
            description="Post retrieved successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'post_image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',  # Base64 string 
                    'title': 'My Chess Post',
                    'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                    'post_text': 'This is an example post about a chess position.',
                    'tags': ['a', 'b', 'c'],
                    'created_at': '2024-10-16T12:00:00Z',
                    'user': 1
                }
            }
        ),
        404: openapi.Response(
            description="Post not found",
            examples={
                'application/json': {
                    'error': 'Post not found'
                }
            }
        )
    },
    operation_description="Retrieve a specific post by its ID.",
    operation_summary="Get post by ID"
)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
class PostPagination(PageNumberPagination):
    page_size = 10  # 10 post per page


@swagger_auto_schema(
    method='get',
    operation_description="Retrieve all posts with pagination.",
    operation_summary="List all posts with pagination",
    responses={
        200: openapi.Response(
            description="List of posts retrieved successfully with pagination",
            examples={
                'application/json': {
                    'count': 100,  # Total number of posts
                    'next': 'http://api.example.com/posts/?page=2',  # Next page URL
                    'previous': None,  # Previous page URL
                    'results': [
                        {
                            'id': 1,
                            'post_image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
                            'title': 'My Chess Post 1',
                            'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                            'post_text': 'This is an example post about a chess position.',
                            'tags': ['a', 'b', 'c'],
                            'created_at': '2024-10-16T12:00:00Z',
                            'user': 'example_user'
                        },
                        {
                            'id': 2,
                            'post_image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
                            'title': 'My Chess Post 2',
                            'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                            'post_text': 'Another example post.',
                            'tags': ['c', 'd'],
                            'created_at': '2024-10-17T10:00:00Z',
                            'user': 'another_user'
                        }
                    ]
                }
            }
        ),
        400: openapi.Response(
            description="Invalid request",
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_posts(request):
    posts = Post.objects.all()  # Get all posts
    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True) # Serialize multiple posts
    return paginator.get_paginated_response(serializer.data)


