import json
from datetime import datetime
from django.utils import timezone
from v1.apps.posts.models import Post
from v1.apps.accounts.models import CustomUser

with open('posts.json', 'r') as f:
    data = json.load(f)

    for item in data:
        user_id = item["user_id"]
        user = CustomUser.objects.get(id=user_id)
        
        # Create the post first (created_at will be auto_now_add)
        post = Post.objects.create(
            title=item["title"],
            fen=item["fen"],
            post_text=item["post_text"],
            tags=",".join(item["tags"]),  # Convert list to comma-separated string
            user=user
        )

        # Update created_at since it's auto_now_add by default
        # Convert ISO string to datetime
        custom_created_at = datetime.fromisoformat(item["created_at"].replace("Z", "+00:00"))
        post.created_at = custom_created_at
        post.save()