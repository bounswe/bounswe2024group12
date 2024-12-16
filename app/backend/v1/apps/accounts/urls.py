from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.sign_up, name='sign-up'),
    path('login/', views.login, name='login'),
    path('<str:username>/follow/', views.toggle_follow, name='toggle-follow'),
    path('me/', views.get_user_page, name='get-user-page'),
    path('<str:username>/', views.get_other_user_page, name='get-other-user-page'),
]