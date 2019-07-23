const restify = require('restify');
const errors = require('restify-errors');
const pg = require('pg');
const env = process.env.NODE_ENV || 'dev'
const config = require('./config')[env];
const dbAccess = require('./dbUtil/access');
const dbAdapter = require('./dbUtil/dbCityJsonAdapter');
const weatherApi = require('./util/weatherApi');

console.log('NODE_ENV: ' + process.env.NODE_ENV);

const server = restify.createServer();
server.use(restify.plugins.queryParser());

const pool = new pg.Pool(config.db);
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${config.db.schema}, public`);
});

/**
 * Route for retrieving city from DB
 */
server.get('/cities/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new errors.InvalidArgumentError(`Invalid argument: id=${id}`));
  } else {
    dbAccess.selectCityWithId(pool, id)
    .then((result) => {
      if (result === null) {
        return next(new errors.NotFoundError('not found'));
      } else {
        res.send(dbAdapter.adaptDbReturnedJsonForCityId(result));
        return next();
      }
    })
    .catch((e) => {
      return next(e);
    });
  }
});

/**
 * Route for finding cities around coordinates
 */
server.get('/cities', (req, res, next) => {
  // NOTE We use `lng` as the parameter name for latitude, which is different from
  //   the underlying `lon`
  const { lat, lng } = req.query;
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lng);
  if (isNaN(latNum) || isNaN(lonNum)) {
    return next(new errors.InvalidArgumentError(
      `Invalid argument: lat=${latNum} lon=${lonNum}`));
  } else {
    dbAccess.selectCityAroundCoord(pool, latNum, lonNum)
    .then((result) => {
      res.send(result.map(dbAdapter.adaptDbReturnedJsonForCityCoordQuery));
      return next();
    })
    .catch((e) => {
      return next(e);
    });
  }
});

/**
 * Route for querying weather for city
 */
server.get('/cities/:id/weather', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new errors.InvalidArgumentError(`Invalid argument: id=${id}`));
  } else {
    // TODO do we check cityId in DB?
    // TODO error handling
    weatherApi.requestWeather(config.api.weather.url, id, config.api.weather.appid)
    .then((jsonBody) => {
      res.send(jsonBody);
      return next();
    })
    .catch((e) => {
      if (e instanceof errors.HttpError) {
        return next(e);
      } else {
        console.error(e);
        return next(new errors.InternalServerError());
      }
    });
  }
});

function shutDown() {
  console.log(`Gracefully closing server.`);
  server.close(() => {
    console.log(`Ending DB pool.`);
    pool.end();
  });
}

process.on('SIGINT', shutDown);

if (require.main === module) {
  server.listen(config.app.port, () => {
    console.log(`${server.name} listening at ${server.url}`);
  });
}

module.exports = {
  config,
  pool,
  server,
}
