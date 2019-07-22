const request = require('request');
const restifyErrors = require('restify-errors');
const { adaptWeatherJson } = require('./weatherApiResultAdapter');

/**
 * Get weather of city with city ID.
 *
 * Raw URL underlying:
 * https://api.openweathermap.org/data/2.5/weather?id=5202009&appid=${??}
 * @param {string} baseUrl 
 * @param {int} cityId 
 * @param {string} appId 
 * @param {object} extraParams To be included in the request parameters. If without units=metric, the returned values
 *   will be based on imperial units.
 */
function requestWeather(baseUrl, cityId, appId, extraParams = { units: 'metric' }) {
  // NOTE: openweathermap API contains status code 4XX in response
  //   payload, instead of using HTTP status code.
  return new Promise((resolve, reject) => {
    request.get({
      url: baseUrl + 'weather',
      qs: {
        id: cityId,
        appid: appId,
        ...extraParams,
      },
      json: true,
    }, (err, resp, body) => {
      // NOTE: somehow the returned JSON body does not have a number type
      //   for entry body.cod - can be issue within the request lib.
      //   For now we have to parse it.
      body.error = parseInt(body.error);
      body.cod = parseInt(body.cod);
      if (err) {
        return reject(err);
      } else if (body.error === 404 || body.cod === 404) {
        return reject(new restifyErrors.NotFoundError('not found'));
      } else if (resp && resp.statusCode >= 400) {
        return reject(new restifyErrors.HttpError({
          restCode: resp.statusCode,
          statusCode: resp.statusCode,
        }, body.message));
      } else if (body.cod && body.cod >= 400) {
        return reject(new restifyErrors.HttpError({
          restCode: body.cod,
          statusCode: body.cod,
        }, body.message));
      } else {
        return resolve(adaptWeatherJson(body));
      }
    });
  });
}

module.exports = {
  requestWeather,
}
