from django.test import TestCase
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.urls import reverse
from ..models import Follow

class SetupTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('main:signup')
        self.login_url = reverse('main:login') 

        self.user_data_one = {
            'username': 'valid_username',
            'email': 'valid@example.com',
            'password': 'Password123'
        }

        self.user_data_two = {
            'username': 'another_valid',
            'email': 'anoval@example.com',
            'password': 'Password123'
        }

        self.login_data = {
            'email': 'anoval@example.com',
            'password': 'Password123'
        }
        
        User = get_user_model()
        
        User.objects.create_user(**self.user_data_two)

        return super().setUp()
    
    def tearDown(self):
        User = get_user_model()
        User.objects.all().delete()
        return super().tearDown()
    

class FollowSetupTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_one_data = {
            'username': 'user_one',
            'email': 'valid@example.com',
            'password': 'Password123'
        }
        self.user_two_data = {
            'username': 'user_two',
            'email': 'valid@example.org',
            'password': 'Password123'
        }
        User = get_user_model()
        User.objects.create_user(**self.user_one_data)
        User.objects.create_user(**self.user_two_data)
        return super().setUp()
    
    def tearDown(self):
        get_user_model().objects.all().delete()
        return super().tearDown()
    
class UnfollowSetupTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_one_data = {
            'username': 'user_one',
            'email': 'valid@example.com',
            'password': 'Password123'
        }
        self.user_two_data = {
            'username': 'user_two',
            'email': 'valid@example.org',
            'password': 'Password123'
        }

        self.user_three_data = {
            'username': 'user_three',
            'email': 'valid@example.tr',
            'password': 'Password123'
        }
        User = get_user_model()
        User.objects.create_user(**self.user_one_data)
        User.objects.create_user(**self.user_two_data)
        User.objects.create_user(**self.user_three_data)
        user_one_id = User.objects.get(username='user_one').user_id
        user_two_id = User.objects.get(username='user_two').user_id
        user_three_id = User.objects.get(username='user_three').user_id
        Follow.objects.create(user_id=user_one_id, followed_user_id=user_two_id)
        return super().setUp()
    
    def tearDown(self):
        get_user_model().objects.all().delete()
        Follow.objects.all().delete()
        return super().tearDown()