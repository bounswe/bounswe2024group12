#!/bin/bash

apps=("v1.apps.posts" "v1.apps.games" "v1.apps.accounts" "v1.apps.healthcheck")

for app in "${apps[@]}"; do
    echo "Testing $app..."
    python manage.py test $app --keepdb
    if [ $? -ne 0 ]; then
        echo "Tests failed for $app"
        exit 1
    fi
done

echo "All tests passed successfully!"
