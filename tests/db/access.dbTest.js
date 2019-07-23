const pg = require('pg');
const dbConfig = require('../../config').test.db;
const access = require('../../dbUtil/access');

describe('Test DB queries', () => {

  let client;

  beforeAll(async () => {
    client = new pg.Pool(dbConfig);
    await client.query(`BEGIN`);
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
