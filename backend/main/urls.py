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
app_name = 'main'

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('', views.index, name='index'),
    path('search-game', views.search_game, name='search-game'),
    path('game-of-the-day', views.get_game_of_the_day, name='game-of-the-day'),
    path('all-games', views.get_all_games, name='all-games'),
    path('popular-games', views.get_popular_games, name='popular-games'),
    path('new-games', views.get_new_games, name='new-games'),
    path('game-slug', views.get_game_slug, name='game-slug'),
    path('game-info/<str:game_slug>/', views.get_game_info, name='game_info'),
    ]




