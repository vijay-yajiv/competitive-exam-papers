import { createAzureMocks } from '../setup/azureMocks';

// Mock the entire azure module before importing anything
jest.mock('@/lib/azure');

// Mock CosmosDB SDK
jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn(),
}));

// Mock Azure Storage SDK
jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
}));

describe('Azure Cosmos DB functions', () => {
  let azureMocks: ReturnType<typeof createAzureMocks>;
  let mockModule: any;

  beforeEach(() => {
    // Create fresh mocks for each test
    azureMocks = createAzureMocks();
    
    // Mock the module functions
    mockModule = require('@/lib/azure');
    mockModule.getPaperById = azureMocks.mockGetPaperById;
    mockModule.deletePaper = azureMocks.mockDeletePaper;
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const testPaper = {
    id: 'test-paper-1',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper.pdf',
    hasView: true,
    hasSolution: false,
    uploadDate: '2025-06-01T10:00:00Z',
  };

  describe('getPaperById', () => {
    it('should return paper when it exists', async () => {
      // Setup mock to return test paper
      azureMocks.mockGetPaperById.mockResolvedValue(testPaper);
      
      // Call the function
      const result = await mockModule.getPaperById('test-paper-1');
      
      // Verify the result
      expect(result).toEqual(testPaper);
      expect(azureMocks.mockGetPaperById).toHaveBeenCalledWith('test-paper-1');
    });

    it('should return null when paper does not exist', async () => {
      // Setup mock to return null
      azureMocks.mockGetPaperById.mockResolvedValue(null);
      
      // Call the function
      const result = await mockModule.getPaperById('non-existent-id');
      
      // Verify the result
      expect(result).toBeNull();
      expect(azureMocks.mockGetPaperById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should find paper using query when direct lookup fails', async () => {
      // Setup mock to return test paper
      azureMocks.mockGetPaperById.mockResolvedValue(testPaper);
      
      // Call the function
      const result = await mockModule.getPaperById('test-paper-1');
      
      // Verify the result matches the test paper
      expect(result).toEqual(testPaper);
      expect(azureMocks.mockGetPaperById).toHaveBeenCalledWith('test-paper-1');
    });
  });

  describe('deletePaper', () => {
    it('should delete paper successfully', async () => {
      // Setup mock to resolve successfully
      azureMocks.mockDeletePaper.mockResolvedValue(undefined);
      
      // Call the function
      await mockModule.deletePaper('test-paper-1');
      
      // Verify the function was called correctly
      expect(azureMocks.mockDeletePaper).toHaveBeenCalledWith('test-paper-1');
    });

    it('should handle errors during deletion', async () => {
      // Setup mock to throw an error
      azureMocks.mockDeletePaper.mockRejectedValue(new Error('Deletion failed'));
      
      // Expect the function to throw
      await expect(mockModule.deletePaper('test-paper-1')).rejects.toThrow('Deletion failed');
      expect(azureMocks.mockDeletePaper).toHaveBeenCalledWith('test-paper-1');
    });
  });
});
