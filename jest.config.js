'use strict'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 89.44,
      statements: 99.36,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
}
