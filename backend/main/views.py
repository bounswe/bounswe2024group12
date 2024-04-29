from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
from django.contrib.auth.hashers import make_password

@csrf_exempt  # Only for demonstration. CSRF protection should be enabled in production.
def signup(request):
    print(request)
    if request.method == 'OPTIONS':
        response = JsonResponse({'message': 'CORS Preflight'})
        response['Access-Control-Allow-Origin'] = '*'  # Allow requests from all origins
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'  # Allow POST and OPTIONS methods
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'  # Allow specified headers
        return response

    if request.method == 'POST':
        print(request.body)
        # Parse JSON data from the request body
        data = json.loads(request.body)

        # Extract username, email, and hashed password from JSON data
        username = data.get('username')
        email = data.get('email')
        hashed_password = data.get('hashedPassword')

        # Create a new user using the RegisteredUser model
        try:
            user = RegisteredUser.objects.create(
                username=username,
                email=email,
                password=hashed_password  # Hash the password
            )
            return JsonResponse({'success': True, 'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    
@csrf_exempt 
def login(request):
    print(request)
    if request.method == 'POST':
        # Parse JSON data from the request body
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        # Find the user with the given email
        try:
            user = RegisteredUser.objects.get(email=email)
            if user.check_password(password):
                return JsonResponse({'success': True, 'message': 'Login successful', 'username': user.username}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'Invalid password'}, status=401)
        except RegisteredUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    

def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

