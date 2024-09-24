from django.db import models

class Game(models.Model):
    game_slug = models.SlugField(max_length=200, primary_key=True, blank=False)
    game_name = models.CharField(max_length=200)
    game_image = models.CharField(max_length=200, null=True)