const { adaptWeatherJson } = require('./weatherApiResultAdapter');

/**
 * This test module also serves as a specification example of JSON adaptation.
 */

const sampleSource = {
  "base": "stations",
  "clouds": {
    "all": 0
  },
  "cod": 200,
  "coord": {
    "lat": 49.49,
    "lon": 8.46
  },
  "dt": 1563822544,
  "id": 2873891,
  "main": {
    "humidity": 36,
    "pressure": 1026,
    "temp": 29.72,
    "temp_max": 35,
    "temp_min": 26.67
  },
  "name": "Mannheim",
  "sys": {
    "country": "DE",
    "id": 1291,
    "message": 0.011,
    "sunrise": 1471939200,
    "sunset": 1471989600,
    "type": 1
  },
  "timezone": 7200,
  "visibility": 10000,
  "weather": [
    {
      "description": "clear sky",
      "icon": "01d",
      "id": 800,
      "main": "Clear"
    }
  ],
  "wind": {
    "deg": 60,
    "speed": 1.5
  }
};

const sampleTarget = {
  "type": "Clear",
  "type_description": "clear sky",
  "sunrise": "2016-08-23T08:00:00.000Z",
  "sunset": "2016-08-23T22:00:00.000Z",
  "temp": 29.72,
  "temp_min": 26.67,
  "temp_max": 35,
  "pressure": 1026,
  "humidity": 36,
  "clouds_percent": 0,
  "wind_speed": 1.5
};


describe('Test weather JSON adaptation', () => {

  test('Adapted result is compatible with sample structure and values', () => {
    const resultTarget = adaptWeatherJson(sampleSource);
    // For each sampleTarget entry, check it is correctly populated in resultTarget.
    for (const k in sampleTarget) {
      expect(resultTarget).toHaveProperty(k);
      if (resultTarget[k] instanceof Number) {
        expect(resultTarget[k]).toBeCloseTo(sampleTarget[k]);
      } else {
        expect(resultTarget[k]).toBe(sampleTarget[k]);
      }
    }
  });

});
