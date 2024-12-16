from rest_framework import serializers
from .models import Game, GameComment, Annotation

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

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'game', 'creator', 'body_value', 'body_format', 
                  'target_fen', 'move_number', 'motivation', 'created_at', 'modified_at']
        read_only_fields = ['id', 'created_at', 'modified_at', 'creator']

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user  # Set creator as the authenticated user
        return super().create(validated_data)