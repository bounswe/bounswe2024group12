from django.urls import path
from . import views

urlpatterns = [
    path('daily/', views.daily_puzzle, name='daily-puzzle'),
    path('random/', views.random_puzzle, name='random-puzzle'),
    path('angles/', views.puzzle_angles_json, name='puzzle-angles-json'),
    path('<str:id>/', views.get_puzzle_by_id, name='get-puzzle-by-id'),
]