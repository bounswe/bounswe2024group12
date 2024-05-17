import json
from .test_setup import SetupTestCase, FollowSetupTestCase, UnfollowSetupTestCase
from django.db import transaction
from django.test import TestCase, Client
from django.urls import reverse
from main.models import RegisteredUser, Follow
import json


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


class FollowUserTests(FollowSetupTestCase):
    def test_follow_user_success(self):
        data = json.dumps({'username': 'user_one', 'followed_user': 'user_two'})
        response = self.client.post(reverse('main:follow-user'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'User followed successfully', 'success': True})


class UnfollowUserTests(UnfollowSetupTestCase):

    def test_unfollow_user_success(self):
        data = json.dumps({'username': 'user_two', 'followed_user': 'user_one'})
        response = self.client.post(reverse('main:unfollow-user'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'User unfollowed successfully', 'success': True})

class GetFollowUserTest(UnfollowSetupTestCase):
    def test_get_following_user_success(self):
        data = json.dumps({'username': 'user_two'})
        response = self.client.post(reverse('main:user-following-list'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'following': []})

    def test_get_followers_user_success(self):
        data = json.dumps({'username': 'user_one'})
        response = self.client.post(reverse('main:user-followers-list'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'followers': []})

    def test_get_following_user_empty(self):
        data = json.dumps({'username': 'user_three'})
        response = self.client.post(reverse('main:user-following-list'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'following': []})

    def test_get_followers_user_empty(self):
        data = json.dumps({'username': 'user_three'})
        response = self.client.post(reverse('main:user-followers-list'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'followers': []})

    def test_is_following_success(self):
        data = json.dumps({'username': 'user_one', 'followed_user': 'user_two'})
        response = self.client.post(reverse('main:is-following'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'is_following': True})

    def test_is_following_failure(self):
        data = json.dumps({'username': 'user_two', 'followed_user': 'user_three'})
        response = self.client.post(reverse('main:is-following'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'is_following': False})

    def test_user_check_success(self):
        data = json.dumps({'username': 'user_one'})
        response = self.client.post(reverse('main:user-check'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'exists': True})

    def test_user_check_failure(self):
        data = json.dumps({'username': 'user_four'})
        response = self.client.post(reverse('main:user-check'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'exists': False})

    def test_user_details_success(self):
        data = json.dumps({'username': 'user_one'})
        response = self.client.post(reverse('main:user-details'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'gamesLiked': 2, 'reviewCount': 3, 'followers': 0, 'following': 1})

    def test_user_details_empty(self):
        data = json.dumps({'username': 'user_three'})
        response = self.client.post(reverse('main:user-details'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'gamesLiked': 2, 'reviewCount': 3, 'followers': 0, 'following': 0})




