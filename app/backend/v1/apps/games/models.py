from django.db import models
from v1.apps.accounts.models import CustomUser

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
    
class GameComment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Yorumu yapan kullanıcı
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="comments")  # Hangi oyuna ait
    position_fen = models.TextField()  # Yoruma ait pozisyonun FEN'i
    comment_fens = models.TextField(null=True, blank=True)  # Yorumda anlatılan diğer FEN'ler (virgülle ayrılmış string)
    comment_text = models.TextField()  # Yorumun içeriği
    created_at = models.DateTimeField(auto_now_add=True)  # Yorumun oluşturulma zamanı

    def __str__(self):
        return f"Comment by {self.user.username} on Game {self.game.id}"

    def get_fens_list(self):
        """Helper method to return `fens` as a list."""
        return self.comment_fens.split(',') if self.comment_fens else []