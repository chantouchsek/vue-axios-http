import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
      branches: 93.44,
      statements: 99.39,
    },
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
}

export default config
