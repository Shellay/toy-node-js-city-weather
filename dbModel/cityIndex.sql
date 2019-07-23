/*
NOTE: Index should be properly created for fast spatial queries
  and needs to be verified via checking execution plan.
(example src: https://gis.stackexchange.com/questions/198789/st-dwithin-why-does-query-not-use-the-spatial-index)
*/

/*
With the index, execution plan should tell usage of Bitmap Index Scan
on gist_city_coord. But we might want to create this index *after* data
have been imported.

Importing complete city.list.json can take 3m38s when using prepareDbModel.js.
Better solution is needed.
*/

CREATE INDEX gist_city_coord ON city USING GIST( (coord::GEOGRAPHY) );
