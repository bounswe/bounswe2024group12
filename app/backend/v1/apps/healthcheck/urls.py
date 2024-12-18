from django.urls import path
from . import views

urlpatterns = [
    path('hc/', views.hc, name='hc'),
    path('hc_db/', views.hc_db, name='hc_db'),
    path('hc_auth/', views.hc_auth, name='hc_auth'),
]