
from django.db import models

from v1.apps.accounts.models import CustomUser

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Post(models.Model):
    post_image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    title = models.CharField(max_length=255)
    fen = models.CharField(max_length=255, null=True, blank=True)
    post_text = models.TextField(null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='posts')  # Tag relation
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Post by {self.user.username}"
