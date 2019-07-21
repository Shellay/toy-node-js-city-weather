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
    `SRID=4326;POINT(${cityObj.coord.lat} ${cityObj.coord.lon})`
  ]);
}

async function selectCityWithId(conn, id) {
  const rs = await conn.query(`
  SELECT id, name, country,
    ST_X(coord::GEOMETRY) AS lat,
    ST_Y(coord::GEOMETRY) AS lon
  FROM city
  WHERE id = $1
  `, [id]);
  return rs.rows.length === 0
    ? null
    : rs.rows[0];
}

module.exports = {
  insertCity,
  selectCityWithId
}
