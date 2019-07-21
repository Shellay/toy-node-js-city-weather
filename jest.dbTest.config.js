module.exports = {
  testRegex: '.+\\.(db)?[Tt]est\\.js',
  globalSetup: '<rootDir>tests/testDbSetup.js',
  globalTeardown: '<rootDir>tests/testDbTeardown.js',
}
