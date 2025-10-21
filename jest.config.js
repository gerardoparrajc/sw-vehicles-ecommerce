module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: [
    '**/basic.spec.ts',
    '**/cart-pure-logic.spec.ts',
    '**/*-pure.spec.ts',
    '**/*-logic.spec.ts',
    '!**/node_modules/**',
    '!src/app/**/*.spec.ts' // Excluir tests de Angular por ahora
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/*.module.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.spec.json'
    }],
    '^.+\\.html$': 'jest-transform-stub',
    '^.+\\.svg$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(rxjs|@angular|zone\\.js|tslib)/)'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testTimeout: 10000
};
