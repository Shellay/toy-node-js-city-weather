/**
 * Convert openweathermap weather JSON to specified format of application
 *
 * @param {object} src JSON object returned by openweathermap API representing
 *   result of a weather query.
 * @returns {object} JSON object matching specified format/content
 */
function adaptWeatherJson(src) {
  return {
    // TODO: Can src.weather be empty or having >1 entries? What do they mean?
    type: src.weather[0].main,
    type_description: src.weather[0].description,
    sunrise: new Date(src.sys.sunrise * 1000).toISOString(),
    sunset: new Date(src.sys.sunset * 1000).toISOString(),
    ...src.main,
    clouds_percent: src.clouds.all,
    wind_speed: src.wind.speed,
  }
}

module.exports = {
  adaptWeatherJson
}