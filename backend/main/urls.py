from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('game-of-day', views.property_game, name='game-of-day'),
    path('search-game', views.search_game, name='search-game'),
    path('', views.index, name='index')
    
    ]




