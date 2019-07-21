module.exports = {
  testRegex: '.+\\.(db)?[Tt]est\\.js',
  globalSetup: '<rootDir>tests/db/testDbSetup.js',
  globalTeardown: '<rootDir>tests/db/testDbTeardown.js',
}
