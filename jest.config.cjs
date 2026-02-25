/**
 * Jest configuration for running TypeScript tests with ts-jest.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.spec.tsx',
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.tsx'
  ],
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/']
};
