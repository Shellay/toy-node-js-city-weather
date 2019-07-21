const request = require('request');

/**
 * Get weather of city with city ID.
 *
 * Raw URL underlying:
 * https://samples.openweathermap.org/data/2.5/weather?id=5202009&appid=b6907d289e10d714a6e88b30761fae22 
 * @param {*} baseUrl 
 * @param {*} cityId 
 * @param {*} appId 
 */
function requestWeather(baseUrl, cityId, appId) {
  return new Promise((resolve, reject) => {
    request.get({
      url: baseUrl + 'weather',
      qs: {
        id: cityId,
        appid: appId
      },
      json: true
    }, (err, resp, body) => {
      if (err) {
        return reject(err);
      } else if (resp && resp.statusCode >= 400) {
        console.log(resp.statusCode);
        console.log(resp);
        return reject(resp.statusCode);
      } else {
        return resolve(body);
      }
    });
  });
}

module.exports = {
  requestWeather
}
