from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
from django.contrib.auth.hashers import make_password
import requests

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
        
        def extract_unique_values(results, key):
                values = set()
                for item in results['results']['bindings']:
                    if key in item:
                        values.add(item[key]['value'])
                return values
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
                unique_composers = extract_unique_values(results, 'composerLabel')
                unique_platforms = extract_unique_values(results, 'platformLabel')
                return JsonResponse({
                    'games': list(unique_games),
                    'genres': list(unique_genres),
                    'publishers': list(unique_publishers),
                    'countries': list(unique_countries),
                    'screenwriters': list(unique_screenwriters),
                    'composers': list(unique_composers),
                    'platforms': list(unique_platforms)
                                })
            else:
                return JsonResponse({'error': 'No game found with that name'}, status=404)
        else:
            return JsonResponse({'error': 'Failed to query Wikidata'}, status=response.status_code)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

