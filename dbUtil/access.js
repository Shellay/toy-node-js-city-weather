const pg = require('pg');  // eslint-disable-line no-unused-vars

/**
 * 
 * @param {pg.Client} conn 
 * @param {object} cityObj 
 */
async function insertCity(conn, cityObj) {
  await conn.query(`
  INSERT INTO city
  (id, name, country, coord)
  VALUES
  ($1, $2, $3, $4)
  `, [
    cityObj.id,
    cityObj.name,
    cityObj.country,
    `SRID=4326;POINT(${cityObj.coord.lon} ${cityObj.coord.lat})`
  ]);
}

async function selectCityWithId(conn, id) {
  const rs = await conn.query(`
  SELECT id, name, country,
    ST_Y(coord::GEOMETRY) AS lat,
    ST_X(coord::GEOMETRY) AS lon
  FROM city
  WHERE id = $1
  `, [id]);
  return rs.rows.length === 0
    ? null
    : rs.rows[0];
}

async function deleteCityWithId(conn, id) {
  await conn.query(`
  DELETE FROM city WHERE id = $1
  `, [id]);
}

async function selectCityAroundCoord(conn, lat, lon, dist = 10000) {
  // page results?
  const rs = await conn.query(`
  SELECT id, name, country,
    ST_Y(coord::GEOMETRY) AS lat,
    ST_X(coord::GEOMETRY) AS lon
  FROM city
  WHERE
    ST_DWithin(coord::GEOGRAPHY, ST_GeogFromText($1), $2)
  `, [
    `SRID=4326;POINT(${lon} ${lat})`,
    dist
  ]);
  return rs.rows;
}

module.exports = {
  insertCity,
  selectCityWithId,
  deleteCityWithId,
  selectCityAroundCoord,
}
