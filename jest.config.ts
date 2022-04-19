import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 93,
      statements: 99,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
}

export default config
