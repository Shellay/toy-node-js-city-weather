set -eux
export NODE_ENV=dev
docker-compose up -d
sleep 2
node dbModel/prepareDbModel.js
curl http://bulk.openweathermap.org/sample/city.list.json.gz |\
  zcat |\
  node data/jsonToCsv.js |\
  docker exec -i city-weather_postgis_1 psql -U postgres -d template1 \
    -c "COPY city.city FROM STDIN WITH (FORMAT 'text');"
