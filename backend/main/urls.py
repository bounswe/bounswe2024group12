from django.urls import path
from . import views


urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('/property-game', views.property_game, name='property-game'),
    path('', views.index, name='index')
    
    ]




