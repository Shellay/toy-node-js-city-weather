const { requestWeather, WeatherApiRequestError } = require('./weatherApi');

describe('Test requesting openweather API', () => {

  // NOTE: sample API always return the same result regardless of the passed ID value.
  //   The ample API connection information can vary in a long term. Ensure the URL
  //   is up-to-date if the tests fails.

  test('Successfully call requestWeather sample API on Cairns', async () => {
    const body = await requestWeather(
      'https://samples.openweathermap.org/data/2.5/',
      2172797,
      'b6907d289e10d714a6e88b30761fae22',
    );
    expect(body).toBeTruthy();
    expect(body.cod).toBe(200);
    expect(body).toHaveProperty('weather');
    expect(body.weather).toBeInstanceOf(Array);
  });

  test('Failing call to requestWeather to due invalid key', async () => {
    try {
      await requestWeather(
        'https://samples.openweathermap.org/data/2.5/',
        2172797,
        '',
      );
    } catch (e) {
      if (e instanceof WeatherApiRequestError) {
        expect(e.body.cod).toBe(401);
        expect(e.body).toHaveProperty('message');
        expect(e.body.message).toMatch(/Invalid API key/);
      }
    }
  });

});
