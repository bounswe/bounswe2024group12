import json
from django.core.management.base import BaseCommand
from v1.apps.games.models import GameOpening

class Command(BaseCommand):
    help = "Import game openings data from a JSON file into the database"

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help="Path to the JSON file containing openings data")

    def handle(self, *args, **options):
        file_path = options['file_path']

        try:
            # Read the JSON file
            with open(file_path, 'r') as json_file:
                openings_data = json.load(json_file)

            # Create game openings in the database
            for opening in openings_data:
                GameOpening.objects.create(
                    eco_code=opening["eco_code"],
                    name=opening["name"],
                    description=opening["description"]
                )

            self.stdout.write(self.style.SUCCESS("Successfully imported game openings into the database."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred: {e}"))