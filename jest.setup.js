// jest.setup.js
// Optional: setup file for Jest
// Learn more: https://jestjs.io/docs/configuration#setupfilesafterenv-array

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.COSMOS_ENDPOINT = 'https://test-cosmos.documents.azure.com:443/';
process.env.COSMOS_KEY = 'test-cosmos-key';
process.env.COSMOS_DATABASE_NAME = 'test-database';
process.env.COSMOS_CONTAINER_NAME = 'test-container';
process.env.AZURE_STORAGE_ACCOUNT_NAME = 'test-storage';
process.env.AZURE_STORAGE_ACCOUNT_KEY = 'test-storage-key';
process.env.AZURE_STORAGE_CONTAINER_NAME = 'test-container';

// Mock global.fetch
global.fetch = jest.fn();

// Mock Next.js Response and Request
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    __esModule: true,
    ...originalModule,
    NextResponse: {
      json: jest.fn((body, init) => ({ 
        body, 
        init,
        headers: new Map()
      }))
    }
  };
});

// Suppress console logs during tests unless specifically testing them
const originalLog = console.log;
const originalError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});
