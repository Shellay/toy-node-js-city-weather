/**
 * The reason to implement an adapter instead of directly integating into SQL level
 * value retrieval is that we want the SQL model to stay closest to the imported
 * JSON source data.
 */

/**
 * 
 * @param {src} src JSON object returned by selectCityWithId
 */
function adaptDbReturnedJsonForCityId(src) {
  return {
    id: src.id,
    name: src.name,
    lat: src.lat,
    lng: src.lon,
  }
}

/**
 * 
 * @param {row} row JSON object as one element in array returned by
 *   selectCityAroundCoord 
 */
function adaptDbReturnedJsonForCityCoordQuery(row) {
  return {
    id: row.id,
    name: row.name
  };
}

module.exports = {
  adaptDbReturnedJsonForCityId,
  adaptDbReturnedJsonForCityCoordQuery,
}
