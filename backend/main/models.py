from django.db import models
from django.contrib.auth.models import User
    

class RegisteredUser(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.username
