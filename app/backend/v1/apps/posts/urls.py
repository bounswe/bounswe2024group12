from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_post, name='create-post'),  # Create a post
    path('<int:post_id>/', views.get_post, name='get-post'),  # Get a post by ID
    path('list_posts/', views.list_posts, name='list-posts'),  # List all posts
]