from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from django.utils.text import slugify
from .models import Game

def generate_slug(name):
    slug = slugify(name)
    if Game.objects.filter(game_slug=slug).exists():
        i = 1
        while Game.objects.filter(game_slug=slug).exists():
            slug = slugify(name) + '-' + str(i)
            i += 1
    return slug

def get_game_slug(name):   
    game = Game.objects.filter(game_name=name).first()
    return game.game_slug

def get_unique_games(json_list, params, fetch_all=False):
    games = []

    slugs = set()
    for item in json_list['results']['bindings']:
        if fetch_all:
            item_slug = generate_slug(item['gameLabel']['value'])
        else:
            item_slug = get_game_slug(item['gameLabel']['value'])

        if item_slug not in slugs and item_slug != '':
            slugs.add(item_slug)
            game = {}
            for param in params:
                if param in item:
                    game[param] = item[param]['value']
                else:
                    game[param] = None
            game['game_slug'] = item_slug
            games.append(game)
    games_json = {"games": games}
    return games_json

@csrf_exempt
def get_game_info(request, game_slug):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=400)
    
    game = Game.objects.filter(game_slug=game_slug).first()
    if not game:
        return JsonResponse({'error': 'Game not found'}, status=404)
    game_name = game.game_name

    sparql_query = """
            SELECT DISTINCT ?game ?gameLabel ?genreLabel ?publisherLabel ?countryLabel ?publication_date ?screenwriterLabel ?composerLabel ?platformLabel ?image ?logo ?gameDescription
            WHERE {
                ?game rdfs:label "%s"@en;  # Searching by the game name
                OPTIONAL { ?game wdt:P136 ?genre. }                        # Genre
                OPTIONAL { ?game wdt:P123 ?publisher. }                    # Publisher
                OPTIONAL { ?game wdt:P495 ?country. }                      # Country of origin
                OPTIONAL { ?game wdt:P577 ?publication_date. }             # Publication date
                OPTIONAL { ?game wdt:P58 ?screenwriter. }                  # Screenwriter
                OPTIONAL { ?game wdt:P86 ?composer. }                      # Composer
                OPTIONAL { ?game wdt:P400 ?platform. }                     # Platform
                OPTIONAL { ?game wdt:P18 ?image. }                         # Image
                OPTIONAL { ?game wdt:P154 ?logo. }                         # Logo
                OPTIONAL {
                    ?game schema:description ?gameDescription. # Game description
                    FILTER(LANG(?gameDescription) = "en").     # Filter English descriptions
                }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
            }
            LIMIT 1
            """ % game_name
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    game_info = get_unique_games(results, ['gameLabel', 'genreLabel', 'publisherLabel', 'countryLabel', 'publication_date', 'screenwriterLabel', 'composerLabel', 'platformLabel', 'image', 'logo', 'gameDescription'])
    context = game_info['games'][0]
    return JsonResponse(context, safe=False)

@csrf_exempt
def search_game(request):
    data = json.loads(request.body)
    game_name = data.get('game_name')
    if not game_name:
        return JsonResponse({'error': 'Game name is required'}, status=400)
    sparql_query = """
    SELECT DISTINCT ?game ?gameLabel
    WHERE {
        ?game wdt:P31 wd:Q7889;   # Instance of video game
            rdfs:label ?gameLabel.   # Game label
        FILTER(LANG(?gameLabel) = "en")   # Filter labels to English
        FILTER(STRSTARTS(LCASE(?gameLabel), LCASE("%s")))   # Case-insensitive search starting with the given game name
    } 
    LIMIT 10
    """ % game_name
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    games = get_unique_games(results, ['gameLabel'])
    return JsonResponse(games, safe=False)

