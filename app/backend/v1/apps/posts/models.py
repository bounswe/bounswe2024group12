
from django.db import models

from v1.apps.accounts.models import CustomUser

# TODO: post image size and format check may be implemented here

class Post(models.Model):
    post_image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    fen = models.CharField(max_length=255, null=True, blank=True)
    post_text = models.TextField(null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts', default=1)  # added user 1 as default
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Post by {self.user.username}"
