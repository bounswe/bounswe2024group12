from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from django.utils.text import slugify
from .models import Game
import random

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"

# Map search_by parameters to their corresponding Wikidata properties
SEARCH_BY_PROPERTIES = {
    'genre': 'P136',
    'developer': 'P178',
    'publisher': 'P123',
    'platform': 'P400',
    'composer': 'P86',
    'screenwriter': 'P58',
    'country': 'P495',
    'director': 'P57',
}

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
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    game_info = get_unique_games(results, ['gameLabel', 'genreLabel', 'publisherLabel', 'countryLabel', 'publication_date', 'screenwriterLabel', 'composerLabel', 'platformLabel', 'image', 'logo', 'gameDescription'])
    context = game_info['games'][0]
    return JsonResponse(context, safe=False)

@csrf_exempt
def search_game(request):
    data = json.loads(request.body)
    game_name = data.get('search_term')
    if not game_name:
        return JsonResponse({'error': 'Game name is required'}, status=400)
    sparql_query = """
    SELECT DISTINCT ?game ?gameLabel
    WHERE {
        ?game wdt:P31 wd:Q7889;   # Instance of video game
            rdfs:label ?gameLabel.   # Game label
        FILTER(LANG(?gameLabel) = "en")   # Filter labels to English
        FILTER(CONTAINS(LCASE(?gameLabel), LCASE("%s")))   # Case-insensitive search starting with the given game name
    } 
    LIMIT 5
    """ % game_name
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
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
        labels = [{'gameLabel': result['label']['value'], 'game-slug': ''} for result in results['results']['bindings']]
        return JsonResponse({'results': labels})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Failed to parse response from SPARQL endpoint'}, status=500)
    except KeyError:
        return JsonResponse({'error': 'Unexpected response format from SPARQL endpoint'}, status=500)
    
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
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
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
                FILTER (YEAR(?publication_date) != YEAR(now()) && MONTH(?publication_date) != MONTH(now()) && DAY(?publication_date) = DAY(now()))
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        LIMIT 3
    """
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    game_of_the_day = get_unique_games(results, ['gameLabel', 'publisherLabel', 'image'])
    if not game_of_the_day['games']:
        #return a random game that has a image if there are no games for the day from the database
        game = Game.objects.filter(game_image__isnull=False).order_by('?').first()
        context = {
            'gameLabel': game.game_name,
            'game_slug': game.game_slug,
            'publisherLabel': None,
            'image': game.game_image
        }
    else:
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
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
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
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    new_games = get_unique_games(results, ['gameLabel', 'image'])
    #get the first 10 games
    new_games['games'] = new_games['games'][:10]
    return JsonResponse(new_games, safe=False)

@csrf_exempt
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
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
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

@csrf_exempt
def get_property_games(request):
    data = json.loads(request.body)
    property_name = data.get('property_name')
    property_type = data.get('property_type').lower()
    if not property_name or not property_type:
        return JsonResponse({'error': 'Property name and type are required'}, status=400)
    if property_type not in SEARCH_BY_PROPERTIES:
        return JsonResponse({'error': 'Invalid property type'}, status=400)
    property_id = SEARCH_BY_PROPERTIES[property_type]
    sparql_query="""
    SELECT DISTINCT ?gameLabel ?genreLabel ?image ?gameDescription ?rating ?logo
    WHERE {
      ?entity rdfs:label "%s"@en.
      ?game wdt:%s ?entity ;
            wdt:P31 wd:Q7889 .  # Filter for items that are instance of "video game"
      OPTIONAL { ?game wdt:P136 ?genre. }                        # Genre
      OPTIONAL { ?game wdt:P18 ?image. }                         # Image
      OPTIONAL {
                    ?game schema:description ?gameDescription. # Game description
                    FILTER(LANG(?gameDescription) = "en").     # Filter English descriptions
                }
      OPTIONAL { ?game wdt:P154 ?logo. }                         # Logo
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
LIMIT 20""" % (property_name, property_id)
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    #get the first 10 games
    property_games = get_unique_games(results, ['gameLabel', 'genreLabel', 'image', 'gameDescription', 'logo'])
    property_games['games'] = property_games['games'][:10]
    #add random rating field from 3.5 - 5 to each game from the database
    for game in property_games['games']:
        game_obj = Game.objects.filter(game_name=game['gameLabel']).first()
        game['rating'] = round(random.uniform(3.9, 5), 2) if game_obj else None
    
    sparql_query = """
        SELECT DISTINCT ?entity ?entityLabel ?image ?description
        WHERE {
        ?entity rdfs:label "%s"@en .
        OPTIONAL { ?entity wdt:P18 ?image . }  # P18 is the property for image
        OPTIONAL { ?entity schema:description ?description . 
                FILTER(LANG(?description) = "en").}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        LIMIT 1""" % property_name
    headers = {'User-Agent': 'Mozilla/5.0 (Django Application)', 'Accept': 'application/json'}
    response = requests.get(SPARQL_ENDPOINT, headers=headers, params={'query': sparql_query, 'format': 'json'})
    results = response.json()
    if results['results']['bindings']:
        property_image = results['results']['bindings'][0]['image']['value'] if 'image' in results['results']['bindings'][0] else None
        property_description = results['results']['bindings'][0]['description']['value'] if 'description' in results['results']['bindings'][0] else None
    else:
        property_image = None
        property_description = None
        
    context = {
        'property_name': property_name,
        'property_type': property_type,
        'property_image': property_image,
        'property_description': property_description,
        'games': property_games['games']
    }
    return JsonResponse(context, safe=False)

    