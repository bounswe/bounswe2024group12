from rest_framework import serializers
from .models import Post

# TODO: Add user to the posts after creating user model

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        #fields = ['id', 'post_image', 'fen', 'post_text', 'user', 'created_at']
        fields = ['id', 'post_image', 'fen', 'post_text', 'created_at']
        #read_only_fields = ['id', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        return Post.objects.create(**validated_data)