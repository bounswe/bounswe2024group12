import os
import time
from django.conf import settings
from django.core.management import execute_from_command_line
from django.db import connections

if not settings.configured:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api_core.settings")  # Replace with your project name

def wait_for_db(timeout=120):
    """
    Waits for the database to be ready, with a timeout.
    """
    print("Waiting for database...")
    start_time = time.time()
    while True:
        try:
            connection = connections['default']
            connection.ensure_connection()
            print("Database is ready!")
            break
        except Exception as e:
            if time.time() - start_time > timeout:
                raise TimeoutError("Database is not ready after 60 seconds. Exiting.")
            print(f"Database not ready, retrying in 2 seconds... Error: {e}")
            time.sleep(2)

if __name__ == "__main__":
    wait_for_db()