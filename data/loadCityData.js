const fs = require('fs');
const path = require('path');
const pg = require('pg');
const access = require('../dbUtil/access');
const [ cityDataPath ] = process.argv.slice(2);

const nodeEnv = process.env.NODE_ENV;

if (!fs.existsSync(cityDataPath)) {
  throw new Error(`Invalid path: ${cityDataPath}`);
}

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
  try {
    const sampleDataStr = fs.readFileSync(cityDataPath);
    const cities = JSON.parse(sampleDataStr);
    // note: entry dbConfig.schema should not be accessed here
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query('SET search_path TO city');
    await client.query('BEGIN');
    await insertCities(client, cities);
    await client.query('COMMIT');
    // TODO find a better place for this line
    await client.query(
      fs.readFileSync(path.join(__dirname, '..', 'dbModel', 'cityIndex.sql')).toString()
    );
    await client.end();
    console.log('[.] Done.');
  } catch (e) {
    console.error(e);
  }
}

if (require.main === module) {
  main();
}
