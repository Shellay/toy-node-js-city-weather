const request = require('supertest');
const access = require('../../dbUtil/access');

const app = require('../../app');

describe('GET /cities/:id', () => {

  let client;

  const sampleCity = {
    "coord": {
      "lat": 55.683334,
      "lon": 37.666668
    },
    "country": "RU",
    "id": 519188,
    "name": "Novinki"
  };

  beforeAll(async () => {
    // might be better to use a separate client
    client = await app.pool.connect();
    await access.insertCity(client, sampleCity);
    await client.query('COMMIT');
  });

  afterAll(async () => {
    await client.query(`DELETE FROM city WHERE id = $1`, [sampleCity.id]);
    await client.query('COMMIT');
    // Don't forget to release the client!
    client.release();
  })

  test('Get one certain city', (done) => {
    request(app.server)
      .get(`/cities/${sampleCity.id}`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(sampleCity.name);
        expect(res.body.lat).toBeCloseTo(sampleCity.coord.lat);
        expect(res.body.lng).toBeCloseTo(sampleCity.coord.lon);
      })
      .end(done);
  });
});
