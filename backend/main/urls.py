from django.urls import path, include
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Playlog API",
        default_version='v1',
        description="API endpoints for Playlog application",
        #terms_of_service="https://www.google.com/policies/terms/",
        #contact=openapi.Contact(email="contact@example.com"),
        #license=openapi.License(name="BSD License"),
    ),
    public=True,
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('game-of-day', views.property_game, name='game-of-day'),
    path('search-game', views.search_game, name='search-game'),
    path('', views.index, name='index')
    
    ]




