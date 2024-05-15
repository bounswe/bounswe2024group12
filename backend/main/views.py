from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser
import json
import requests
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import Game, Review
import re

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

def extract_unique_values(results, key):
                values = set()
                try:
                    for item in results['results']['bindings']:
                        if key in item:
                            values.add(item[key]['value'])
                    return values
                except:
                    return values
                
@csrf_exempt
def get_game_info(request, game_name):
    if request.method == 'POST': 
        sparql_query = """
                SELECT DISTINCT ?game ?gameLabel  ?genreLabel ?publisherLabel ?countryLabel ?publication_date ?screenwriterLabel ?composerLabel ?platformLabel
            WHERE {
            ?game rdfs:label "%s"@en;  # Searching by the game name
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
                """ % game_name
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

def createReview(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')
        rating = data.get('rating')
        text = data.get('text')
        
        game = Game.objects.get(title=game)
        
        review = Review.objects.create(
            game=game,
            rating=rating,
            text=text
        )

        review.save()
        
        return JsonResponse({'success': True, 'message': 'Review created successfully', 'game': game, 'rating': rating, 'text': text}, status=201)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

def generate_slug(name):
    slug = name.lower()
    slug = slug.replace(' ', '-')
    slug = re.sub(r'[^\w-]', '', slug)
    slug = slug.strip('-')
    return slug

def get_unique_games(json_list, params):
    #make a json list 'games'
    games = []

    check = 'gameLabel'
    values = set()
    for item in json_list['results']['bindings']:
        item_val = item[check]['value']
        if item_val not in values:
            values.add(item_val)
            game = {}
            for param in params:
                if param in item:
                    game[param] = item[param]['value']
                else:
                    game[param] = None
            game['game-slug'] = generate_slug(item['gameLabel']['value'])
            games.append(game)
    games_json = {"games": games}
    return games_json

@csrf_exempt
def get_all_games(request):
    sparql_query = """
        SELECT DISTINCT ?game ?gameLabel ?image
        WHERE {
        ?game wdt:P31 wd:Q7889;  # Instance of video game
        wdt:P18 ?image. # Retrieve game image if available
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
    """
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    all_games = get_unique_games(results, ['gameLabel', 'image'])
    return JsonResponse(all_games, safe=False)

@csrf_exempt
def get_game_of_the_day(request):
    today = timezone.now().date()
    sparql_query = f"""
        SELECT DISTINCT ?game ?gameLabel ?publisherLabel ?image
        WHERE {{
            ?game wdt:P31 wd:Q7889;  # Instance of video game
            wdt:P577 ?publication_date;  # Publication date
            wdt:P18 ?image. # Retrieve game image if available
            FILTER (YEAR(?publication_date) != {today.year} && MONTH(?publication_date) = {today.month} && DAY(?publication_date) = {today.day})
            SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}
        }}
        LIMIT 1
    """
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    game_of_the_day = get_unique_games(results, ['gameLabel', 'publisherLabel', 'image'])
    context = game_of_the_day['games'][0]
    return JsonResponse(context, safe=False)

@csrf_exempt
def get_popular_games(request):
    sparql_query = """
                SELECT ?game ?gameLabel ?image (COUNT(?statement) as ?statementCount) 
        WHERE {
        ?game wdt:P31 wd:Q7889;               # Instance of video game
        wdt:P18 ?image; # Retrieve game image if available
                rdfs:label ?gameLabel.         # Game label
        FILTER(LANG(?gameLabel) = "en")      # Filter labels to English
        }
        GROUP BY ?game ?gameLabel ?image
        ORDER BY DESC(?statementCount)
        LIMIT 20
    """
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    popular_games = get_unique_games(results, ['gameLabel', 'image'])
    #get the first 10 games
    popular_games['games'] = popular_games['games'][:10]
    return JsonResponse(popular_games, safe=False)



def get_new_games(request):
    today = timezone.now().date()
    sparql_query = """
        SELECT DISTINCT ?game ?gameLabel ?publicationDate ?image
        WHERE {
        ?game wdt:P31 wd:Q7889;               # Instance of video game
                wdt:P577 ?publicationDate;     # Publication date
                wdt:P18 ?image;                # Retrieve game image if available
                rdfs:label ?gameLabel.         # Game label
        FILTER(?publicationDate <= NOW())   # Filter by publication date less than or equal to current date
        FILTER(LANG(?gameLabel) = "en")      # Filter labels to English
        }
        ORDER BY DESC(?publicationDate)
        LIMIT 20
    """
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    new_games = get_unique_games(results, ['gameLabel', 'image'])
    #get the first 10 games
    new_games['games'] = new_games['games'][:10]
    return JsonResponse(new_games, safe=False)


    