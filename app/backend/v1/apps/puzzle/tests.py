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