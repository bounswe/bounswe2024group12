from django.test import TestCase

from django.urls import reverse
from v1.apps.games.models import Game, GameComment, GameBookmark, GameMoveBookmark, GameOpening
from v1.apps.accounts.models import CustomUser
from rest_framework import status

from rest_framework.test import APIClient

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