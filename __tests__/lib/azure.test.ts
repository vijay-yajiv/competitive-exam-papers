// __tests__/lib/azure.test.ts
import { CosmosClient } from "@azure/cosmos";
import { getPaperById, getAllPapers, deletePaper, getPapersByExamTypeAndYear } from '@/lib/azure';

// Mock Azure Cosmos SDK
jest.mock('@azure/cosmos');

describe('Azure Cosmos DB functions', () => {
  // Sample test paper
  const testPaper = {
    id: 'test-paper-1',
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
    
    // Mock process.env for Azure configuration
    process.env.COSMOS_ENDPOINT = 'https://test-cosmos.documents.azure.com:443/';
    process.env.COSMOS_KEY = 'test-key';
  });

  describe('getPaperById', () => {
    it('should return paper when it exists', async () => {
      // Mock read operation to return a paper
      const mockRead = jest.fn().mockResolvedValueOnce({ resource: testPaper });
      const mockItem = jest.fn().mockReturnValue({ read: mockRead });
      const mockContainer = { item: mockItem };
      const mockContainers = { createIfNotExists: jest.fn().mockResolvedValueOnce({ container: mockContainer }) };
      const mockDatabase = { containers: mockContainers };
      const mockDatabases = { createIfNotExists: jest.fn().mockResolvedValueOnce({ database: mockDatabase }) };
      
      // Set up CosmosClient mock
      (CosmosClient as jest.Mock).mockImplementation(() => {
        return { databases: mockDatabases };
      });
      
      // Call the function
      const result = await getPaperById('test-paper-1');
      
      // Verify the result
      expect(result).toEqual(testPaper);
      
      // Verify the correct item is queried
      expect(mockItem).toHaveBeenCalledWith('test-paper-1', 'test-paper-1');
      expect(mockRead).toHaveBeenCalled();
    });

    it('should return null when paper does not exist', async () => {
      // Mock read operation to throw a "not found" error
      const mockError = new Error('Entity with the specified id does not exist in the system');
      const mockRead = jest.fn().mockRejectedValueOnce(mockError);
      const mockItem = jest.fn().mockReturnValue({ read: mockRead });
      const mockQuery = jest.fn().mockReturnValue({
        fetchAll: jest.fn().mockResolvedValueOnce({ resources: [] })
      });
      const mockContainer = { 
        item: mockItem,
        items: { query: mockQuery }
      };
      const mockContainers = { createIfNotExists: jest.fn().mockResolvedValueOnce({ container: mockContainer }) };
      const mockDatabase = { containers: mockContainers };
      const mockDatabases = { createIfNotExists: jest.fn().mockResolvedValueOnce({ database: mockDatabase }) };
      
      // Set up CosmosClient mock
      (CosmosClient as jest.Mock).mockImplementation(() => {
        return { databases: mockDatabases };
      });
      
      // Call the function
      const result = await getPaperById('non-existent-id');
      
      // Verify the result is null
      expect(result).toBeNull();
      
      // Verify the correct item is queried
      expect(mockItem).toHaveBeenCalledWith('non-existent-id', 'non-existent-id');
      expect(mockRead).toHaveBeenCalled();
      
      // Verify the query fallback was attempted
      expect(mockQuery).toHaveBeenCalledWith({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [
          { name: "@id", value: "non-existent-id" }
        ]
      });
    });

    it('should find paper using query when direct lookup fails', async () => {
      // Mock read operation to throw a "not found" error
      const mockError = new Error('Entity with the specified id does not exist in the system');
      const mockRead = jest.fn().mockRejectedValueOnce(mockError);
      const mockItem = jest.fn().mockReturnValue({ read: mockRead });
      
      // Mock query to return the paper (simulating different partition key)
      const mockQuery = jest.fn().mockReturnValue({
        fetchAll: jest.fn().mockResolvedValueOnce({ resources: [testPaper] })
      });
      
      const mockContainer = { 
        item: mockItem,
        items: { query: mockQuery }
      };
      const mockContainers = { createIfNotExists: jest.fn().mockResolvedValueOnce({ container: mockContainer }) };
      const mockDatabase = { containers: mockContainers };
      const mockDatabases = { createIfNotExists: jest.fn().mockResolvedValueOnce({ database: mockDatabase }) };
      
      // Set up CosmosClient mock
      (CosmosClient as jest.Mock).mockImplementation(() => {
        return { databases: mockDatabases };
      });
      
      // Call the function
      const result = await getPaperById('test-paper-1');
      
      // Verify the result matches the test paper
      expect(result).toEqual(testPaper);
      
      // Verify the query fallback was attempted
      expect(mockQuery).toHaveBeenCalledWith({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [
          { name: "@id", value: "test-paper-1" }
        ]
      });
    });
  });

  describe('deletePaper', () => {
    it('should delete paper successfully', async () => {
      // Mock delete operation
      const mockDelete = jest.fn().mockResolvedValueOnce({});
      const mockItem = jest.fn().mockReturnValue({ delete: mockDelete });
      const mockContainer = { item: mockItem };
      const mockContainers = { createIfNotExists: jest.fn().mockResolvedValueOnce({ container: mockContainer }) };
      const mockDatabase = { containers: mockContainers };
      const mockDatabases = { createIfNotExists: jest.fn().mockResolvedValueOnce({ database: mockDatabase }) };
      
      // Set up CosmosClient mock
      (CosmosClient as jest.Mock).mockImplementation(() => {
        return { databases: mockDatabases };
      });
      
      // Call the function
      const result = await deletePaper('test-paper-1');
      
      // Verify the result
      expect(result).toEqual({ success: true });
      
      // Verify the correct item is deleted
      expect(mockItem).toHaveBeenCalledWith('test-paper-1', 'test-paper-1');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
      // Mock delete operation to throw an error
      const mockError = new Error('Deletion failed');
      const mockDelete = jest.fn().mockRejectedValueOnce(mockError);
      const mockItem = jest.fn().mockReturnValue({ delete: mockDelete });
      const mockContainer = { item: mockItem };
      const mockContainers = { createIfNotExists: jest.fn().mockResolvedValueOnce({ container: mockContainer }) };
      const mockDatabase = { containers: mockContainers };
      const mockDatabases = { createIfNotExists: jest.fn().mockResolvedValueOnce({ database: mockDatabase }) };
      
      // Set up CosmosClient mock
      (CosmosClient as jest.Mock).mockImplementation(() => {
        return { databases: mockDatabases };
      });
      
      // Expect the function to throw
      await expect(deletePaper('test-paper-1')).rejects.toThrow('Deletion failed');
      
      // Verify the delete was attempted
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
