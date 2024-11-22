from django.urls import path
from . import views

urlpatterns = [
    path('filter/', views.filter_games, name='game-filter'),
    path('explore/', views.explore, name='explore'),
    path('master_game/<str:game_id>', views.master_game, name='master_game'),
]