// Test setup for Azure mocks
export const createMockCosmosContainer = () => {
  const mockRead = jest.fn();
  const mockDelete = jest.fn();
  const mockItem = jest.fn(() => ({
    read: mockRead,
    delete: mockDelete,
  }));
  
  const mockFetchAll = jest.fn();
  const mockQuery = jest.fn(() => ({
    fetchAll: mockFetchAll,
  }));
  
  const mockContainer = {
    item: mockItem,
    items: {
      query: mockQuery,
    },
  };
  
  return {
    mockContainer,
    mockItem,
    mockRead,
    mockDelete,
    mockQuery,
    mockFetchAll,
  };
};

export const createMockStorageClient = () => {
  const mockDeleteBlob = jest.fn();
  
  const mockBlobServiceClient = {
    getContainerClient: jest.fn(() => ({
      deleteBlob: mockDeleteBlob,
    })),
  };
  
  return {
    mockBlobServiceClient,
    mockDeleteBlob,
  };
};

// Mock functions for Azure library
export const createAzureMocks = () => {
  const cosmos = createMockCosmosContainer();
  const storage = createMockStorageClient();
  
  return {
    ...cosmos,
    ...storage,
    // Mock functions that can be used in tests
    mockGetPaperById: jest.fn(),
    mockDeletePaper: jest.fn(),
    mockDeleteFileFromStorage: jest.fn(),
  };
};
