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
        self.url = reverse('toggle-follow', args=[self.following.username])

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
        
        # Create user's own posts
        self.post_1 = Post.objects.create(user=self.user, title="My Chess Analysis", post_text="Analysis Content")
        self.post_2 = Post.objects.create(user=self.user, title="Endgame Strategy", post_text="Strategy Content")
        self.user_posts = Post.objects.filter(user=self.user) 

    def test_user_page_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        keys_to_check = ['username', 'post_bookmarks', 'game_bookmarks', 'game_move_bookmarks', 'post_likes', 'followers', 'following', 'posts']
        
        for key in keys_to_check:
            self.assertIn(key, response.data)
        
        self.assertEqual(len(response.data['posts']), self.user_posts.count())
        
        expected_posts = self.user_posts.values('id', 'title')
        for post in expected_posts:
            self.assertIn(post, response.data['posts'])
        
        # Check that each game bookmark has the required fields
        for bookmark in response.data['game_bookmarks']:
            self.assertIn('game__id', bookmark)
            self.assertIn('game__event', bookmark)
            self.assertIn('game__site', bookmark)
            self.assertIn('game__white', bookmark)
            self.assertIn('game__black', bookmark)
            self.assertIn('game__result', bookmark)
            self.assertIn('game__year', bookmark)
            self.assertIn('game__month', bookmark)
            self.assertIn('game__day', bookmark)
            self.assertIn('game__pgn', bookmark)

    def test_user_page_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



class OtherUserPageTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="chessmaster", email="chessmaster@example.com", password="password123")
        self.other_user = CustomUser.objects.create_user(username="follower", email="follower@example.com", password="password123")
        
        self.post_1 = Post.objects.create(user=self.user, title="My Chess Journey", post_text="Journey Content")
        self.post_2 = Post.objects.create(user=self.user, title="Rook Endgames", post_text="Endgame Content")
        self.user_posts = Post.objects.filter(user=self.user)
        
        self.url = reverse('get-other-user-page', kwargs={'username': self.user.username})
        
    def test_other_user_page_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        keys_to_check = ['username', 'email', 'first_name', 'last_name', 'date_joined', 'post_likes', 'followers', 'following', 'posts']
        for key in keys_to_check:
            self.assertIn(key, response.data)

        expected_posts = self.user_posts.values('id', 'title')
        for post in expected_posts:
            self.assertIn(post, response.data['posts'])

    def test_other_user_page_authenticated_other_user(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_posts = self.user_posts.values('id', 'title')
        for post in expected_posts:
            self.assertIn(post, response.data['posts'])

    def test_other_user_page_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_posts = self.user_posts.values('id', 'title')
        for post in expected_posts:
            self.assertIn(post, response.data['posts'])

    def test_other_user_page_not_found(self):
        url = reverse('get-other-user-page', kwargs={'username': '-------323232-----------'})  # Non-existing username
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'detail': 'No CustomUser matches the given query.'})

