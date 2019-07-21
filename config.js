const config = {
  test: {  // used by jest
    db: {
      user: 'postgres',
      host: 'localhost',
      database: 'template1',
      password: 'postgres',
      port: 5432,
      schema: 'city',
    },
  },
  dev: {
    db: {
      user: 'postgres',
      host: 'localhost',
      database: 'template1',
      password: 'postgres',
      port: 5432,
      schema: 'city',
    },
  },
  prod: {
  },
}

module.exports = config;