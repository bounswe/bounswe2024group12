from django.db import models

class Game(models.Model):
    event = models.CharField(max_length=255, null=True, blank=True)
    site = models.CharField(max_length=255, null=True, blank=True)
    white = models.CharField(max_length=255, null=True, blank=True)
    black = models.CharField(max_length=255, null=True, blank=True)
    result = models.CharField(max_length=10, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)  # Year field
    month = models.IntegerField(null=True, blank=True)  # Month field
    day = models.IntegerField(null=True, blank=True)  # Day field
    pgn = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.white} vs {self.black} - {self.year}.{self.month}.{self.day}"