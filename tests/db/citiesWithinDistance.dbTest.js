const pg = require('pg');
const dbConfig = require('../../config').test.db;
const access = require('../../dbUtil/access');

const EARTH_RADIUS_EQUATOR = 6378137.0;
const RAD_FOR_10KM = 10000.0 / EARTH_RADIUS_EQUATOR;
const DEGREE_FOR_10KM = RAD_FOR_10KM * 180 / Math.PI

describe('Test DB queries', () => {

  let client;

  // use a fake city lying on equator, as the extreme case
  // and the simple case
  const fakeCity = {
    "coord": {
      "lat": 0,
      "lon": 0,
    },
    "country": "Mars",
    "id": 1,
    "name": "FakeCity"
  };

  beforeAll(async () => {
    client = new pg.Pool(dbConfig);
    await client.query(`BEGIN`);
    await client.query(`SET search_path TO city;`);
    await access.insertCity(client, fakeCity);
  });

  afterAll(async () => {
    await client.query(`ROLLBACK`);
    await client.end();
  });

  test('select one city within 10Km latitude-wise', async () => {
    const rs = await access.selectCityAroundCoord(
      client,
      // construct a coord within 10Km from city1
      fakeCity.coord.lat + DEGREE_FOR_10KM * 0.9,
      fakeCity.coord.lon,
      10000,
    );
    expect(rs).toHaveLength(1);
    expect(rs[0].id).toBe(fakeCity.id);
  });

  test('select no city within 10Km latitude-wise', async () => {
    const rs = await access.selectCityAroundCoord(
      client,
      // construct a coord within 10Km from city1
      fakeCity.coord.lat + DEGREE_FOR_10KM * 1.1,
      fakeCity.coord.lon,
      10000,
    );
    expect(rs).toHaveLength(0);
  });

  test('select one city within 10Km latitude-wise', async () => {
    const rs = await access.selectCityAroundCoord(
      client,
      fakeCity.coord.lat,
      fakeCity.coord.lon + DEGREE_FOR_10KM * 0.9,
      10000,
    );
    expect(rs).toHaveLength(1);
    expect(rs[0].id).toBe(fakeCity.id);
  });

  test('select no city within 10Km longitude-wise', async () => {
    const rs = await access.selectCityAroundCoord(
      client,
      fakeCity.coord.lat,
      fakeCity.coord.lon + DEGREE_FOR_10KM * 1.1,
      10000,
    );
    expect(rs).toHaveLength(0);
  });

  test(`select more than one cities around query point`, async () => {
    const anotherFakeCity = {
      "coord": {
        "lat": 2 * DEGREE_FOR_10KM * 0.9,
        "lon": 0,
      },
      "country": "Jupiter",
      "id": 2,
      "name": "AnotherFakeCity"
    }
    await access.insertCity(client, anotherFakeCity);
    const rs = await access.selectCityAroundCoord(
      client,
      0 + DEGREE_FOR_10KM * 0.9,
      0,
      10000
    );
    await access.deleteCityWithId(client, anotherFakeCity.id);
    expect(rs).toHaveLength(2);
  });

});
