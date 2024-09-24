from django.apps import AppConfig
import sys

class GameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'game'
    def ready(self):
        if 'runserver' not in sys.argv:
            return True
        from . import views
        views.fetch_all_games()