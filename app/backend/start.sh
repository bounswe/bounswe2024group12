#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database..."
python wait_for_db.py

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Start the Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000