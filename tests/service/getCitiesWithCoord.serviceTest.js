const request = require('supertest');
const access = require('../../dbUtil/access');

const app = require('../../app');

const DEGREE_FOR_10KM = 0.08983152841195216;

describe('GET /cities?lat=&lng=', () => {

  let client;

  const srcCity1 = {
    "coord": {
      "lat": 0,
      "lon": 0,
    },
    "country": "Country1",
    "id": 1,
    "name": "City1"
  };

  const srcCity2 = {
    "coord": {
      "lat": DEGREE_FOR_10KM * 1.1,
      "lon": 0,
    },
    "country": "Country2",
    "id": 2,
    "name": "City2"
  };

  beforeAll(async () => {
    client = await app.pool.connect();
    await access.insertCity(client, srcCity1);
    await access.insertCity(client, srcCity2);
    await client.query('COMMIT');
  });

  afterAll(async () => {
    await access.deleteCityWithId(srcCity1.id);
    await access.deleteCityWithId(srcCity2.id);
    await client.query('COMMIT');
    await client.release();
  })

  test('Test get zero city within latitude range', (done) => {
    request(app.server)
      .get(`/cities?lat=${-DEGREE_FOR_10KM * 1.1}&lng=0`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(0);
      })
      .end(done);
  });

  test('Test get one city within latitude range', (done) => {
    request(app.server)
      .get(`/cities?lat=0&lng=0`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].name).toBe(srcCity1.name);
      })
      .end(done);
  });

  test('Test get two cities within latitude range', (done) => {
    request(app.server)
      .get(`/cities?lat=${DEGREE_FOR_10KM * 0.5}&lng=0`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      })
      .end(done);
  });
});
