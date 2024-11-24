import base64
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Post, Like, Comment

# Special field for converting image data into base64 format
class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        # If data is not in base64 string format, apply normal procedure
        if isinstance(data, str) and data.startswith('data:image'):
            # Solve the data that comes in base64 format
            format, imgstr = data.split(';base64,')  # split the format (data:image/png) part and base64 part
            ext = format.split('/')[-1]  # Find the file extension (eg. png)
            data = ContentFile(base64.b64decode(imgstr), name=f'temp.{ext}')  # Create a temp file
        return super().to_internal_value(data)

    def to_representation(self, value):
        # Convert the data into base64 format
        if value:
            with open(value.path, 'rb') as image_file:
                return 'data:image/{};base64,{}'.format(value.file.name.split('.')[-1], base64.b64encode(image_file.read()).decode())
        return None
    

class PostSerializer(serializers.ModelSerializer):
    post_image = Base64ImageField(required=False, allow_null=True)  # Base64 image field
    user = serializers.SerializerMethodField() # User
    tags = serializers.ListField(child=serializers.CharField())  # Basic string list

    class Meta:
        model = Post
        fields = ['id', 'title', 'post_image', 'fen', 'post_text','tags', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        tags_list = validated_data.pop('tags')
        tags_str = ','.join(tags_list)
        post = Post.objects.create(tags=tags_str, **validated_data)
        return post
        #return Post.objects.create(**validated_data)
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['tags'] = instance.tags.split(',') if instance.tags else []  # String to list again
        return ret
    
    def get_user(self, obj):
        return obj.user.username
    


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'created_at', 'fen_notations']