from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from v1.apps.posts.models import Post, Like, Comment
from v1.apps.posts.serializers import PostSerializer, LikeSerializer, CommentSerializer

from rest_framework.permissions import IsAuthenticated, AllowAny
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
            'post_id',  
            openapi.IN_PATH,  
            description="ID of the post to retrieve",  
            type=openapi.TYPE_INTEGER  
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


# Like/Unlike a Post
@swagger_auto_schema(
    method='post',
    operation_description="Toggle like/unlike for a specific post.",
    operation_summary="Like/Unlike a Post",
    responses={
        201: openapi.Response("Post liked", examples={"application/json": {"message": "Post liked"}}),
        200: openapi.Response("Post unliked", examples={"application/json": {"message": "Post unliked"}}),
        404: "Post not found"
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = Post.objects.get(id=post_id)
    user = request.user
    like, created = Like.objects.get_or_create(user=user, post=post)

    if not created:  # if like exist than dislike it 
        like.delete()
        return Response({"message": "Post unliked"}, status=status.HTTP_200_OK)
    
    return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
        },
        required=['post_ids']
    ),
    operation_description="Get like count and like status for multiple posts.",
    operation_summary="Like Summary for Multiple Posts",
    responses={
        200: openapi.Response(
            description="Like summary retrieved",
            examples={"application/json": [
                {"post_id": 1, "like_count": 10, "liked_by_requester": True},
                {"post_id": 2, "like_count": 5, "liked_by_requester": False},
                {"post_id": 3, "error": "Post not found"}
            ]}
        ),
        400: "Invalid request"
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_likes_summary(request):
    post_ids = request.data.get('post_ids', [])

    # like counts and requester’s like status for the posts
    response_data = []
    for post_id in post_ids:
        try:
            post = Post.objects.get(id=post_id)
            like_count = post.likes.count()
            liked_by_requester = post.likes.filter(user=request.user).exists()

            response_data.append({
                'post_id': post_id,
                'like_count': like_count,
                'liked_by_requester': liked_by_requester
            })
        except Post.DoesNotExist:
            response_data.append({
                'post_id': post_id,
                'error': 'Post not found'
            })

    return Response(response_data, status=200)

# Comment on a Post
comment_id_param = openapi.Parameter(
    'comment_id', openapi.IN_PATH, description="ID of the comment to update or delete", type=openapi.TYPE_INTEGER
)
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={'text': openapi.Schema(type=openapi.TYPE_STRING, description="Comment text")},
        required=['text']
    ),
    operation_description="Add a new comment to a specific post.",
    operation_summary="Create Comment",
    responses={
        201: openapi.Response(description="Comment created"),
        400: "Invalid request",
        404: "Post not found"
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Separate view for updating and deleting a comment
@swagger_auto_schema(
    method='put',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={'text': openapi.Schema(type=openapi.TYPE_STRING, description="Updated comment text")}
    ),
    operation_description="Update an existing comment on a specific post.",
    operation_summary="Update Comment",
    responses={
        200: openapi.Response(description="Comment updated"),
        400: "Invalid request",
        403: "Unauthorized",
        404: "Comment not found"
    }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete an existing comment on a specific post.",
    operation_summary="Delete Comment",
    responses={
        204: "Comment deleted successfully",
        403: "Unauthorized",
        404: "Comment not found"
    }
)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_comment(request, post_id, comment_id):
    try:
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.get(id=comment_id, post=post)
    except (Post.DoesNotExist, Comment.DoesNotExist):
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

    if comment.user != request.user:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        comment.delete()
        return Response({"message": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
# List comments for a post
@swagger_auto_schema(
    method='get',
    operation_description="List all comments for a specific post.",
    operation_summary="List Comments",
    responses={
        200: openapi.Response(
            description="Comments retrieved",
            examples={"application/json": [
                {"id": 1, "text": "Great post!", "user": "user1", "created_at": "2024-10-16T12:00:00Z"},
                {"id": 2, "text": "Thanks for sharing.", "user": "user2", "created_at": "2024-10-17T10:00:00Z"}
            ]}
        ),
        404: "Post not found"
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
