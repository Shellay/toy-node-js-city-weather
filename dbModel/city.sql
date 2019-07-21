CREATE TABLE city (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  country VARCHAR(128),
  coord GEOGRAPHY(POINT, 4326) NOT NULL
);

/*
NOTE: Index should be properly created for fast spatial queries
  and needs to be verified via checking execution plan.
(example src: https://gis.stackexchange.com/questions/198789/st-dwithin-why-does-query-not-use-the-spatial-index)
*/
CREATE INDEX gist_city_coord ON city USING GIST( (coord::GEOGRAPHY) );

/*
With the index above, execution plan should tell usage of Bitmap Index Scan
on gist_city_coord.
*/
