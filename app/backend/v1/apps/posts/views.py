from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create a post
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_image': openapi.Schema(type=openapi.TYPE_STRING, description="Post image URL"),
            'fen': openapi.Schema(type=openapi.TYPE_STRING, description="FEN string"),
            'post_text': openapi.Schema(type=openapi.TYPE_STRING, description="Post text")
        },
        required=['post_image', 'fen', 'post_text']
    ),
    responses={
        201: openapi.Response('Post created successfully'),
        400: 'Invalid input'
    },
    operation_description="Create a new post",
    operation_summary="Create post"
)
@api_view(['POST'])
def create_post(request):
     
    # return success response
    return Response({"message": "Post created successfully"}, status=status.HTTP_201_CREATED)

# Get a post by ID
@swagger_auto_schema(
    method='get',
    responses={
        200: 'Post retrieved successfully',
        404: 'Post not found'
    },
    operation_description="Retrieve a post by its ID",
    operation_summary="Get post by ID"
)
@api_view(['GET'])
def get_post(request, post_id):
    try: 
        # return success response
        return Response({"message": "Post retrieved successfully"})
    except:
        # return error response
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
