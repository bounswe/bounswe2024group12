from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from v1.apps.accounts.models import CustomUser

class AccountsTests(APITestCase):
    def setUp(self):
        self.sign_up_url = reverse('sign-up')  
        self.login_url = reverse('login')    
        self.user_data = {
            'mail': 'testuser@example.com',
            'username': 'testuser',
            'password': 'strongpassword123'
        }

    # Tests for Sign-Up
    def test_sign_up_success(self):
        response = self.client.post(self.sign_up_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], "User created successfully")
        self.assertTrue(CustomUser.objects.filter(email=self.user_data['mail']).exists())

    def test_sign_up_missing_fields(self):
        incomplete_data = {
            'mail': 'incomplete@example.com',
            'username': 'incomplete'
            # Missing password
        }
        response = self.client.post(self.sign_up_url, incomplete_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("All fields are required", response.data['error'])

    def test_sign_up_email_already_exists(self):
        CustomUser.objects.create_user(
            username=self.user_data['username'], 
            email=self.user_data['mail'], 
            password=self.user_data['password']
        )
        response = self.client.post(self.sign_up_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Email already in use", response.data['error'])

    # Tests for Login
    def test_login_success(self):
        user = CustomUser.objects.create_user(
            username=self.user_data['username'], 
            email=self.user_data['mail'], 
            password=self.user_data['password']
        )
        login_data = {
            'mail': self.user_data['mail'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], user.username)
        self.assertIn('token', response.data)
        self.assertIn('refresh_token', response.data)

    def test_login_invalid_credentials(self):
        CustomUser.objects.create_user(
            username=self.user_data['username'], 
            email=self.user_data['mail'], 
            password=self.user_data['password']
        )
        invalid_login_data = {
            'mail': self.user_data['mail'],
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, invalid_login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid credentials", response.data['error'])

    def test_login_nonexistent_user(self):
        login_data = {
            'mail': 'nonexistent@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid credentials", response.data['error'])
