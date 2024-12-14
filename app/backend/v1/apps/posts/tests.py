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


from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from v1.apps.accounts.models import CustomUser
from v1.apps.posts.models import Post
from v1.apps.posts.serializers import PostSerializer

class EditPostTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password123")
        self.other_user = CustomUser.objects.create_user(username="otheruser", password="password456")
        
        # Create a post by self.user
        self.post = Post.objects.create(
            user=self.user,
            title="Original Title",
            fen="original_fen",
            post_text="original text",
            tags="original"
        )
        
        # Another user's post
        self.other_post = Post.objects.create(
            user=self.other_user,
            title="Another User's Post",
            fen="another_fen",
            post_text="another text"
        )
        
        self.client = APIClient()
        self.edit_url = reverse('edit-post', kwargs={'post_id': self.post.id})
        self.other_edit_url = reverse('edit-post', kwargs={'post_id': self.other_post.id})

    def test_edit_own_post_success(self):
        self.client.login(username="testuser", password="password123")
        data = {
            "title": "Updated Title",
            "post_text": "Updated text",
            "tags": ["updated", "tag"]
        }
        response = self.client.put(self.edit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_post = Post.objects.get(id=self.post.id)
        self.assertEqual(updated_post.title, data["title"])
        self.assertEqual(updated_post.post_text, data["post_text"])
        self.assertEqual(updated_post.tags, "updated,tag")

    def test_edit_nonexistent_post(self):
        self.client.login(username="testuser", password="password123")
        url = reverse('edit-post', kwargs={'post_id': 9999})  # Non-existent post ID
        response = self.client.put(url, {"title": "New Title"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_edit_others_post_forbidden(self):
        self.client.login(username="testuser", password="password123")
        response = self.client.put(self.other_edit_url, {"title": "Hacked Title"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_edit_invalid_data(self):
        # For instance, title cannot be empty (if that's a requirement)
        self.client.login(username="testuser", password="password123")
        response = self.client.put(self.edit_url, {"title": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


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


class DeletePostTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password123")
        self.other_user = CustomUser.objects.create_user(username="otheruser", password="password456")
        
        # Create a post by self.user
        self.post = Post.objects.create(
            user=self.user,
            title="User's Post",
            fen="fen_value",
            post_text="Some text"
        )
        
        # Another user's post
        self.other_post = Post.objects.create(
            user=self.other_user,
            title="Another User's Post",
            fen="another_fen",
            post_text="another text"
        )
        
        self.client = APIClient()
        self.delete_url = reverse('delete-post', kwargs={'post_id': self.post.id})
        self.other_delete_url = reverse('delete-post', kwargs={'post_id': self.other_post.id})

    def test_delete_own_post_success(self):
        self.client.login(username="testuser", password="password123")
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Post should be deleted
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())

    def test_delete_nonexistent_post(self):
        self.client.login(username="testuser", password="password123")
        url = reverse('delete-post', kwargs={'post_id': 9999})  # Non-existent post
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_others_post_forbidden(self):
        self.client.login(username="testuser", password="password123")
        response = self.client.delete(self.other_delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Post should still exist
        self.assertTrue(Post.objects.filter(id=self.other_post.id).exists())

    def test_delete_unauthenticated(self):
        # Not logged in
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # Post should still exist
        self.assertTrue(Post.objects.filter(id=self.post.id).exists())


class ListPostsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        # Create posts with various tags
        Post.objects.create(user=self.user, title="Post with tag1", post_text="Test content", tags="tag1")
        Post.objects.create(user=self.user, title="Post with tag2", post_text="Test content", tags="tag2")
        Post.objects.create(user=self.user, title="Post with tag1 and tag2", post_text="Test content", tags="tag1,tag2")
        Post.objects.create(user=self.user, title="Post with no tag", post_text="Test content")
        self.url = reverse('list-posts')

    def test_list_posts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # For demonstration, no pagination parameter is shown above; 
        posts = response.json().get('results', response.json())  # Depending on whether pagination is enabled
        self.assertEqual(len(posts), 4)  # We created exactly 4

    def test_list_posts_with_tag_filter(self):
        # Filter by "tag1"
        response = self.client.get(self.url, {'tag': 'tag1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        posts = response.json().get('results', response.json())
        # Expect posts that contain 'tag1' in their tags
        returned_titles = {post['title'] for post in posts}
        self.assertIn("Post with tag1", returned_titles)
        self.assertIn("Post with tag1 and tag2", returned_titles)
        self.assertNotIn("Post with tag2", returned_titles)
        self.assertNotIn("Post with no tag", returned_titles)

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