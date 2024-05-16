from django.urls import path
from . import views

urlpatterns = [
    path('search-game', views.search_game, name='search-game'),
    path('search-game-by/<str:search_by>/', views.search_game_by, name='search-game-by'),
    path('game-of-the-day', views.get_game_of_the_day, name='game-of-the-day'),
    path('popular-games', views.get_popular_games, name='popular-games'),
    path('new-games', views.get_new_games, name='new-games'),
    path('game-slug', views.get_game_slug, name='game-slug'),
    path('game-info/<str:game_slug>/', views.get_game_info, name='game_info'),
    path('game-characters/<str:game_slug>/', views.get_game_characters, name='game_characters'),
    path('property', views.get_property_games, name='property'),
    ]
