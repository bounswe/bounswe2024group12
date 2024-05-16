from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
import requests
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate
from django.utils import timezone
import re

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
        user = RegisteredUser.objects.create_user(
            username=username,
            email=email,
            password=password,  # Hash the password
            is_active=True
        )
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
            response = JsonResponse({'success': True, 'message': 'Login successful', 'username': user.username, "token" : "dummy-token"}, status=200)
            response.set_cookie("token", "dummy-token")
            return response
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)
