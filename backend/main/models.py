from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db import models
from django.contrib.auth.models import User
    
class RegisteredUserManager(BaseUserManager):  
    def  create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):  
        return self.create_user(email, username, password, **extra_fields)
    
class RegisteredUser(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    objects = RegisteredUserManager()
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'password']
    
    def __str__(self):
        return self.username


