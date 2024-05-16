from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RegisteredUser, Follow
import json
import requests
from django.contrib.auth import authenticate, login as djangologin, logout
from django.utils import timezone
import re


SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"

# Map search_by parameters to their corresponding Wikidata properties
SEARCH_BY_PROPERTIES = {
    'genre': 'P136',
    'developer': 'P178',
    'publisher': 'P123',
    'platform': 'P400',
    'composer': 'P86'
}

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

def index(request):
    return JsonResponse({'message': 'Welcome to the PlayLog API!'})

def generate_slug(name):
    slug = name.lower()
    slug = slug.replace(' ', '-')
    slug = re.sub(r'[^\w-]', '', slug)
    slug = slug.strip('-')
    return slug

def get_game_slug(request):   
    data = json.loads(request.body)
    game_name = data.get('game_name')
    if not game_name:
        return JsonResponse({'error': 'Game name is required'}, status=400)
    slug = generate_slug(game_name)
    return JsonResponse({'slug': slug})

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
def search_game(request):
    data = json.loads(request.body)
    game_name = data.get('search_term')
    if not game_name:
        return JsonResponse({'error': 'Game name is required'}, status=400)
    sparql_query = """
            SELECT DISTINCT ?game ?gameLabel
            WHERE {
                ?game wdt:P31 wd:Q7889;  # Instance of video game
                    rdfs:label ?gameLabel. # Game label
                FILTER(LANG(?gameLabel) = "en")  # Filter labels to English
                FILTER(CONTAINS(LCASE(?gameLabel), LCASE("%s")))  # Case-insensitive search by name
                } 
                LIMIT 10
                """ % game_name
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    games = get_unique_games(results, ['gameLabel'])
    return JsonResponse(games, safe=False)

@csrf_exempt
def search_game_by(request, search_by):
    data = json.loads(request.body)
    
    search_term = data.get('search_term')
    if not search_term:
        return JsonResponse({'error': 'Search term is required'}, status=400)

    if search_by not in SEARCH_BY_PROPERTIES:
        return JsonResponse({'error': 'Invalid search parameter'}, status=400)

    property_id = SEARCH_BY_PROPERTIES[search_by]
    query = f"""
    SELECT DISTINCT ?label
    WHERE {{
        ?game wdt:P31 wd:Q7889;  # Instance of video game
              wdt:{property_id} ?propertyValue;  # Property (genre, developer, etc.)
              rdfs:label ?gameLabel.  # Game label
        ?propertyValue rdfs:label ?label.  # Property label
        FILTER(LANG(?gameLabel) = "en")  # Filter labels to English
        FILTER(LANG(?label) = "en")  # Filter property labels to English
        FILTER(CONTAINS(LCASE(?label), LCASE("{search_term}")))  # Case-insensitive search by property
    }}
    LIMIT 4
    """

    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    
    response = requests.get(SPARQL_ENDPOINT, params={'query': query}, headers=headers)

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch data from SPARQL endpoint'}, status=response.status_code)

    try:
        results = response.json()
        labels = [result['label']['value'] for result in results['results']['bindings']]
        return JsonResponse({'results': labels})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Failed to parse response from SPARQL endpoint'}, status=500)
    except KeyError:
        return JsonResponse({'error': 'Unexpected response format from SPARQL endpoint'}, status=500)
    

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


@csrf_exempt
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
    new_games = list(extract_unique_values(results, 'gameLabel'))[:10]
    new_games = [{'game-name': game, 'game-slug': generate_slug(game)} for game in new_games]
    return JsonResponse({'games': new_games}) 

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
 
def get_follower_count(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        user = RegisteredUser.objects.get(username=username)
        followers = Follow.objects.filter(followed_user_id=user.user_id)
        return followers.count()
    
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
        reviewCount = 3
        followers = get_follower_count(request)
        following = get_following_count(request)
        return JsonResponse({ "gamesLiked": gamesLiked, "reviewCount": reviewCount, "followers": followers, "following": following})
    