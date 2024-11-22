import json
from django.core.management.base import BaseCommand
from v1.apps.games.models import Game
from v1.apps.games.utils import parse_pgn_date  # Ensure parse_pgn_date is accessible from utils or directly in the command

class Command(BaseCommand):
    help = "Import games data from a JSON file into the database"

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help="Path to the JSON file containing games data")

    def handle(self, *args, **options):
        file_path = options['file_path']

        try:
            # Read the JSON file
            with open(file_path, 'r') as json_file:
                games_data = json.load(json_file)

            for game_data in games_data:
                # Extract and parse the PGN date
                raw_date = game_data.get("date", "")
                year, month, day = parse_pgn_date(raw_date)

                # Save the game to the database
                Game.objects.create(
                    event=game_data.get("event"),
                    site=game_data.get("site"),
                    white=game_data.get("white"),
                    black=game_data.get("black"),
                    result=game_data.get("result"),
                    year=year,
                    month=month,
                    day=day,
                    pgn=game_data.get("pgn")
                )

            self.stdout.write(self.style.SUCCESS("Successfully imported games into the database."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred: {e}"))