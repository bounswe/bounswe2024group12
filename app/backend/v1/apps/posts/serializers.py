import base64
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Post, Tag

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
    
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class PostSerializer(serializers.ModelSerializer):
    post_image = Base64ImageField(required=False, allow_null=True)  # Base64 image field
    user = serializers.SerializerMethodField() # User
    tags = TagSerializer(many=True)  # Tag list

    class Meta:
        model = Post
        fields = ['id', 'post_image', 'title', 'fen', 'post_text', 'tags', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags')  # Get tag data
        post = Post.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])  # Get tags or create new one
            post.tags.add(tag)
        return post
        #return Post.objects.create(**validated_data)
    
    def get_user(self, obj):
        return obj.user.username
    
