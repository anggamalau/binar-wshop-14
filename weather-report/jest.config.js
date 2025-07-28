module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/source'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'source/**/*.ts',
    '!source/**/*.d.ts',
  ],
};