def fetch_all_games():
    if Game.objects.exists():
        return JsonResponse({'message': 'Games already fetched'})
    sparql_query = """
        SELECT DISTINCT ?game ?gameLabel ?image
        WHERE {
                ?game wdt:P31 wd:Q7889;               # Instance of video game
                OPTIONAL { ?game wdt:P18 ?image; }   # Retrieve game image if available
                ?game rdfs:label ?gameLabel.         # Game label
                FILTER(LANG(?gameLabel) = "en")      # Filter labels to English
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
    """
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    all_games = get_unique_games(results, ['gameLabel', 'image'], fetch_all=True) 
    game = [Game(game_name=game['gameLabel'], game_image=game['image'], game_slug=game['game_slug']) for game in all_games['games']]
    Game.objects.bulk_create(game)
    #return success message
    return JsonResponse({'message': 'Games fetched successfully'})

@csrf_exempt
def get_game_of_the_day(request):
    sparql_query = """
        SELECT DISTINCT ?game ?gameLabel ?publisherLabel ?image
        WHERE {
            ?game wdt:P31 wd:Q7889;  # Instance of video game
                wdt:P577 ?publication_date;  # Publication date
                rdfs:label ?gameLabel. 
                ?game wdt:P18 ?image.
                OPTIONAL { 
                    ?game wdt:P123 ?publisher.
                    ?publisher rdfs:label ?publisherLabel.
                }
                FILTER(LANG(?gameLabel) = "en") 
                FILTER(LANG(?publisherLabel) = "en") 
                FILTER (YEAR(?publication_date) != YEAR(now()) && MONTH(?publication_date) = MONTH(now()) && DAY(?publication_date) = DAY(now()))
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        LIMIT 3
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
        ?game wdt:P31 wd:Q7889.               # Instance of video game
        ?game wdt:P18 ?image.    # Retrieve game image if available
        ?game rdfs:label ?gameLabel.          # Game label
        ?game ?statement ?value.              # Retrieve statements associated with each game
        FILTER(LANG(?gameLabel) = "en")       # Filter labels to English
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
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
    sparql_query = """
        SELECT DISTINCT ?game ?gameLabel ?publicationDate ?image
        WHERE {
        ?game wdt:P31 wd:Q7889;               
        wdt:P577 ?publicationDate;     
        rdfs:label ?gameLabel; 
        wdt:P18 ?image.
        FILTER(?publicationDate <= NOW())   # Filter by publication date less than or equal to current date
        FILTER(LANG(?gameLabel) = "en")      # Filter labels to English
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
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
    return JsonResponse({'games': new_games})

def get_game_characters(request, game_slug):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=400)
    
    game = Game.objects.filter(game_slug=game_slug).first()
    if not game:
        return JsonResponse({'error': 'Game not found'}, status=404)
    game_name = game.game_name

    sparql_query = """
        SELECT DISTINCT ?character ?characterLabel ?image ?characterDescription ?gameLabel
        WHERE {
            ?game rdfs:label "%s"@en;  # Searching by the game name
                wdt:P674 ?character.  # Retrieve characters associated with the game
            OPTIONAL { ?character wdt:P18 ?image. }  # Retrieve character image if available
            ?character rdfs:label ?characterLabel.  # Character label
            OPTIONAL {
                    ?character schema:description ?characterDescription. # Game description
                    FILTER(LANG(?characterDescription) = "en").     # Filter English descriptions
                }
            FILTER(LANG(?characterLabel) = "en")  # Filter labels to English
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          }
        LIMIT 20
    """ % game_name
    url = 'https://query.wikidata.org/sparql'
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(url, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    game = {
        'gameLabel': game_name,
        'game_slug': game_slug,
        'characters': []
    }
    for item in results['results']['bindings']:
        character = {
            'characterLabel' : item['characterLabel']['value'],
            'characterDescription' : item['characterDescription']['value'] if 'characterDescription' in item else None,
            'image' : item['image']['value'] if 'image' in item else None,
            }
        game['characters'].append(character)

    return JsonResponse(game, safe=False)