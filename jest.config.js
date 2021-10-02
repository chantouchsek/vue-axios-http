'use strict'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 91.25,
      statements: 99.68,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
}
