const request = require('supertest');

const app = require('../../app');

describe('GET /cities/:id/weather', () => {

  test('Test get one weather for Mannheim (2873891)', (done) => {
    request(app.server)
      .get(`/cities/2873891/weather`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('weather');
        expect(res.body.name).toBe('Mannheim');
        expect(res.body.weather).toBeInstanceOf(Array);
      })
      .end(done);
  });

});
