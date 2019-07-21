const { requestWeather } = require('./weatherApi');

describe('Test requesting openweather API', () => {

  test('Successfully call requestWeather on Moscow', async () => {
    const body = await requestWeather(
      'https://samples.openweathermap.org/data/2.5/',
      5202009,
      'b6907d289e10d714a6e88b30761fae22',
    );
    expect(body).toBeTruthy();
    expect(body).toHaveProperty('weather');
    expect(body.weather).toBeInstanceOf(Array);
  });

});