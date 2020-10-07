'use strict'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      // branches: 100,
      // functions: 100,
      // lines: 100,
      // statements: 100,
      branches: 65,
      functions: 70,
      lines: 50,
      statements: 50,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
}
