from django.apps import AppConfig
from . import views

class GameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'game'
    def ready(self):
        views.fetch_all_games()