from django.urls import path
from . import views


urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('game-of-day', views.property_game, name='game-of-day'),
    path('', views.index, name='index')
    
    ]




