from django.db import models
from django.contrib.auth.models import User
    

class RegisteredUser(models.Model):
    # username is unique
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
    
    def check_password(self, password):
        return self.password == password
