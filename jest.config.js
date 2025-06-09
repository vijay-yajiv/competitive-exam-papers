// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Tells Next.js where the root directory is
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        compilerOptions: {
          module: 'CommonJS',
        },
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  // Mock directory configuration
  moduleDirectories: ['node_modules', __dirname],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Reset mocks between tests
  resetMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/__tests__'
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);
