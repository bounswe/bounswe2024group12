from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from v1.apps.posts.models import Post, Like, Comment, PostBookmark
from v1.apps.accounts.models import CustomUser
from v1.apps.posts.serializers import PostSerializer, LikeSerializer, CommentSerializer

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from v1.apps.headers import auth_header

from v1.apps.admin_users import admin_usernames


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
    manual_parameters=[auth_header],
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save(user=request.user)  # Assuming the user is authenticated
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description="Edit an existing post. Only the owner of the post can edit it.",
    operation_summary="Edit an existing post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_image': openapi.Schema(type=openapi.TYPE_STRING, description='Base64 encoded image string'),
            'title': openapi.Schema(type=openapi.TYPE_STRING, description='Post title'),
            'fen': openapi.Schema(type=openapi.TYPE_STRING, description='FEN notation string'),
            'post_text': openapi.Schema(type=openapi.TYPE_STRING, description='Text content for the post'),
            'tags': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_STRING),
                description='List of tags as strings'
            ),
        },
        example={
            'title': 'Updated Chess Post',
            'post_text': 'Updated content for the post',
            'tags': ['updated', 'tag']
        }
    ),
    responses={
        200: openapi.Response(
            description="Post updated successfully",
            examples={
                'application/json': {
                    'id': 1,
                    'post_image': '/media/post_images/example.jpg',
                    'title': 'Updated Chess Post',
                    'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                    'post_text': 'Updated content for the post',
                    'tags': ['updated', 'tag'],
                    'created_at': '2024-10-16T12:00:00Z',
                    'user': 'example_user'
                }
            }
        ),
        400: openapi.Response(description="Invalid input"),
        403: openapi.Response(description="Forbidden: User does not own this post"),
        404: openapi.Response(description="Post not found"),
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the authenticated user is the owner of the post
    if post.user != request.user:
        return Response({"error": "You do not have permission to edit this post"}, status=status.HTTP_403_FORBIDDEN)
    
    # Perform partial updates (fields omitted won't reset)
    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()  # user is not changed; only given fields are updated
        return Response(serializer.data, status=status.HTTP_200_OK)
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
    method='delete',
    operation_description="Delete an existing post. Only the owner of the post can delete it.",
    operation_summary="Delete an existing post",
    responses={
        200: openapi.Response(
            description="Post deleted successfully"
        ),
        403: openapi.Response(description="Forbidden: User does not own this post"),
        404: openapi.Response(description="Post not found"),
    }
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if post.user != request.user and request.user.username not in admin_usernames:
        return Response({"error": "You do not have permission to delete this post"}, status=status.HTTP_403_FORBIDDEN)
    
    post.delete()
    return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='delete',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'post_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
        },
        required=['post_ids']
    ),
    operation_description="Delete multiple existing posts. Only the admin users  can delete them.",
    operation_summary="Delete multiple posts",
    manual_parameters=[auth_header],
    responses={
        204: "Posts deleted successfully",
        403: "Forbidden: User does not have permission to delete these posts",
        404: "Post not found",
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
@api_view(['DELETE'])
def delete_multiple_posts(request):
    post_ids = request.data.get('post_ids', [])
    # only allow for admins for all posts
    for post_id in post_ids:
        try:
            post = Post.objects.get(id=post_id)
            if request.user.username not in admin_usernames:
                return Response({"error": "You do not have permission to delete this post"}, status=status.HTTP_403_FORBIDDEN)
            post.delete()
        except Post.DoesNotExist:
            pass

@swagger_auto_schema(
    method='get',
    operation_description="Retrieve all posts with pagination, optional tag filtering, optional followed filtering (only posts from followed users), and ordering. Order options: 'older', 'newer', 'title'.",
    operation_summary="List all posts with optional tag filtering, followed filtering, and ordering",
    manual_parameters=[
        openapi.Parameter(
            'tag', 
            openapi.IN_QUERY, 
            description="Filter posts by a specific tag contained in their 'tags' field",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'order_by',
            openapi.IN_QUERY,
            description="Order posts by a specific criterion: 'older', 'newer', or 'title'.",
            type=openapi.TYPE_STRING,
            enum=['older', 'newer', 'title'],
            required=False
        ),
        openapi.Parameter(
            'followed',
            openapi.IN_QUERY,
            description="If 'true', return only posts from users followed by the authenticated user. If 'false' or omitted, return all posts.",
            type=openapi.TYPE_BOOLEAN,
            required=False
        ),
        openapi.Parameter(
            'page',
            openapi.IN_QUERY,
            description="Page number for pagination",
            type=openapi.TYPE_INTEGER,
            required=False
        )
    ],
    responses={
        200: openapi.Response(
            description="List of posts retrieved successfully with pagination, optional filtering, and ordering",
            examples={
                'application/json': {
                    'count': 100,
                    'next': 'http://api.example.com/posts/?page=2',
                    'previous': None,
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
        ),
        401: openapi.Response(
            description="Authentication required if 'followed=true'"
        )
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_posts(request):
    tag = request.query_params.get('tag')
    order_by = request.query_params.get('order_by', 'newer')
    followed = request.query_params.get('followed', 'false').lower() == 'true'

    posts = Post.objects.all()

    # If followed=true, ensure the user is authenticated and filter to followed users
    if followed:
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required to filter by followed."}, status=status.HTTP_401_UNAUTHORIZED)
        # Get the IDs of users that the current user follows
        followed_user_ids = request.user.following.values_list('following_id', flat=True)
        posts = posts.filter(user_id__in=followed_user_ids)

    # Filter by tag if provided
    if tag:
        posts = posts.filter(tags__icontains=tag)
    
    # Order by logic
    if order_by == 'older':
        posts = posts.order_by('created_at')
    elif order_by == 'title':
        posts = posts.order_by('title')
    else:
        # Default or 'newer'
        posts = posts.order_by('-created_at')

    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# Like/Unlike a Post
@swagger_auto_schema(
    method='post',
    operation_description="Toggle like/unlike for a specific post.",
    operation_summary="Like/Unlike a Post",
    manual_parameters=[auth_header],
    responses={
        201: openapi.Response("Post liked", examples={"application/json": {"message": "Post liked"}}),
        200: openapi.Response("Post unliked", examples={"application/json": {"message": "Post unliked"}}),
        404: "Post not found",
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
    manual_parameters=[auth_header],
    responses={
        200: openapi.Response(
            description="Like summary retrieved",
            examples={"application/json": [
                {"post_id": 1, "like_count": 10, "liked_by_requester": True},
                {"post_id": 2, "like_count": 5, "liked_by_requester": False},
                {"post_id": 3, "error": "Post not found"}
            ]}
        ),
        400: "Invalid request",
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
        properties={
            'text': openapi.Schema(type=openapi.TYPE_STRING, description="Comment text"),
            'fen_notations': openapi.Schema(
                type=openapi.TYPE_STRING, 
                description="Optional FEN notations as a comma-separated string (e.g., 'rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3,rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3 ')",
                nullable=True
            )
        },
        required=['text']
    ),
    operation_description="Add a new comment to a specific post. Optionally include FEN notations.",
    operation_summary="Create Comment",
    manual_parameters=[auth_header],
    responses={
        201: openapi.Response(
            description="Comment created successfully.",
            examples={
                "application/json": {
                    "id": 7,
                    "user": "soner",
                    "post": 1,
                    "text": "I think that this line might be better. ",
                    "created_at": "2024-11-23T18:10:14.312264Z",
                    "fen_notations": "rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3,rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3",
                    "user_id": 1
                }
            }
        ),
        400: "Invalid request",
        404: "Post not found",
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    request.data['post'] = post.id
    request.data['user'] = request.user.id

    # Allow optional fen_notations in request data
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
        properties={
            'text': openapi.Schema(type=openapi.TYPE_STRING, description="Updated comment text"),
            'fen_notations': openapi.Schema(
                type=openapi.TYPE_STRING, 
                description="Optional FEN notations as a comma-separated string (e.g., 'rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3,rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3 ')",
                nullable=True
            )
        }
    ),
    operation_description="Update an existing comment on a specific post. Optionally include FEN notations.",
    operation_summary="Update Comment",
    manual_parameters=[auth_header],
    responses={
        200: openapi.Response(
            description="Comment updated successfully.",
            examples={
                "application/json": {
                    "id": 7,
                    "user": "soner",
                    "post": 1,
                    "text": "Updated FEN Comment",
                    "created_at": "2024-11-23T18:10:14.312264Z",
                    "fen_notations": "rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3,rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3",
                    "user_id": 1
                }
            }
        ),
        400: "Invalid request",
        403: "Unauthorized",
        404: "Comment not found",
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
@swagger_auto_schema(
    method='delete',
    operation_description="Delete an existing comment on a specific post.",
    operation_summary="Delete Comment",
    manual_parameters=[auth_header],
    responses={
        204: "Comment deleted successfully",
        403: "Unauthorized",
        404: "Comment not found",
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
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_comment(request, post_id, comment_id):
    try:
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.get(id=comment_id, post=post)
    except (Post.DoesNotExist, Comment.DoesNotExist):
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

    if comment.user != request.user and request.user.username not in admin_usernames:
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
            description="Comments retrieved successfully.",
            examples={
                "application/json": [
                    {
                        "id": 7,
                        "user": "soner",
                        "post": 1,
                        "text": "FEN Comment",
                        "created_at": "2024-11-23T18:10:14.312264Z",
                        "fen_notations": "rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 0 3,rnbqkbnr/ppp2ppp/4p3/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3",
                        "user_id": 1
                    },
                    {
                        "id": 8,
                        "user": "jane",
                        "post": 1,
                        "text": "Another comment",
                        "created_at": "2024-11-23T19:15:22.123456Z",
                        "fen_notations": "null",
                        "user_id": 2
                    }
                ]
            }
        ),
        404: "Post not found"
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def list_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id)
    serializer = CommentSerializer(comments, many=True)
    # fetch user name for each comment and return at the response

    res = []
    for comment in serializer.data:
        user = CustomUser.objects.get(id=comment['user'])
        comment['user_id'] = user.id
        comment['user'] = user.username
        res.append(comment)
    
    return Response(res, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    operation_description="Toggle bookmark for a specific post. If the post is not bookmarked, it will be bookmarked. If it is already bookmarked, the bookmark will be removed.",
    operation_summary="Toggle Bookmark on a Post",
    manual_parameters=[auth_header],
    responses={
        201: openapi.Response(
            description="Post bookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Post bookmarked successfully'
                }
            }
        ),
        200: openapi.Response(
            description="Post unbookmarked successfully",
            examples={
                'application/json': {
                    'message': 'Post unbookmarked successfully'
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_post_bookmark(request, post_id):
    #User bookmarks a post or removes a bookmark from a post (toggle system)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    bookmark_instance, created = PostBookmark.objects.get_or_create(user=user, post=post)
    
    if not created:  # Remove existing bookmark
        bookmark_instance.delete()
        return Response({"message": "Bookmark removed"}, status=status.HTTP_200_OK)
    
    return Response({"message": "Bookmark added"}, status=status.HTTP_201_CREATED)
    
        
    


    
