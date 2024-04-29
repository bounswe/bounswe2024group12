from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

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
        hashed_password = data.get('hashedPassword')
        if (RegisteredUser.objects.filter(email=email).exists()):
            return JsonResponse({'success': False, 'message': 'User already exists'}, status=400)
        elif (RegisteredUser.objects.filter(username=username).exists()):
            return JsonResponse({'success': False, 'message': 'Username already exists'}, status=400)
        user = RegisteredUser.objects.create(
                username=username,
                email=email,
                password=hashed_password,  # Hash the password
            )
        user.is_active = True
        user.save()

        return JsonResponse({'success': True, 'message': 'User created successfully'}, status=201)

    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    
@csrf_exempt 
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        logger.info(data)
        email = data.get('email')
        password = data.get('hashedPassword')

        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Login successful', 'username': user.username}, status=200)
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
    

def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

