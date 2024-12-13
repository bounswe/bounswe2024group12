from django.test import TestCase

from django.test import TestCase, Client
from unittest.mock import patch
import requests

class PuzzleTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = "/puzzle/daily/"  

    @patch('requests.get')
    def test_daily_puzzle_success(self, mock_get):
        # Mock the Lichess API response
        mock_response = {
            "game": {
                "id": "AHGPPS44",
                "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 ...",
                "players": [
                    {"name": "EricRosen", "rating": 2642},
                    {"name": "Anton_Volovikov", "rating": 2619}
                ],
            },
            "puzzle": {
                "id": "PSjmf",
                "rating": 2705,
                "solution": ["g8g7", "d5e5"],
                "themes": ["endgame", "master"],
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

     
        response = self.client.get(self.url)

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), mock_response)

    @patch('requests.get')
    def test_daily_puzzle_failure(self, mock_get):
        # Mock a failed API response
        mock_get.side_effect = requests.exceptions.RequestException("Failed to fetch data")

        response = self.client.get(self.url)

        # Assertions
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Failed to fetch data")

    @patch('requests.get')
    def test_random_puzzle_with_parameters_success(self, mock_get):
        # Mock the Lichess API response
        mock_response = {
            "game": {
                "id": "XQgXJPWX",
                "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ...",
                "players": [
                    {"name": "Carlsen", "rating": 2870, "title": "GM"},
                    {"name": "Nepo", "rating": 2780, "title": "GM"}
                ]
            },
            "puzzle": {
                "id": "wUoWR",
                "rating": 1850,
                "themes": ["middlegame", "advantage"],
                "solution": ["e4", "f5", "Qe7"]
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # Make a GET request to the endpoint with parameters
        response = self.client.get(self.random_url, {'angle': 'middlegame', 'difficulty': 'harder'})

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), mock_response)

    @patch('requests.get')
    def test_random_puzzle_with_invalid_parameters_failure(self, mock_get):
        # Mock a failed API response
        mock_get.side_effect = requests.exceptions.RequestException("Failed to fetch data")

        # Make a GET request to the endpoint with invalid parameters
        response = self.client.get(self.random_url, {'angle': 'unknown', 'difficulty': 'unknown'})

        # Assertions
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Failed to fetch data")

from django.test import TestCase, Client
from unittest.mock import patch
import requests


class PuzzleByIdTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.base_url = "/puzzle/"  # Base URL for the endpoint

    @patch('requests.get')
    def test_get_puzzle_by_id_success(self, mock_get):
        # Mock a successful response from the Lichess API
        mock_response = {
            "game": {
                "id": "AHGPPS44",
                "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bb5 ...",
                "players": [
                    {"name": "EricRosen", "rating": 2642},
                    {"name": "Anton_Volovikov", "rating": 2619}
                ],
            },
            "puzzle": {
                "id": "PSjmf",
                "rating": 2705,
                "solution": ["g8g7", "d5e5"],
                "themes": ["endgame", "master"],
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # Make a GET request to the endpoint
        response = self.client.get(f"{self.base_url}PSjmf/")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), mock_response)

    @patch('requests.get')
    def test_get_puzzle_by_id_not_found(self, mock_get):
        # Mock a 404 response from the Lichess API
        mock_get.return_value.status_code = 404

        # Make a GET request to the endpoint
        response = self.client.get(f"{self.base_url}INVALID_ID/")

        # Assertions
        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Puzzle not found")

    @patch('requests.get')
    def test_get_puzzle_by_id_internal_server_error(self, mock_get):
        # Mock an internal server error
        mock_get.side_effect = requests.exceptions.RequestException("Internal server error")

        # Make a GET request to the endpoint
        response = self.client.get(f"{self.base_url}PSjmf/")

        # Assertions
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.json())
        self.assertEqual(response.json()["error"], "Internal server error")

    @patch('requests.get')
    def test_get_puzzle_by_id_invalid_api_response(self, mock_get):
        # Mock an unexpected response from the Lichess API
        mock_response = {"unexpected_key": "unexpected_value"}
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        # Make a GET request to the endpoint
        response = self.client.get(f"{self.base_url}PSjmf/")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json(), {"game": {}, "puzzle": {}})
        self.assertIn("unexpected_key", response.json())

    @patch('requests.get')
    def test_get_puzzle_by_id_missing_token(self, mock_get):
        # Test behavior when the token is missing (if implemented)
        with patch.dict('os.environ', {"LICHESS_ACCESS_TOKEN": ""}):
            response = self.client.get(f"{self.base_url}PSjmf/")
            self.assertEqual(response.status_code, 500)
            self.assertIn("error", response.json())
            self.assertEqual(response.json()["error"], "Lichess access token is missing in the environment variables.")