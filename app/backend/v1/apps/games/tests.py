from django.test import TestCase

from django.urls import reverse
from v1.apps.games.models import Game, GameComment, GameBookmark, GameMoveBookmark, GameOpening, Annotation
from v1.apps.accounts.models import CustomUser
from rest_framework import status
from unittest.mock import patch

from rest_framework.test import APIClient, APITestCase

class FilterGamesTest(TestCase):
    def setUp(self):
        self.game1 = Game.objects.create(event="Event1", site="Site1", white="Player1", black="Player2", result="1-0", year=2024)
        self.game2 = Game.objects.create(event="Event2", site="Site2", white="Player3", black="Player4", result="0-1", year=2023)
        self.filter_url = reverse('game-filter')

    def test_filter_games_by_year(self):
        response = self.client.get(self.filter_url, {'year': 2024})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['games']), 1)
        self.assertEqual(response.json()['games'][0]['event'], "Event1")

    def test_filter_games_by_player(self):
        response = self.client.get(self.filter_url, {'player': 'Player1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['games']), 1)
        self.assertEqual(response.json()['games'][0]['white'], "Player1")


class GameCommentModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.game = Game.objects.create(event="Test Event", site="Test Site", white="Player1", black="Player2", result="1-0", year=2024)
    
    def test_create_comment(self):
        comment = GameComment.objects.create(
            user=self.user,
            game=self.game,
            position_fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            comment_fens="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR,rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            comment_text="Great move!"
        )
        self.assertEqual(comment.user.username, "testuser")
        self.assertEqual(comment.game.event, "Test Event")
        self.assertEqual(comment.position_fen, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
        self.assertEqual(len(comment.get_fens_list()), 2)

class BookmarkGameTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.game = Game.objects.create(
            event="Test Event",
            site="Test Site",
            white="Player1",
            black="Player2",
            result="1-0",
            year=2024,
            month=12,
            day=15,
            pgn="1. e4 e5 2. Nf3 Nc6"
        )
        self.url = reverse('toggle-game-bookmark', args=[self.game.id])

    def test_bookmark_game_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        bookmark_exists = GameBookmark.objects.filter(user=self.user, game=self.game).exists()
        self.assertTrue(bookmark_exists)

    def test_unbookmark_game_authenticated(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        bookmark_exists = GameBookmark.objects.filter(user=self.user, game=self.game).exists()
        self.assertFalse(bookmark_exists)

    def test_bookmark_game_unauthenticated(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BookmarkGameMoveTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.game = Game.objects.create(
            event="Test Event",
            site="Test Site",
            white="Player1",
            black="Player2",
            result="1-0",
            year=2024,
            month=12,
            day=15,
            pgn="1. e4 e5 2. Nf3 Nc6"
        )
        self.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        self.url = reverse('toggle-game-move-bookmark', args=[self.game.id])

    def test_bookmark_game_move_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"fen": self.fen})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        bookmark_exists = GameMoveBookmark.objects.filter(user=self.user, game=self.game, fen=self.fen).exists()
        self.assertTrue(bookmark_exists)

    def test_unbookmark_game_move_authenticated(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, {"fen": self.fen})
        response = self.client.post(self.url, {"fen": self.fen})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        bookmark_exists = GameMoveBookmark.objects.filter(user=self.user, game=self.game, fen=self.fen).exists()
        self.assertFalse(bookmark_exists)

    def test_bookmark_game_move_unauthenticated(self):
        response = self.client.post(self.url, {"fen": self.fen})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GetOpeningByECOTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Add test data
        GameOpening.objects.create(
            eco_code="C50",
            name="Giuoco Pianissimo (Italian Game)",
            description="A quiet version of the Italian Game, emphasizing slow development and pawn structure."
        )
        GameOpening.objects.create(
            eco_code="C60",
            name="Ruy-Lopez (Spanish Game)",
            description="Highly strategic opening where White attacks the knight on c6 to exert pressure on Black's pawn structure."
        )
    
    def test_get_opening_by_valid_eco(self):
        response = self.client.get('/v1/games/openings/', {'eco_code': 'C50'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Giuoco Pianissimo (Italian Game)")
        self.assertEqual(response.data['description'], "A quiet version of the Italian Game, emphasizing slow development and pawn structure.")
    
    def test_get_opening_by_invalid_eco(self):
        response = self.client.get('/v1/games/openings/', {'eco_code': 'C99'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Opening with ECO code C99 not found")
    
    def test_get_opening_without_eco(self):
        response = self.client.get('/v1/games/openings/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "ECO code is required")

class GetTournamentRoundPGNTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/v1/games/tournament/round/uU0gySB0/pgn/"

    @patch('v1.apps.games.views.requests.get')
    def test_get_pgn_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.text = "[Event \"Example Event\"]\n1. e4 e5 2. Nf3 Nc6"

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("pgn", response.data)

    @patch('v1.apps.games.views.requests.get')
    def test_get_pgn_not_found(self, mock_get):
        mock_get.return_value.status_code = 404

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "Tournament round not found")

    @patch('v1.apps.games.views.requests.get')
    def test_get_pgn_server_error(self, mock_get):
        mock_get.side_effect = Exception("Internal error")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.data)

class GetTournamentRoundTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/v1/games/tournaments/casablanca-chess-2024/round-1/p9DoebWl/"

    @patch('v1.apps.games.views.requests.get')
    def test_get_tournament_round_success(self, mock_get):
        mock_response = {
            "round": {"id": "p9DoebWl", "name": "Round 1"},
            "tour": {"id": "ZuOkdeXK", "name": "Casablanca Chess 2024"}
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), mock_response)

    @patch('v1.apps.games.views.requests.get')
    def test_get_tournament_round_failure(self, mock_get):
        mock_get.side_effect = Exception("API Error")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.json())



class AnnotationTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="testuser", password="password123")
        self.other_user = CustomUser.objects.create_user(username="otheruser", password="password123")
        self.game = Game.objects.create(white="Kasparov", black="Deep Blue", year=1997)
        self.annotation = Annotation.objects.create(
            game=self.game,
            creator=self.user,
            type="Annotation",
            created="2024-03-14T12:00:00Z",
            modified="2024-03-14T12:00:00Z",
            body={
                "type": "TextualBody",
                "value": "Test annotation",
                "format": "text/plain"
            },
            target={
                "type": "ChessPosition",
                "source": f"http://localhost/games/{self.game.id}",
                "state": {
                    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                    "moveNumber": 1
                }
            },
            motivation="commenting"
        )       
        self.get_url = reverse('annotations_list_create', kwargs={'game_id': self.game.id})
        self.post_url = reverse('annotations_list_create', kwargs={'game_id': self.game.id})
        self.put_url = reverse('annotation_detail', kwargs={'game_id': self.game.id, 'anno_id': self.annotation.id})
        self.delete_url = reverse('annotation_detail', kwargs={'game_id': self.game.id, 'anno_id': self.annotation.id})

    def test_get_annotations_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.get_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertIn('@context', response.data[0])
        self.assertEqual(response.data[0]['@context'], "http://www.w3.org/ns/anno.jsonld")
        self.assertEqual(response.data[0]['body']['value'], "Test annotation")

    def test_create_annotation_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "@context": "http://www.w3.org/ns/anno.jsonld",
            "type": "Annotation",
            "body": {
                "type": "TextualBody",
                "value": "New annotation content",
                "format": "text/plain"
            },
            "target": {
                "type": "ChessPosition",
                "source": f"http://localhost/games/{self.game.id}",
                "state": {
                    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                    "moveNumber": 2
                }
            },
            "motivation": "commenting"
        }
        response = self.client.post(self.post_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['body']['value'], 'New annotation content')
        

    def test_update_annotation_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "body": {
                "value": "Updated annotation content"
            },
            "modified": "2024-03-14T12:10:00Z"
        }
        response = self.client.put(self.put_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.annotation.refresh_from_db()
        self.assertEqual(self.annotation.body['value'], 'Updated annotation content')

    def test_delete_annotation_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        annotation_exists = Annotation.objects.filter(id=self.annotation.id).exists()
        self.assertFalse(annotation_exists)

    def test_unauthenticated_user_cannot_create_annotation(self):
        data = {
            "type": "Annotation",
            "body": {
                "type": "TextualBody",
                "value": "Unauthorized annotation content",
                "format": "text/plain"
            },
            "target": {
                "type": "ChessPosition",
                "source": f"http://localhost/games/{self.game.id}",
                "state": {
                    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                    "moveNumber": 2
                }
            },
            "motivation": "commenting"
        }
        response = self.client.post(self.post_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_only_creator_can_update_annotation(self):
        self.client.force_authenticate(user=self.other_user)
        data = {
            "body": {
                "value": "Malicious update"
            }
        }
        response = self.client.put(self.put_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_creator_can_delete_annotation(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
