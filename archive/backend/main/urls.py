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
    path('user-followers-list', views.get_followers, name='user-followers-list'),
    path('user-following-list', views.get_following, name='user-following-list'),
    path('is-following', views.is_following, name='is-following'),
    path('user-check', views.user_check, name='user-check'),
    path('user-details', views.user_details, name='user-details'),
    path('create-review', views.create_review, name='create-review'),
    path('edit-review', views.edit_review, name='edit-review'),
    path('delete-review', views.delete_review, name='delete-review'),
    path('like-review', views.like_review, name='like-review'),
    path('unlike-review', views.unlike_review, name='unlike-review'),
    path('recent-reviews', views.recent_reviews, name='recent-reviews'),
    path('recent-reviews-game', views.recent_reviews_game, name='recent-reviews-game'),
    path('user-recent-reviews', views.recent_reviews_user, name='user-recent-reviews'),
    path('popular-reviews', views.popular_reviews, name='popular-reviews'),
    path('popular-reviews-game', views.popular_reviews_game, name='popular-reviews-game'),
    path('user-popular-reviews', views.popular_reviews_user, name='user-popular-reviews'),
    path('get-user-reviews', views.get_user_reviews, name='get-user-reviews'),
    path('user-all-reviews', views.user_all_reviews, name='user-all-reviews'),
    ]



