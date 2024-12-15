from django.urls import path
from . import views

urlpatterns = [
    path('filter/', views.filter_games, name='game-filter'),
    path('explore/', views.explore, name='explore'),
    path('master_game/<str:game_id>', views.master_game, name='master_game'),
    path('<int:game_id>/comments/', views.list_game_comments, name='list_game_comments'),
    path('<int:game_id>/add_comment/', views.add_game_comment, name='add_game_comment'),
    path('<int:game_id>/bookmark/', views.toggle_game_bookmark, name='toggle-game-bookmark'),
    path('<int:game_id>/move/bookmark/', views.toggle_game_move_bookmark, name='toggle-game-move-bookmark'),
    path('openings/', views.get_opening_by_eco, name='get-opening-by-eco'),
    path('current_tournaments/', views.get_current_tournaments, name='get-current-tournaments'),

]