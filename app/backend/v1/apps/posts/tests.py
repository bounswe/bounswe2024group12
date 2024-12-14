from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from v1.apps.posts.models import Post, Like, Comment, PostBookmark
from v1.apps.accounts.models import CustomUser

class CreatePostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.url = reverse('create-post')
    
    def test_create_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'My New Post',
            'post_text': 'This is a test post.',
            'tags': ['tag1', 'tag2']
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().title, 'My New Post')

    def test_create_post_unauthenticated(self):
        data = {
            'title': 'My New Post',
            'post_text': 'This is a test post.'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GetPostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.post = Post.objects.create(user=self.user, title="My Post", post_text="Post content")
        self.url = reverse('get-post', args=[self.post.id])
    
    def test_get_post_exists(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.post.title)

    def test_get_post_not_found(self):
        url = reverse('get-post', args=[999])  # Non-existing post ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ListPostsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        for i in range(15):
            Post.objects.create(user=self.user, title=f"Post {i}", post_text="Test content")
        self.url = reverse('list-posts')

    def test_list_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['results']), 10)  # Default pagination size


class LikePostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.post = Post.objects.create(user=self.user, title="My Post", post_text="Post content")
        self.url = reverse('like-post', args=[self.post.id])
    
    def test_like_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.filter(post=self.post, user=self.user).count(), 1)

    def test_unlike_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        # Like first
        self.client.post(self.url)
        # Unlike
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.filter(post=self.post, user=self.user).count(), 0)

    def test_like_post_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostLikesSummaryTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.posts = [
            Post.objects.create(user=self.user, title=f"Post {i}", post_text="Content") for i in range(3)
        ]
        self.url = reverse('post-likes-summary')

    def test_post_likes_summary_unauthenticated(self):
        data = {'post_ids': [post.id for post in self.posts]}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CreateCommentTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.post = Post.objects.create(user=self.user, title="My Post", post_text="Post content")
        self.url = reverse('comment-create', args=[self.post.id])

    def test_create_comment_unauthenticated(self):
        data = {'text': 'This is a comment'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ListCommentsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.post = Post.objects.create(user=self.user, title="My Post", post_text="Post content")
        for i in range(5):
            Comment.objects.create(user=self.user, post=self.post, text=f"Comment {i}")
        self.url = reverse('list-comments', args=[self.post.id])

    def test_list_comments(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 5)

class BookmarkPostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.post = Post.objects.create(user=self.user, title="Test Post", post_text="Test Content")
        self.url = reverse('toggle-post-bookmark', args=[self.post.id])

    def test_bookmark_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)       
        bookmark_exists = PostBookmark.objects.filter(user=self.user, post=self.post).exists()
        self.assertTrue(bookmark_exists)

    def test_unbookmark_post_authenticated(self):      
        self.client.force_authenticate(user=self.user)  
        self.client.post(self.url)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        bookmark_exists = PostBookmark.objects.filter(user=self.user, post=self.post).exists()
        self.assertFalse(bookmark_exists)


    def test_bookmark_post_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)