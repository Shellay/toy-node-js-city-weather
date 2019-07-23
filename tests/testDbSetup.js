const { execSync } = require('child_process');
const pg = require('pg');
const { prepareDbModel } = require('../dbModel/prepareDbModel');
const dbConfig = require('../config').test.db;

module.exports = async () => {
  console.log('[*] Setting up postgres docker for testing...')
  execSync('docker-compose up -d');
  let tries = 0;
  let error;
  let client;
  do {
    client = new pg.Client(dbConfig);
    try {
      console.log(`[*] Waiting for postgres server to be ready (${tries}'th try)...`)
      await client.connect();
      await client.query('select 1');
      break;
    } catch(e) {
      error = e;
      tries += 1;
      execSync('sleep 1')
    }
  } while(tries < 10);

  if (tries === 10) {
    execSync('docker-compose down');
    console.log(error);
    throw Error('[!] Failed to setup postgres for testing.');
  } else {
    console.log('[*] Preparing data model...');
    await prepareDbModel(client, true);
    await client.end();
  }
}
