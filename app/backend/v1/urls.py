from django.urls import path, include

# Include the URLs for your apps
urlpatterns = [
    path('healthcheck/', include('v1.apps.healthcheck.urls')),  # Health check endpoints
    path('test_endpoint/', include('v1.apps.test_endpoint.urls')), 
    # Product endpoints
]