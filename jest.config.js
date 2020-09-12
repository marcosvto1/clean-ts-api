// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  roots: ['<rootDir>/src'],
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // A map from regular expressions to paths to transformers
  transform: {
    '.+\\.ts$': 'ts-jest'
  },

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8'

}
