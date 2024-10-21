from django.urls import path
from . import views

urlpatterns = [
    path('test_endpoint/', views.future_endpoint_with_param, name='test'),
]