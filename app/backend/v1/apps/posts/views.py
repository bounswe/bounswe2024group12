from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from v1.apps.posts.models import Post
from v1.apps.posts.serializers import PostSerializer

# TODO: Add user to the posts after creating user model


# Swagger documentation for POST /api/v1/posts/create/
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_image': openapi.Schema(type=openapi.TYPE_FILE, description='Post image file'),
            'fen': openapi.Schema(type=openapi.TYPE_STRING, description='FEN notation string'),
            'post_text': openapi.Schema(type=openapi.TYPE_STRING, description='Text content for the post'),
        },
        required=[],  # All fields are optional
        example={
            'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',  # Sample FEN string
            'post_text': 'This is an example post about a chess position.'  # Sample text content
        }
    ),
    operation_description="Create a post with an optional image, FEN notation, and text content.",
    operation_summary="Create a new post",
    responses={
        201: openapi.Response(
            description="Post created successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'post_image': '/media/post_images/example.jpg',  # Example image path
                    'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                    'post_text': 'This is an example post about a chess position.',
                    'created_at': '2024-10-16T12:00:00Z',
                    'user': 1
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
def create_post(request):

    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        #post = serializer.save(user=request.user)  # Assuming the user is authenticated
        post = serializer.save()
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
                    'post_image': '/media/post_images/example.jpg',
                    'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                    'post_text': 'This is an example post about a chess position.',
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
def get_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
