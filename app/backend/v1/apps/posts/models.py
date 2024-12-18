
from django.db import models

from v1.apps.accounts.models import CustomUser


class Post(models.Model):
    title = models.CharField(max_length=255, null=False, blank=False)
    post_image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    fen = models.CharField(max_length=255, null=True, blank=True)
    post_text = models.TextField(null=True, blank=True)
    tags = models.TextField(null=True, blank=True)  # Tag relation
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} by {self.user.username}" 


class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Ensure a user can like a post only once

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    fen_notations = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post}"
    

class PostBookmark(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='post_bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Ensure a user can bookmark a post only once

    def __str__(self):
        return f"{self.user.username} bookmarked post {self.post.id}"
