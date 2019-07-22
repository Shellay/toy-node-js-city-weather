const request = require('request');
const restifyErrors = require('restify-errors');

class WeatherApiRequestError extends Error {
  // example from:
  // https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216
  constructor(message, body, status) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.body = body;
    this.name = this.constructor.name;
    this.status = status || 500;
  }
}

/**
 * Get weather of city with city ID.
 *
 * Raw URL underlying:
 * https://api.openweathermap.org/data/2.5/weather?id=5202009&appid=${??}
 * @param {*} baseUrl 
 * @param {*} cityId 
 * @param {*} appId 
 */
function requestWeather(baseUrl, cityId, appId) {
  // NOTE: openweathermap API contains status code 4XX in response
  //   payload, instead of using HTTP status code.
  return new Promise((resolve, reject) => {
    request.get({
      url: baseUrl + 'weather',
      qs: {
        id: cityId,
        appid: appId
      },
      json: true,
    }, (err, resp, body) => {
      // FIXME: somehow the returned JSON body does not have a number type
      //   for entry body.cod - can be issue within the request lib.
      //   For now we have to parse it.
      body.cod = parseInt(body.cod);
      if (err) {
        return reject(err);
      } else if (body.cod === 404) {
        return reject(new restifyErrors.NotFoundError('not found'));
      } else if (resp.statusCode >= 400 || body.cod >= 400) {
        return reject(new restifyErrors.HttpError({
          restCode: resp.statusCode || body.cod,
          statusCode: resp.statusCode || body.cod,
        }));
      } else {
        return resolve(body);
      }
    });
  });
}

module.exports = {
  WeatherApiRequestError,
  requestWeather,
}
