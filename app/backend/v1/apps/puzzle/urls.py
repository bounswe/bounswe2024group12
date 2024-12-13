from django.urls import path
from . import views

urlpatterns = [
    path('daily/', views.daily_puzzle, name='daily-puzzle'),

]