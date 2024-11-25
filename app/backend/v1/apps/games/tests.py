from django.test import TestCase

from django.urls import reverse
from v1.apps.games.models import Game, GameComment
from v1.apps.accounts.models import CustomUser
from rest_framework import status


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


