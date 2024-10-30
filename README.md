# Cyril-Grelier.github.io

Website : https://cyril-grelier.github.io/

Local : http://localhost:4000


To run in local:

    docker compose up -d

To see the logs:

    docker compose logs -f

if problem, remove vendor, and remove content from Gemfile.lock (make sure chmod allow edit for all), run `mkdir .jekyll-cache _site` then uncomment the line :
`command: bundle install && bundle exec jekyll serve` in `docker-compose.yml`.
