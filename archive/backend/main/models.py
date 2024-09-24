from django.contrib.auth.models import UserManager, AbstractBaseUser
from django.db import models
    
class RegisteredUserManager(UserManager):  
    def create_user(self, email, username, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None, **extra_fields):  
        return self.create_user(email, username, password, **extra_fields)
    
class RegisteredUser(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    objects = RegisteredUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'password']

class Follow(models.Model):
    follow_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(RegisteredUser, on_delete=models.CASCADE, related_name='follower_set')
    followed_user = models.ForeignKey(RegisteredUser, on_delete=models.CASCADE, related_name='followed_set')

class Review(models.Model):
    game_slug = models.CharField(max_length=100)
    user = models.ForeignKey(RegisteredUser, on_delete=models.CASCADE)
    rating = models.IntegerField()
    text = models.TextField()
    likes = models.IntegerField(default=0) # Initialize as zero likes
    creationDate = models.DateTimeField(auto_now_add=True)  # Initialize as current date
    lastEditDate = models.DateTimeField(auto_now=True)
    likedBy = models.ManyToManyField(RegisteredUser, related_name='liked_reviews')
