from django.urls import path
from . import views
from django.urls import re_path

urlpatterns = [
    path('create/', views.create_post, name='create-post'),  # Create a post
    path('edit/<int:post_id>/', views.edit_post, name='edit-post'),  # Edit a post
    path('delete/<int:post_id>/', views.delete_post, name='delete-post'),  # Delete a post
    path('delete_multiple/', views.delete_multiple_posts, name='delete-multiple-posts'),  # Delete multiple posts
    path('<int:post_id>/', views.get_post, name='get-post'),  # Get a post by ID
    path('list_posts/', views.list_posts, name='list-posts'),  # List all posts
    path('like/<int:post_id>/', views.like_post, name='like-post'),
    path('comment/<int:post_id>/', views.create_comment, name='comment-create'),  # POST: create
    path('comment/<int:post_id>/<int:comment_id>/', views.update_delete_comment, name='comment-modify'),  # PUT/DELETE
    path('comments/<int:post_id>/', views.list_comments, name='list-comments'),
    path('likes_summary/', views.post_likes_summary, name='post-likes-summary'),
    path('bookmark/<int:post_id>/', views.toggle_post_bookmark, name='toggle-post-bookmark'),  # POST bookmark (toggle)
]