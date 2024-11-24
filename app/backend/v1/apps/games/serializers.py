from rest_framework import serializers
from .models import Game, GameComment

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class GameCommentSerializer(serializers.ModelSerializer):
    fens_list = serializers.SerializerMethodField()  # FEN'leri liste olarak döndürmek için

    class Meta:
        model = GameComment
        fields = ['id', 'user', 'game', 'position_fen', 'comment_fens', 'fens_list', 'comment_text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'fens_list']

    def get_fens_list(self, obj):
        return obj.get_fens_list()