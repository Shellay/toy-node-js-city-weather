# REST service for serving city and weather data

The service is constructed based on
- `PostgreSQL` DB (with `PostGis` extension) for storing and querying city data. Advantage is that
  queries using coordinates can be fast supported by GIST spatial index. Caching and
  partitioning mechanisms are so far not yet considered.
- `restify` application for serving data;
- `jest` for managing tests and test workflow;
- `supertest` for testing REST service itself;

## Development sketch

Here are the outlines of main development interactions.

### Test
So far there can be three types of tests
- `(unit)test`: for testing individual javascript functions without any service dependency.
- `dbTest`: for testing DB connectivity and correctness of SQL queries. `dbTest` requires setting up
  and tearing down of a Postgres docker instance, which is managed via `jest` setup/teardown configurations.
- `serviceTest`: for testing REST services depending on available DB service.

All data used for `dbTest` and `serviceTest` do not have real meanings are never persisted. They only
serve the purpose of checking correctness of technical implementation.

### Dev
Beside testing, it is possible to try out a `dev` instance with real data. In this case it is 
required to manually setup the DB instance, importing the data and starting up the application
(including shutting down and cleaning up of course).

The following CLI commands are needed for such a procedure. E.g.
``` bash
export NODE_ENV=dev
docker-compose up -d                           # Run Postgres DB
sleep 2                                        # Might need some time until DB is ready
node dbModel/prepareDbModel.js                 # Prepare DB model (i.e. DDL)
node data/loadCityData.js ${SAMPLE_DATA_JSON}  # Importing JSON data (here the data of the cities) into Postgres
```
(In production environment there should be comparable but different commands available).

After DB is ready, it's OK to run the application
``` bash
npm run start:app:dev
```

Now can try REST calls
``` bash
curl 'http://localhost:8080/cities?lat=29&lon=76'
# [{"id":1270260,"name":"State of Haryāna","country":"IN","lat":29,"lon":76}]
```

To stop the DB:
``` bash
docker-compose down                            # Stop and destroy the database
```
(For now no persist storage is defined yet - the DB is simply completely gone).
