const fs = require('fs');
const pg = require('pg');
const access = require('../dbUtil/access');
const [ cityDataPath ] = process.argv.slice(2);

const nodeEnv = process.env.NODE_ENV;

// for now only allow script mode in dev/test environment
let dbConfig;
if (['dev', 'test'].includes(nodeEnv)) {
  dbConfig = require('../config')[nodeEnv].db;
} else {
  throw new Error('Not in dev/test environment');
}

async function insertCities(conn, cities) {
  // TODO use pg-promise bulk insertion maybe
  for (const city of cities) {
    await access.insertCity(conn, city);
  }
}

async function main() {
  const sampleDataStr = fs.readFileSync(cityDataPath);
  const cities = JSON.parse(sampleDataStr);
    // note: entry dbConfig.schema should not be accessed here
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query('SET search_path TO city');
    await insertCities(client, cities);
    await client.end();
    console.log('[.] Done.');
}

if (require.main === module) {
  main();
}
