import json
import re

input_filename = 'posts.json'
output_filename = 'posts_updated.json'

# Regex to match " #<digits>" at the end of a string
pattern = re.compile(r"\s*#[0-9]+$")

with open(input_filename, 'r') as f:
    data = json.load(f)

for post in data:
    title = post.get('title', '')
    # Remove any occurrence of " #number" at the end of the title
    new_title = pattern.sub('', title)
    post['title'] = new_title

with open(output_filename, 'w') as f:
    json.dump(data, f, indent=2)