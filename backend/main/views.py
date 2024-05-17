from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser, Follow
import json
from django.contrib.auth import authenticate, login as djangologin
from django.utils import timezone
from .models import Review

def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

@csrf_exempt  # Only for demonstration. CSRF protection should be enabled in production.
def signup(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({'message': 'CORS Preflight'})
        response['Access-Control-Allow-Origin'] = '*'  # Allow requests from all origins
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'  # Allow POST and OPTIONS methods
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'  # Allow specified headers
        return response

    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Check if the username or email already exists
        if RegisteredUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if RegisteredUser.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        try:
            user = RegisteredUser.objects.create_user(
                username=username,
                email=email,
                password=password,  # Hash the password
                is_active=True
            )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        

        return JsonResponse({'success': True, 'message': 'User created successfully', 'username': user.username, 'email': user.email, "password": user.password}, status=201)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt 
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        if user is not None:
            djangologin(request, user)
            response = JsonResponse({'success': True, 'message': 'Login successful', 'username': user.username, "token" : "dummy-token"}, status=200)
            response.set_cookie("token", "dummy-token")
            return response
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    
@csrf_exempt
def follow_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        followed_user = data.get('followed_user')
        user = RegisteredUser.objects.get(username=username)
        followed_user = RegisteredUser.objects.get(username=followed_user)
        Follow.objects.create(user_id=user.user_id, followed_user_id=followed_user.user_id)
        return JsonResponse({'message': 'User followed successfully', "success": True})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def unfollow_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        followed_user = data.get('followed_user')
        user = RegisteredUser.objects.get(username=username)
        followed_user = RegisteredUser.objects.get(username=followed_user)
        Follow.objects.filter(user_id=user.user_id, followed_user_id=followed_user.user_id).delete()
        return JsonResponse({'message': 'User unfollowed successfully', "success": True})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt   
def get_followers(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        followers = Follow.objects.filter(followed_user_id=user.user_id)
        if not followers:
            return JsonResponse({'followers': []})
        followers_list = []
        for follower in followers:
            followers_list.append(RegisteredUser.objects.get(user_id=follower.user_id).username)
        return JsonResponse({'followers': followers_list})
        
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt    
def get_following(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        following = Follow.objects.filter(user_id=user.user_id).values_list('followed_user_id', flat=True)
        if not following:
            return JsonResponse({'following': []})
        following_list = []
        for followed_user_id in following:
            following_list.append(RegisteredUser.objects.get(user_id=followed_user_id).username)
        return JsonResponse({'following': following_list})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def get_follower_count(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        followers = Follow.objects.filter(followed_user_id=user.user_id)
        return followers.count()

@csrf_exempt
def get_following_count(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        following = Follow.objects.filter(user_id=user.user_id)
        return following.count()

@csrf_exempt
def is_following(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        followed_user = data.get('followed_user')
        user = RegisteredUser.objects.get(username=username)
        followed_user = RegisteredUser.objects.get(username=followed_user)
        is_following = Follow.objects.filter(user_id=user.user_id, followed_user=followed_user.user_id).exists()
        return JsonResponse({'is_following': is_following})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def user_check(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        if RegisteredUser.objects.filter(username=username).exists():
            return JsonResponse({'exists': True})
        else:
            return JsonResponse({'exists': False})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

    
@csrf_exempt
def user_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        gamesLiked = 2
        reviewCount = get_review_count(request)
        followers = get_follower_count(request)
        following = get_following_count(request)
        return JsonResponse({ "gamesLiked": gamesLiked, "reviewCount": reviewCount, "followers": followers, "following": following})

def get_review_count(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        reviews = Review.objects.filter(user_id=user.user_id)
        return reviews.count()

@csrf_exempt
def create_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')
        rating = data.get('rating')
        text = data.get('text')
        user = data.get("user")
        user_id = RegisteredUser.objects.get(username=user).user_id
        
        review = Review.objects.create(
            game_slug = game,
            rating = rating,
            text = text,
            user_id = user_id
        )
        
        return JsonResponse({'success': True, 'message': 'Review created successfully', 'game': game, 'rating': rating, 'text': text}, status=201)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt   
def edit_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        review = data.get('review') # Review ID
        rating = data.get('rating')
        text = data.get('text')
        
        review = Review.objects.get(id=review)
        review.rating = rating
        review.text = text
        review.lastEditDate = timezone.now()
        review.save()
        
        return JsonResponse({'success': True, 'message': 'Review updated successfully', 'game': review.game_slug, 'rating': review.rating, 'text': review.text}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt    
def delete_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        review = data.get('review') # Review ID
        
        review = Review.objects.get(id=review)
        review.delete()
        
        return JsonResponse({'success': True, 'message': 'Review deleted successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt   
def like_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        review = data.get('review')
        user = data.get('user')
        
        review = Review.objects.get(id=review)
        user_id = RegisteredUser.objects.get(username=user).user_id
        
        review.likedBy.add(user_id)
        review.likes += 1
        review.save()
        
        return JsonResponse({'success': True, 'message': 'Review liked successfully', 'likes': review.likes}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt    
def unlike_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        review = data.get('review')
        user = data.get('user')
        user_id = RegisteredUser.objects.get(username=user).user_id
        
        review = Review.objects.get(id=review)
        user_id = RegisteredUser.objects.get(user_id=user_id)
        
        review.likedBy.remove(user_id)
        review.likes -= 1
        review.save()
        
        return JsonResponse({'success': True, 'message': 'Review unliked successfully', 'likes': review.likes}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    
# Returns reviews posted within 1 week for a specific game
@csrf_exempt
def recent_reviews(request):
    if request.method == 'POST':        
        reviews = Review.objects.filter(creationDate__gte=timezone.now() - timezone.timedelta(days=7))
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def recent_reviews_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')
        reviews = Review.objects.filter(game_slug=game, creationDate__gte=timezone.now() - timezone.timedelta(days=7))
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt   
def recent_reviews_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = data.get('username')
        user_id = RegisteredUser.objects.get(username=user).user_id
        reviews = Review.objects.filter(user=user_id, creationDate__gte=timezone.now() - timezone.timedelta(days=7))
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)

# Returns reviews that have more than 50 likes   
@csrf_exempt
def popular_reviews(request):
    if request.method == 'POST':
        reviews = Review.objects.filter( likes__gt=5)
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def popular_reviews_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')
        reviews = Review.objects.filter(game_slug=game, likes__gt=5)
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def popular_reviews_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = data.get('username')
        user = RegisteredUser.objects.get(username=user)
        reviews = Review.objects.filter(user=user.user_id, likes__gt=5)
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)

@csrf_exempt    
def get_user_reviews(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = data.get('user')
        user = RegisteredUser.objects.get(username=user)
        game = data.get('game')
        reviews = Review.objects.filter(user=user.user_id, game_slug=game)
        reviews = list(reviews.values())
        if not reviews:
            return JsonResponse({'error': 'No reviews found for this user'}, status=404)
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def user_all_reviews(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        reviews = Review.objects.filter(user=user)
        reviews = list(reviews.values())
        for review in reviews:
            user = RegisteredUser.objects.get(user_id=review['user_id'])
            review['user'] = user.username
        return JsonResponse({'reviews': reviews}, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)