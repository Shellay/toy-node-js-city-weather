const restify = require('restify');
const errors = require('restify-errors');
const pg = require('pg');
const env = process.env.NODE_ENV || 'dev'
const config = require('./config')[env];
const dbAccess = require('./dbUtil/access');

console.log('NODE_ENV: ' + process.env.NODE_ENV);

const server = restify.createServer();
const pool = new pg.Pool(config.db);
pool.on('connect', (client) => {
  client.query(`SET search_path TO ${config.db.schema}, public`);
});

server.get('/cities/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new errors.InvalidArgumentError(`Invalid argument: id=${id}`));
  } else {
    dbAccess.selectCityWithId(pool, id)
    .then((result) => {
      res.send(result);
      return next();
    })
    .catch((e) => {
      return next(e);
    })
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
  server.listen(8080, () => {
    console.log(`${server.name} listening at ${server.url}`);
  });
}

module.exports = {
  config,
  pool,
  server,
}
