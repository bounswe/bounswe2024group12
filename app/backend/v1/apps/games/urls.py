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
    path('tournaments/', views.get_current_tournaments, name='get-current-tournaments'),
    path('tournaments/<str:tournamentSlug>/<str:roundSlug>/<str:roundId>/',views.get_tournament_round,name='get-tournament-round'),
    path('tournament/round/<str:roundId>/pgn/', views.get_tournament_round_pgn, name='get-tournament-round-pgn'),
    path('<int:game_id>/annotations/', views.annotations_list_create, name='annotations_list_create'),
    path('<int:game_id>/annotations/<uuid:anno_id>/', views.annotation_detail, name='annotation_detail'),
]

