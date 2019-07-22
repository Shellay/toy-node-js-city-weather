const {
  adaptDbReturnedJsonForCityId,
  adaptDbReturnedJsonForCityCoordQuery,
 } = require('./dbCityJsonAdapter');

const sampleCityForIdFromDb = {
  "id": 2873891,
  "name": "Mannheim",
  "country": "DE",
  "lon": 8.46472,
  "lat": 49.488331
};

const targetCityForId = {
  "id": 2873891,
  "name": "Mannheim",
  "lat": 49.488331,
  "lng": 8.46472
};

const sampleCityForCoordQueryFromDb = {
  "id": 2873891,
  "name": "Mannheim",
  "country": "DE",
  "lon": 8.46472,
  "lat": 49.488331
};

const targetCityForCoordQuery = {
  "id": 2873891,
  "name": "Mannheim",
};

describe('Test adaptation from DB source to REST response usage', () => {

  test(`Test adaptation for city ID query`, () => {
    const result = adaptDbReturnedJsonForCityId(sampleCityForIdFromDb);
    for (const k in targetCityForId) {
      if (k instanceof Number) {
        expect(result[k]).toBeCloseTo(targetCityForId[k]);
      } else {
        expect(result[k]).toBe(targetCityForId[k]);
      }
    }
  });

  test(`Test adaptation for city coord query`, () => {
    const result = adaptDbReturnedJsonForCityCoordQuery(sampleCityForCoordQueryFromDb);
    expect(result).toMatchObject(targetCityForCoordQuery);
  });

});