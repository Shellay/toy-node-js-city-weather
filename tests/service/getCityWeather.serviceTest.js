const request = require('supertest');
const access = require('../../dbUtil/access');

const app = require('../../app');

describe('GET /cities/:id/weather', () => {

  test('Test get one weather for certain city', (done) => {
    request(app.server)
      .get(`/cities/1851632/weather`)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('weather');
      })
      .end(done);
  });

});
