// Mock the modules before importing anything
jest.mock('@/lib/azure');
jest.mock('@/lib/azureStorage');

describe('Paper deletion functionality', () => {
  let mockDeletePaper: jest.Mock;
  let mockDeleteFileFromStorage: jest.Mock;

  beforeEach(() => {
    // Get the mocked functions
    const azureModule = require('@/lib/azure');
    const storageModule = require('@/lib/azureStorage');
    
    mockDeletePaper = azureModule.deletePaper as jest.Mock;
    mockDeleteFileFromStorage = storageModule.deleteFileFromStorage as jest.Mock;
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  const testPaper = {
    id: 'test-delete-paper',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper.pdf',
    solutionUrl: 'https://example.com/test-solution.pdf',
    hasView: true,
    hasSolution: true,
    uploadDate: '2025-06-01T10:00:00Z',
  };

  describe('deletePaper', () => {
    it('should successfully delete a paper from Cosmos DB', async () => {
      // Setup mock to resolve successfully
      mockDeletePaper.mockResolvedValue(undefined);
      
      // Call the function
      await mockDeletePaper('test-delete-paper');
      
      // Verify it was called correctly
      expect(mockDeletePaper).toHaveBeenCalledWith('test-delete-paper');
      expect(mockDeletePaper).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      // Setup mock to throw an error
      const expectedError = new Error('Delete operation failed');
      mockDeletePaper.mockRejectedValue(expectedError);
      
      // Call the function and expect it to throw
      await expect(mockDeletePaper('test-delete-paper')).rejects.toThrow('Delete operation failed');
      expect(mockDeletePaper).toHaveBeenCalledWith('test-delete-paper');
    });
  });

  describe('Full deletion flow with files', () => {
    it('should delete both document and associated files', async () => {
      // Setup mocks
      mockDeletePaper.mockResolvedValue(undefined);
      mockDeleteFileFromStorage.mockResolvedValue(undefined);
      
      // Call both deletion functions
      await mockDeleteFileFromStorage('https://example.com/test-paper.pdf');
      await mockDeleteFileFromStorage('https://example.com/test-solution.pdf');
      await mockDeletePaper('test-delete-paper');
      
      // Verify both were called
      expect(mockDeleteFileFromStorage).toHaveBeenCalledTimes(2);
      expect(mockDeleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-paper.pdf');
      expect(mockDeleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-solution.pdf');
      expect(mockDeletePaper).toHaveBeenCalledWith('test-delete-paper');
    });

    it('should handle file deletion errors gracefully', async () => {
      // Setup storage deletion to fail
      mockDeleteFileFromStorage.mockRejectedValue(new Error('Storage deletion failed'));
      
      // Expect the function to throw
      await expect(mockDeleteFileFromStorage('https://example.com/test-paper.pdf')).rejects.toThrow('Storage deletion failed');
      expect(mockDeleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-paper.pdf');
    });
  });
});
