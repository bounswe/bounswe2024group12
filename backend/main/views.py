from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
import requests
from django.contrib.auth import authenticate, login as djangologin, logout
import logging
from django.utils import timezone

def extract_unique_values(results, key):
                values = set()
                try:
                    for item in results['results']['bindings']:
                        if key in item:
                            values.add(item[key]['value'])
                    return values
                except:
                    return values


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
def property_game(request):
    if request.method == 'POST':
        
        sparql_query = """
                SELECT DISTINCT ?game ?gameLabel  ?genreLabel ?publisherLabel ?countryLabel ?publication_date ?screenwriterLabel ?composerLabel ?platformLabel
            WHERE {
            ?game rdfs:label "The Witcher 3: Wild Hunt"@en;  # Searching by the game name
                    wdt:P136 ?genre;                            # Genre
                    wdt:P123 ?publisher;                        # Publisher
                    wdt:P495 ?country;                          # Country of origin
                    wdt:P577 ?publication_date;                 # Publication date
                    wdt:P58  ?screenwriter;                     # Screenwriter
                    wdt:P86  ?composer;                         # Composer
                    wdt:P400 ?platform;                         # Platform

            # Fetching the labels for the genre, publisher, country, screenwriter, composer, and platform
            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            }
                """
        
        
        url = 'https://query.wikidata.org/sparql'
        headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
        response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
        
        if response.status_code == 200:
            results = response.json()
            
            if results:
                unique_games = extract_unique_values(results, 'gameLabel')
                unique_genres = extract_unique_values(results, 'genreLabel')
                unique_publishers = extract_unique_values(results, 'publisherLabel')
                unique_countries = extract_unique_values(results, 'countryLabel')
                unique_screenwriters = extract_unique_values(results, 'screenwriterLabel')
                unique_publication_dates = extract_unique_values(results, 'publication_date')
                unique_composers = extract_unique_values(results, 'composerLabel')
                unique_platforms = extract_unique_values(results, 'platformLabel')
                return JsonResponse({
                    'games': list(unique_games),
                    'genres': list(unique_genres),
                    'publishers': list(unique_publishers),
                    'countries': list(unique_countries),
                    'screenwriters': list(unique_screenwriters),
                    'composers': list(unique_composers),
                    'platforms': list(unique_platforms),
                    'publication_dates': list(unique_publication_dates)

                                })
            else:
                return JsonResponse({'error': 'No game found with that name'}, status=404)
        else:
            return JsonResponse({'error': 'Failed to query Wikidata'}, status=response.status_code)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def search_game(request):
    if request.method == 'POST':
        print("REQUEST BODY" , request.body)
        data = json.loads(request.body)  # Parse the JSON data from the request body
        game_name = data.get('game_name')
        print("GAME NAME", game_name)
        if not game_name:
            return JsonResponse({'error': 'Game name is required'}, status=400)
        
        sparql_query = f"""
                SELECT DISTINCT ?game ?gameLabel ?genreLabel ?publisherLabel ?countryLabel ?publication_date ?logo ?image ?charactersLabel ?screenwriterLabel ?composerLabel
                WHERE {{
                    ?game wdt:P31 wd:Q7889.
                    ?game rdfs:label "{game_name}"@en;

                    OPTIONAL {{ ?game wdt:P136 ?genre. }}
                    OPTIONAL {{ ?game wdt:P123 ?publisher. }}
                    OPTIONAL {{ ?game wdt:P495 ?country. }}
                    OPTIONAL {{ ?game wdt:P577 ?publication_date. }}
                    OPTIONAL {{ ?game wdt:P58  ?screenwriter. }}
                    OPTIONAL {{ ?game wdt:P86  ?composer. }}
                    OPTIONAL {{ ?game wdt:P154 ?logo. }}
                    OPTIONAL {{ ?game wdt:P18  ?image. }}
                    OPTIONAL {{ ?game wdt:P674 ?characters. }}

                    SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
                }}
                LIMIT 40
            """

        url = 'https://query.wikidata.org/sparql'
        headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
        response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})

        if response.status_code == 200:
            results = response.json()

            if results:
                unique_games = extract_unique_values(results, 'gameLabel')
                unique_genres = extract_unique_values(results, 'genreLabel')
                unique_publishers = extract_unique_values(results, 'publisherLabel')
                unique_countries = extract_unique_values(results, 'countryLabel')
                unique_publication_dates = extract_unique_values(results, 'publication_date')
                unique_logos = extract_unique_values(results, 'logo')
                unique_images = extract_unique_values(results, 'image')
                unique_characters = extract_unique_values(results, 'charactersLabel')
                unique_screenwriters = extract_unique_values(results, 'screenwriterLabel')
                unique_composers = extract_unique_values(results, 'composerLabel')



                
                return JsonResponse({
                    'games': list(unique_games),
                    'genres': list(unique_genres),
                    'publishers': list(unique_publishers),
                    'countries': list(unique_countries),
                    'publication_dates': list(unique_publication_dates),
                    'logos': list(unique_logos),
                    'images': list(unique_images),
                    'characters': list(unique_characters),
                    'screenwriters': list(unique_screenwriters),
                    'composers': list(unique_composers)
                    
                
                    

                                })
            else:
                return JsonResponse({'error': 'No game found with that name'}, status=404)
        else:
            return JsonResponse({'error': 'Failed to query Wikidata'}, status=response.status_code)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

