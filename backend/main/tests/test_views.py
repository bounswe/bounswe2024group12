import json
from .test_setup import SetupTestCase
from django.db import transaction

class SignupLoginTestCase(SetupTestCase):
    def test_unique_email(self):
        user_data_one = self.user_data_one.copy()
        user_data_one['email'] = self.user_data_two['email']
        response = self.client.post(self.signup_url, json.dumps(user_data_one), content_type='application/json', format='json')
        self.assertEqual(response.status_code, 400)

    def test_unique_username(self):
        user_data_one = self.user_data_one.copy()
        user_data_one['username'] = self.user_data_two['username']
        response = self.client.post(self.signup_url, json.dumps(user_data_one), content_type='application/json', format='json')
        self.assertEqual(response.status_code, 400)

    def test_successful_signup(self):
        user_data_one = self.user_data_one.copy()
        response = self.client.post(self.signup_url, json.dumps(user_data_one), content_type='application/json', format='json')
        self.assertEqual(response.status_code, 201)

    def test_login_valid_credentials(self):
        login_data = self.login_data.copy()
        response = self.client.post(self.login_url, json.dumps(login_data), content_type='application/json', format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json()) 

    def test_login_invalid_credentials(self):
        user_data_two = self.user_data_two.copy()
        user_data_two['password'] = 'InvalidPassword123'
        response = self.client.post(self.login_url, json.dumps(user_data_two), content_type='application/json', format='json')

        self.assertEqual(response.status_code, 401)
        self.assertNotIn('token', response.json())  # Assuming the response doesn't contain a 'token' key
