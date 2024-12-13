from django.urls import path, include

# Include the URLs for your apps
urlpatterns = [
    path('healthcheck/', include('v1.apps.healthcheck.urls')),  # Health check endpoints
    path('test_endpoint/', include('v1.apps.test_endpoint.urls')), 
    path('accounts/', include('v1.apps.accounts.urls')),
    path('posts/', include('v1.apps.posts.urls')),  # Post endpoints
    path('games/', include('v1.apps.games.urls')),  # Game endpoints
    path('puzzle/', include('v1.apps.puzzle.urls')),  # Puzzle endpoints
    # Product endpoints
]