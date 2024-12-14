from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from v1.apps.accounts.models import CustomUser, Follow
from django.test import TestCase
from v1.apps.posts.models import Post, PostBookmark, Like
from v1.apps.games.models import Game, GameBookmark, GameMoveBookmark



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

class FollowUserTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.follower = CustomUser.objects.create_user(username="follower", password="password")
        self.following = CustomUser.objects.create_user(username="following", password="password")
        self.url = reverse('toggle-follow', args=[self.following.id])

    def test_follow_user_authenticated(self):
        self.client.force_authenticate(user=self.follower)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        follow_exists = Follow.objects.filter(follower=self.follower, following=self.following).exists()
        self.assertTrue(follow_exists)

    def test_unfollow_user_authenticated(self):
        self.client.force_authenticate(user=self.follower)
        self.client.post(self.url)  # Follow first
        response = self.client.post(self.url)  # Then unfollow
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        follow_exists = Follow.objects.filter(follower=self.follower, following=self.following).exists()
        self.assertFalse(follow_exists)

    def test_follow_user_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserPageTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="chessmaster", password="password123")
        self.url = reverse('get-user-page')
        self.client.force_authenticate(user=self.user)

        # Create dummy bookmarks, likes, follows, etc.
        self.post = Post.objects.create(user=self.user, title="Test Post", post_text="Test Content")
        PostBookmark.objects.create(user=self.user, post=self.post)
        Like.objects.create(user=self.user, post=self.post)
        
        self.game = Game.objects.create(white="Kasparov", black="Deep Blue", year=1997)
        GameBookmark.objects.create(user=self.user, game=self.game)
        GameMoveBookmark.objects.create(user=self.user, game=self.game, fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
        
        self.follower = CustomUser.objects.create_user(username="follower", password="password")
        Follow.objects.create(follower=self.follower, following=self.user)

    def test_user_page_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)
        self.assertIn('post_bookmarks', response.data)
        self.assertIn('game_bookmarks', response.data)
        self.assertIn('post_likes', response.data)
        self.assertIn('followers', response.data)
        self.assertIn('following', response.data)

    def test_user_page_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)





class UserProfileTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create users
        self.user = CustomUser.objects.create_user(username="chessmaster", email="chessmaster@example.com", password="password123")
        self.other_user = CustomUser.objects.create_user(username="follower", email="follower@example.com", password="password123")
        
        # Create Post and Like
        self.post = Post.objects.create(user=self.user, title="Test Post", post_text="Test Content")
        Like.objects.create(user=self.user, post=self.post)
        
        # Create Follower/Following relationship
        Follow.objects.create(follower=self.other_user, following=self.user)
        Follow.objects.create(follower=self.user, following=self.other_user)
        
        # URL for the user profile endpoint (replace `user_id` with actual ID in URL)
        self.url = reverse('get-user-profile', kwargs={'user_id': self.user.id})
        
    def test_user_profile_authenticated(self):
        """Test user profile can be retrieved when authenticated."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('first_name', response.data)
        self.assertIn('last_name', response.data)
        self.assertIn('date_joined', response.data)
        self.assertIn('post_likes', response.data)
        self.assertIn('followers', response.data)
        self.assertIn('following', response.data)
        
        # Check the structure of returned data
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)
        
        # Check if post_likes contains the correct like
        self.assertEqual(len(response.data['post_likes']), 1)
        self.assertEqual(response.data['post_likes'][0]['post__id'], self.post.id)
        self.assertEqual(response.data['post_likes'][0]['post__title'], self.post.title)
        
        # Check if followers contains the correct follower
        self.assertEqual(len(response.data['followers']), 1)
        self.assertEqual(response.data['followers'][0]['follower__id'], self.other_user.id)
        self.assertEqual(response.data['followers'][0]['follower__username'], self.other_user.username)
        
        # Check if following contains the correct following
        self.assertEqual(len(response.data['following']), 1)
        self.assertEqual(response.data['following'][0]['following__id'], self.other_user.id)
        self.assertEqual(response.data['following'][0]['following__username'], self.other_user.username)
        
    def test_user_profile_authenticated_other_user(self):
        """Test if another user's profile can be retrieved by the current user."""
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('first_name', response.data)
        self.assertIn('last_name', response.data)
        self.assertIn('date_joined', response.data)
        self.assertIn('post_likes', response.data)
        self.assertIn('followers', response.data)
        self.assertIn('following', response.data)
        
        # Check the structure of returned data
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)
        
        # Check if post_likes contains the correct like
        self.assertEqual(len(response.data['post_likes']), 1)
        self.assertEqual(response.data['post_likes'][0]['post__id'], self.post.id)
        self.assertEqual(response.data['post_likes'][0]['post__title'], self.post.title)
        
        # Check if followers contains the correct follower
        self.assertEqual(len(response.data['followers']), 1)
        self.assertEqual(response.data['followers'][0]['follower__id'], self.other_user.id)
        self.assertEqual(response.data['followers'][0]['follower__username'], self.other_user.username)
        
        # Check if following contains the correct following
        self.assertEqual(len(response.data['following']), 1)
        self.assertEqual(response.data['following'][0]['following__id'], self.other_user.id)
        self.assertEqual(response.data['following'][0]['following__username'], self.other_user.username)
        
    def test_user_profile_unauthenticated(self):
        """Test if the profile can be viewed without authentication (should be allowed)."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('first_name', response.data)
        self.assertIn('last_name', response.data)
        self.assertIn('date_joined', response.data)
        self.assertIn('post_likes', response.data)
        self.assertIn('followers', response.data)
        self.assertIn('following', response.data)
        
    def test_user_profile_not_found(self):
        """Test if a 404 is returned when user does not exist."""
        url = reverse('get-user-profile', kwargs={'user_id': 999})  # Non-existing user ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'detail': 'No CustomUser matches the given query.'})

