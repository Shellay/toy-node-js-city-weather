const pg = require('pg');
const dbConfig = require('./testDbConfig.json');
const fs = require('fs');
const path = require('path');
const access = require('../../dbUtil/access');

// consider using DB migration tool
const sqlContext = fs.readFileSync(
  path.join(__dirname, '..', '..', 'dbModel', 'context.sql')
).toString(); 

const sqlModel = fs.readFileSync(
  path.join(__dirname, '..', '..', 'dbModel', 'city.sql')
).toString(); 

describe('Test DB queries', () => {

  let client;

  beforeAll(async () => {
    client = new pg.Pool(dbConfig);
    await client.query(`BEGIN`);
    // await client.query(`CREATE SCHEMA city;`);
    // await client.query(`CREATE EXTENSION postgis WITH SCHEMA city;`);
    await client.query(sqlContext);
    await client.query(sqlModel);
    await client.query(`SET search_path TO city;`);
  });

  afterAll(async () => {
    await client.query(`ROLLBACK`);
    await client.end();
  });

  test('Dummy select.', async () => {
    expect(dbConfig.host).toBe('localhost');
    const resultSet = await client.query(`
      select 1 as value;
    `);
    expect(resultSet.rows[0].value).toBe(1);
  });

  test('Insert and select city 1.', async () => {

    const city1 = {
      "coord": {
        "lat": 44.549999,
        "lon": 34.283333
      },
      "country": "UA",
      "id": 707860,
      "name": "Hurzuf"
    };

    await access.insertCity(client, city1);
    const c = await access.selectCityWithId(client, city1.id);
    expect(c.name).toBe(city1.name);
  });

});
