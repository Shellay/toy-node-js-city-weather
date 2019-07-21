const fs = require('fs');
const path = require('path');
const pg = require('pg');

// consider using DB migration tool
const dataModelPath = path.join(__dirname, '..', 'dbModel')

const sqlContext = fs.readFileSync(
  path.join(dataModelPath, 'context.sql')
).toString(); 

const sqlModel = fs.readFileSync(
  path.join(dataModelPath, 'city.sql')
).toString(); 

async function prepareDbModel(conn, commit = false) {
  await conn.query(sqlContext);
  await conn.query(sqlModel);
  if (commit) {
    await conn.query('COMMIT');
  }
}

module.exports = {
  prepareDbModel
}

if (require.main === module) {
  // for now only allow script mode in dev/test environment
  const nodeEnv = process.env.NODE_ENV;
  if (['dev', 'test'].includes(nodeEnv)) {
    const dbConfig = require('../config')[nodeEnv].db;
    // note: entry dbConfig.schema should not be accessed here
    const client = new pg.Client(dbConfig);
    client.connect().then(() => {
      return prepareDbModel(client, true);
    }).then(() => {
      client.end();
      console.log('[.] Done.');
    });
  } else {
    throw new Error('Not in dev/test environment');
  }
}
