from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.sign_up, name='sign-up'),
    path('login/', views.login, name='login'),
    path('<int:user_id>/follow/', views.toggle_follow, name='toggle-follow'),
    path('me/', views.get_user_page, name='get-user-page'),
    path('<int:user_id>/', views.get_user_profile, name='get-user-profile'),
]