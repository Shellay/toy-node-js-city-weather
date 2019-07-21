set -eux
export NODE_ENV=dev
docker-compose up -d                              # Run Postgres DB
sleep 2                                           # Might need some time until DB is ready
node dbModel/prepareDbModel.js                    # Prepare DB model (i.e. DDL)
node data/loadCityData.js data/sampleCities.json  # Importing JSON data (here the data of the cities) into Postgres
