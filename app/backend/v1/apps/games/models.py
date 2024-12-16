from django.db import models
from v1.apps.accounts.models import CustomUser
import uuid

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
    
class GameBookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="game_bookmarks")
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="bookmarks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game')  # Ensure a user can bookmark a game only once

    def __str__(self):
        return f"{self.user.username} bookmarked game {self.game.id}"

class GameMoveBookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="game_move_bookmarks")
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="move_bookmarks")
    fen = models.CharField(max_length=255)  # FEN string to identify the move
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game', 'fen')  # Ensure a user can bookmark a game move only once

    def __str__(self):
        return f"{self.user.username} bookmarked move {self.fen} in game {self.game.id}"
    


class GameOpening(models.Model):
    eco_code = models.CharField(max_length=10)
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Annotation(models.Model):
    context = models.CharField(max_length=255, default="http://www.w3.org/ns/anno.jsonld")
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='annotations')
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='annotations')
    
    type = models.CharField(max_length=50, default="Annotation")  # "Annotation"
    created = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    modified = models.DateTimeField(auto_now=True)  # Timestamp for modification
    
    body = models.JSONField()  # Store the body as JSON (type, value, format)
    target = models.JSONField()  # Store the target as JSON (type, source, state)
    motivation = models.CharField(max_length=100, null=True, blank=True)  # e.g., "commenting"
    
    class Meta:
        ordering = ['-created']
    
    def __str__(self):
        return f"Annotation {self.id} on Game {self.game.id} by {self.creator.username}"