from django.test import TestCase
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from django.urls import reverse

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
