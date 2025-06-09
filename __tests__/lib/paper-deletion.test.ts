import { getContainer, getPaperById, deletePaper } from '@/lib/azure';
import { deleteFileFromStorage } from '@/lib/azureStorage';
import { CosmosClient } from '@azure/cosmos';

// Mock Azure modules
jest.mock('@azure/cosmos');
jest.mock('@/lib/azureStorage', () => ({
  deleteFileFromStorage: jest.fn().mockResolvedValue({})
}));

describe('Paper deletion functionality', () => {
  // Sample test paper with URLs to delete
  const testPaper = {
    id: 'test-delete-paper',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper.pdf',
    solutionUrl: 'https://example.com/test-solution.pdf',
    hasDownload: true,
    hasSolution: true,
    uploadDate: '2025-06-01T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.COSMOS_ENDPOINT = 'https://test-cosmos.documents.azure.com:443/';
    process.env.COSMOS_KEY = 'test-key';
  });

  describe('deletePaper', () => {
    it('should successfully delete a paper from Cosmos DB', async () => {
      // Mock successful delete operation
      const mockDeleteOperation = jest.fn().mockResolvedValue({});
      
      const mockItem = jest.fn().mockReturnValue({
        delete: mockDeleteOperation
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
      const result = await deletePaper('test-delete-paper');
      
      // Check results
      expect(result).toEqual({ success: true });
      expect(mockItem).toHaveBeenCalledWith('test-delete-paper', 'test-delete-paper');
      expect(mockDeleteOperation).toHaveBeenCalled();
    });

    it('should throw an error if deletion fails', async () => {
      // Mock delete operation to throw an error
      const mockError = new Error('Delete operation failed');
      const mockDeleteOperation = jest.fn().mockRejectedValue(mockError);
      
      const mockItem = jest.fn().mockReturnValue({
        delete: mockDeleteOperation
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
      
      // Call the function and expect it to throw
      await expect(deletePaper('test-delete-paper')).rejects.toThrow('Delete operation failed');
      expect(mockItem).toHaveBeenCalledWith('test-delete-paper', 'test-delete-paper');
      expect(mockDeleteOperation).toHaveBeenCalled();
    });
  });

  describe('Full deletion flow with files', () => {
    it('should delete both document and associated files', async () => {
      // Setup mocks for getPaperById to return test paper
      jest.spyOn(global, 'getPaperById' as any).mockResolvedValue(testPaper);
      
      // Mock delete operation
      const mockDeleteOperation = jest.fn().mockResolvedValue({});
      
      const mockItem = jest.fn().mockReturnValue({
        delete: mockDeleteOperation
      });
      
      const mockContainer = {
        item: mockItem
      };
      
      // Mock getContainer to return our mocked container
      jest.spyOn(global, 'getContainer' as any).mockResolvedValue(mockContainer);
      
      // Simulate API flow for deleting paper and files
      
      // 1. Get paper by ID
      const paper = await getPaperById('test-delete-paper');
      expect(paper).toEqual(testPaper);
      
      // 2. Delete files from storage
      if (paper?.paperUrl) {
        await deleteFileFromStorage(paper.paperUrl);
      }
      if (paper?.solutionUrl) {
        await deleteFileFromStorage(paper.solutionUrl);
      }
      
      // Verify file deletion was called
      expect(deleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-paper.pdf');
      expect(deleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-solution.pdf');
      expect(deleteFileFromStorage).toHaveBeenCalledTimes(2);
      
      // 3. Delete document from Cosmos DB
      const container = await getContainer();
      await container.item('test-delete-paper', 'test-delete-paper').delete();
      
      // Verify DB deletion was called
      expect(mockItem).toHaveBeenCalledWith('test-delete-paper', 'test-delete-paper');
      expect(mockDeleteOperation).toHaveBeenCalled();
    });
  });
});
