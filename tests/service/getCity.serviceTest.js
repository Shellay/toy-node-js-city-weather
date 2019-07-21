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
    client = await app.pool.connect();
    // client = new pg.Client(app.config.db);
    // await client.connect();
    // await client.query('SET search_path TO city');
    await access.insertCity(client, sampleCity);
    await client.query('COMMIT');
  });

  afterAll(async () => {
    await client.query(`DELETE FROM city WHERE id = $1`, [sampleCity.id]);
    await client.query('COMMIT');
    await client.end();
    // Don't forget to close the pool since service has opened sth in it!
    app.pool.end();
  })

  test('Test get one certain city', (done) => {
    request(app.server)
      .get(`/cities/${sampleCity.id}`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(sampleCity.name);
      })
      .end(done);
  });
});
