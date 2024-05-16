from django.urls import path
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Playlog API",
        default_version='v1',
        description="API endpoints for Playlog application",
        #terms_of_service="https://www.google.com/policies/terms/",
        #contact=openapi.Contact(email="contact@example.com"),
        #license=openapi.License(name="BSD License"),
    ),
    public=True,
)
app_name = 'main'

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('', views.index, name='index'),
    path('follow-user', views.follow_user, name='follow-user'),
    path('unfollow-user', views.unfollow_user, name='unfollow-user'),
    path('user-followers-list', views.get_followers, name='get-followers-list'),
    path('user-following-list', views.get_following, name='get-following-list'),
    path('is-following', views.is_following, name='is-following'),
    path('user-check', views.user_check, name='user-check'),
    path('user-details', views.user_details, name='user_details'),
    ]



