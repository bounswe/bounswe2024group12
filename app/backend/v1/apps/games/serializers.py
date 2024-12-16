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
    context = serializers.CharField(default="http://www.w3.org/ns/anno.jsonld")
    body = serializers.JSONField()  # Because body is a JSON object
    target = serializers.JSONField()  # Because target is a JSON object

    class Meta:
        model = Annotation
        fields = ['context', 'id', 'type', 'created', 'modified', 'creator', 'body', 'target', 'motivation']

    def to_representation(self, instance):
        """ Customize the JSON output to follow the required structure """
        representation = super().to_representation(instance)
        representation['@context'] = representation.pop('context')  # Change context to @context
        representation['creator'] = {
            "id": f"user-{instance.creator.id}",
            "name": instance.creator.username,
            "type": "Person"
        }
        return representation

