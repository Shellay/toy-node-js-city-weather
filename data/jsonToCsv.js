const StreamArray = require('stream-json/streamers/StreamArray');

const pipeline = process.stdin
  .pipe(StreamArray.withParser())
;

pipeline.on('data', data => {
  const { id, name, country, coord } = data.value;
  const pointStr = `SRID=4326;POINT(${coord.lon} ${coord.lat})`
  // using tab as separator is safer than using comma, since some field values can contain commas themselves
  const csvLine =
    `${id}\t${name}\t${country}\t${pointStr}\n`;
  process.stdout.write(csvLine);
})
