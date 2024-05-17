from django.test import TestCase, Client
from django.urls import reverse
from game.models import Game
import json

class GameViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.game1 = Game.objects.create(game_slug='game-1', game_name='Game 1', game_image='http://example.com/image1.jpg')
        self.game2 = Game.objects.create(game_slug='game-2', game_name='Game 2', game_image='http://example.com/image2.jpg')
        self.game3 = Game.objects.create(game_slug='game-3', game_name='Game 3', game_image='http://example.com/image3.jpg')

    def test_search_game_success(self):
        response = self.client.post(reverse('search-game'), json.dumps({'search_term': 'Game'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('games', response.json())

    def test_search_game_no_search_term(self):
        response = self.client.post(reverse('search-game'), json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Game name is required')

    def test_search_game_by_genre_success(self):
        response = self.client.post(reverse('search-game-by', args=['genre']), json.dumps({'search_term': 'RPG'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json())

    def test_search_game_by_invalid_parameter(self):
        response = self.client.post(reverse('search-game-by', args=['invalid']), json.dumps({'search_term': 'RPG'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid search parameter')

    def test_get_game_info_success(self):
        response = self.client.get(reverse('game-info', args=['game-1']))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['gameLabel'], 'Game 1')

    def test_get_game_info_not_found(self):
        response = self.client.get(reverse('game-info', args=['non-existent-game']))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Game not found')

    def test_get_game_of_the_day_success(self):
        response = self.client.get(reverse('game-of-the-day'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('gameLabel', response.json())

    def test_get_popular_games_success(self):
        response = self.client.get(reverse('popular-games'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('games', response.json())

    def test_get_new_games_success(self):
        response = self.client.get(reverse('new-games'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('games', response.json())

    def test_get_game_characters_success(self):
        response = self.client.get(reverse('game-characters', args=['game-1']))
        self.assertEqual(response.status_code, 200)
        self.assertIn('characters', response.json())

    def test_get_game_characters_not_found(self):
        response = self.client.get(reverse('game-characters', args=['non-existent-game']))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Game not found')

    def test_get_property_games_success(self):
        response = self.client.post(reverse('property'), json.dumps({'property_name': 'Some Publisher', 'property_type': 'publisher'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('games', response.json())

    def test_get_property_games_no_property_name(self):
        response = self.client.post(reverse('property'), json.dumps({'property_type': 'publisher'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Property name and type are required')

    def test_get_property_games_invalid_property_type(self):
        response = self.client.post(reverse('property'), json.dumps({'property_name': 'Some Publisher', 'property_type': 'invalid'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid property type')

    def test_fetch_all_games_already_fetched(self):
        Game.objects.bulk_create([
            Game(game_slug='game-4', game_name='Game 4', game_image='http://example.com/image4.jpg'),
            Game(game_slug='game-5', game_name='Game 5', game_image='http://example.com/image5.jpg')
        ])
        response = self.client.get(reverse('fetch-all-games'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Games already fetched')
