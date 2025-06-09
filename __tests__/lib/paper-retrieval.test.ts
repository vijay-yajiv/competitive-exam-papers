import { getPaperById } from '@/lib/azure';
import { CosmosClient } from '@azure/cosmos';

// Mock Azure Cosmos DB
jest.mock('@azure/cosmos');

describe('Paper retrieval functionality', () => {
  // Sample test paper
  const testPaper = {
    id: 'test-paper-id',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper.pdf',
    hasDownload: true,
    hasSolution: false,
    uploadDate: '2025-06-01T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.COSMOS_ENDPOINT = 'https://test-cosmos.documents.azure.com:443/';
    process.env.COSMOS_KEY = 'test-key';
  });

  describe('getPaperById', () => {
    it('should return paper when found with direct ID lookup', async () => {
      // Mock implementation of Cosmos DB read operation
      const mockReadOperation = jest.fn().mockResolvedValue({
        resource: testPaper
      });
      
      const mockItem = jest.fn().mockReturnValue({
        read: mockReadOperation
      });
      
      const mockContainer = {
        item: mockItem
      };
      
      const mockCreateIfNotExists = jest.fn().mockResolvedValue({
        container: mockContainer
      });
      
      const mockContainers = {
        createIfNotExists: mockCreateIfNotExists
      };
      
      const mockDatabase = {
        containers: mockContainers
      };
      
      const mockDatabasesCreateIfNotExists = jest.fn().mockResolvedValue({
        database: mockDatabase
      });
      
      const mockDatabases = {
        createIfNotExists: mockDatabasesCreateIfNotExists
      };
      
      // Mock CosmosClient constructor
      (CosmosClient as jest.Mock).mockImplementation(() => ({
        databases: mockDatabases
      }));
      
      // Call the function
      const result = await getPaperById('test-paper-id');
      
      // Check results
      expect(result).toEqual(testPaper);
      expect(mockItem).toHaveBeenCalledWith('test-paper-id', 'test-paper-id');
      expect(mockReadOperation).toHaveBeenCalled();
    });

    it('should try query fallback if direct ID lookup fails', async () => {
      // Mock error for direct lookup
      const mockError = new Error('Entity with the specified id does not exist in the system');
      const mockReadOperation = jest.fn().mockRejectedValue(mockError);
      
      // Mock query operation to find the paper
      const mockFetchAll = jest.fn().mockResolvedValue({
        resources: [testPaper]
      });
      
      const mockQuery = jest.fn().mockReturnValue({
        fetchAll: mockFetchAll
      });
      
      const mockItem = jest.fn().mockReturnValue({
        read: mockReadOperation
      });
      
      const mockItems = {
        query: mockQuery
      };
      
      const mockContainer = {
        item: mockItem,
        items: mockItems
      };
      
      const mockCreateIfNotExists = jest.fn().mockResolvedValue({
        container: mockContainer
      });
      
      const mockContainers = {
        createIfNotExists: mockCreateIfNotExists
      };
      
      const mockDatabase = {
        containers: mockContainers
      };
      
      const mockDatabasesCreateIfNotExists = jest.fn().mockResolvedValue({
        database: mockDatabase
      });
      
      const mockDatabases = {
        createIfNotExists: mockDatabasesCreateIfNotExists
      };
      
      // Mock CosmosClient constructor
      (CosmosClient as jest.Mock).mockImplementation(() => ({
        databases: mockDatabases
      }));
      
      // Call the function
      const result = await getPaperById('test-paper-id');
      
      // Check results
      expect(result).toEqual(testPaper);
      expect(mockItem).toHaveBeenCalledWith('test-paper-id', 'test-paper-id');
      expect(mockReadOperation).toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledWith({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [
          { name: "@id", value: "test-paper-id" }
        ]
      });
      expect(mockFetchAll).toHaveBeenCalled();
    });

    it('should return null if paper is not found in any way', async () => {
      // Mock error for direct lookup
      const mockError = new Error('Entity with the specified id does not exist in the system');
      const mockReadOperation = jest.fn().mockRejectedValue(mockError);
      
      // Mock empty query result
      const mockFetchAll = jest.fn().mockResolvedValue({
        resources: []
      });
      
      const mockQuery = jest.fn().mockReturnValue({
        fetchAll: mockFetchAll
      });
      
      const mockItem = jest.fn().mockReturnValue({
        read: mockReadOperation
      });
      
      const mockItems = {
        query: mockQuery
      };
      
      const mockContainer = {
        item: mockItem,
        items: mockItems
      };
      
      const mockCreateIfNotExists = jest.fn().mockResolvedValue({
        container: mockContainer
      });
      
      const mockContainers = {
        createIfNotExists: mockCreateIfNotExists
      };
      
      const mockDatabase = {
        containers: mockContainers
      };
      
      const mockDatabasesCreateIfNotExists = jest.fn().mockResolvedValue({
        database: mockDatabase
      });
      
      const mockDatabases = {
        createIfNotExists: mockDatabasesCreateIfNotExists
      };
      
      // Mock CosmosClient constructor
      (CosmosClient as jest.Mock).mockImplementation(() => ({
        databases: mockDatabases
      }));
      
      // Call the function
      const result = await getPaperById('non-existent-paper-id');
      
      // Check results
      expect(result).toBeNull();
      expect(mockQuery).toHaveBeenCalled();
      expect(mockFetchAll).toHaveBeenCalled();
    });
  });
});
