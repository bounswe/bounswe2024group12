from rest_framework import serializers


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'Post'
        fields = ['id', 'post_image', 'fen', 'post_text', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']