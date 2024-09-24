import json
from django.test import TestCase, Client
from django.urls import reverse
import requests_mock

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"

# Map search_by parameters to their corresponding Wikidata properties
SEARCH_BY_PROPERTIES = {
    'genre': 'P136',
    'developer': 'P178',
    'publisher': 'P123',
    'platform': 'P400',
    'composer': 'P86',
    'screenwriter': 'P58',
    'country': 'P495',
    'director': 'P57',
}
# START OF THE TEST CASES FOR SEARCH GAME BY
class SearchGameByTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_search_game_by_missing_search_term(self):
        response = self.client.post(
            reverse('search_game_by', args=['genre']),
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'error': 'Search term is required'})

    def test_search_game_by_invalid_search_parameter(self):
        response = self.client.post(
            reverse('search_game_by', args=['invalid']),
            data=json.dumps({'search_term': 'action'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {'error': 'Invalid search parameter'})

    @requests_mock.Mocker()
    def test_search_game_by_successful(self, mock):
        mock_response = {
            "results": {
                "bindings": [
                    {"label": {"value": "Action Game"}},
                    {"label": {"value": "Adventure Game"}},
                ]
            }
        }
        mock.get(SPARQL_ENDPOINT, json=mock_response, status_code=200)

        response = self.client.post(
            reverse('search_game_by', args=['genre']),
            data=json.dumps({'search_term': 'action'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        expected_response = {
            'results': [
                {'gameLabel': 'Action Game', 'game-slug': ''},
                {'gameLabel': 'Adventure Game', 'game-slug': ''}
            ]
        }
        self.assertJSONEqual(response.content, expected_response)

    @requests_mock.Mocker()
    def test_search_game_by_sparql_error(self, mock):
        mock.get(SPARQL_ENDPOINT, status_code=500)

        response = self.client.post(
            reverse('search_game_by', args=['genre']),
            data=json.dumps({'search_term': 'action'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 500)
        self.assertJSONEqual(response.content, {'error': 'Failed to fetch data from SPARQL endpoint'})

    @requests_mock.Mocker()
    def test_search_game_by_invalid_response_format(self, mock):
        mock.get(SPARQL_ENDPOINT, text='invalid json')

        response = self.client.post(
            reverse('search_game_by', args=['genre']),
            data=json.dumps({'search_term': 'action'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 500)
        self.assertJSONEqual(response.content, {'error': 'Failed to parse response from SPARQL endpoint'})

# END OF THE TEST CASES FOR SEARCH GAME BY