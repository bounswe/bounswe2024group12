#!/bin/bash

apps=("v1.apps.posts" "v1.apps.games" "v1.apps.accounts" "v1.apps.healthcheck" "v1.apps.puzzle")

for app in "${apps[@]}"; do
    echo "Testing $app..."
    python manage.py test $app --keepdb
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed for $app"
    else
        echo "✅ Tests passed for $app"
    fi
done

echo "🟢 All tests completed. Check individual test results for failures."
