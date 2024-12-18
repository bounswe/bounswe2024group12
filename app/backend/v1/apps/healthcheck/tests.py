from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class HealthCheckTests(APITestCase):
    def setUp(self):
        self.hc_url = reverse('hc')  # Update with the correct name in your `urls.py`
        self.hc_db_url = reverse('hc_db')  # Update with the correct name in your `urls.py`
        self.hc_auth_url = reverse('hc_auth')  # Update with the correct name in your `urls.py`


        # Create a test user for authenticated health check
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.client = APIClient()

    def test_hc_endpoint(self):
        """Test the public health check endpoint."""
        response = self.client.get(self.hc_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "OK"})

    def test_hc_db_healthy(self):
        """Test the database health check endpoint when the database is healthy."""
        response = self.client.get(self.hc_db_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"db_status": "healthy"})


    def test_hc_auth_unauthenticated(self):
        """Test the authenticated health check endpoint without authentication."""
        response = self.client.get(self.hc_auth_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_hc_auth_authenticated(self):
        """Test the authenticated health check endpoint with valid authentication."""
        # Obtain a JWT token for the test user
        response = self.client.post(reverse('login'), {
            'mail': self.user.email,
            'password': "testpassword"
        })

 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['token']

        # Set the token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Call the authenticated health check endpoint
        response = self.client.get(self.hc_auth_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "OK"})

