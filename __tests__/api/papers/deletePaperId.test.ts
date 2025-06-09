// __tests__/api/papers/deletePaperId.test.ts
import { NextRequest } from 'next/server';
import { DELETE } from '@/app/api/papers/delete/[paperId]/route';
import { getPaperById, getContainer } from '@/lib/azure';
import { deleteFileFromStorage } from '@/lib/azureStorage';

// Mock the Azure lib
jest.mock('@/lib/azure');
jest.mock('@/lib/azureStorage');

describe('DELETE /api/papers/delete/[paperId]', () => {
  // Mock request object
  const mockRequest = {} as NextRequest;
  
  // Mock process.env
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Reset the environment before each test
    process.env = { ...originalEnv };
    process.env.DEVELOPMENT_MODE = 'false';
    
    // Reset global state used in development mode
    if ((global as any).devPapers) {
      delete (global as any).devPapers;
    }
  });
  
  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should return 400 if paperId is missing', async () => {
    // Mock params with no paperId
    const mockParams = Promise.resolve({});
    
    // @ts-ignore - TypeScript complains about the missing paperId but we're testing this case
    const response = await DELETE(mockRequest, { params: mockParams });
    
    expect(response.body.error).toBe('Paper ID is required');
    expect(response.init.status).toBe(400);
  });

  it('should delete paper in development mode', async () => {
    // Enable development mode
    process.env.DEVELOPMENT_MODE = 'true';
    
    // Test paper ID
    const devPaperId = 'dev-paper-delete';
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: devPaperId });
    
    // Call the route handler
    const response = await DELETE(mockRequest, { params: mockParams });
    
    // Verify neither getPaperById nor getContainer was called in dev mode
    expect(getPaperById).not.toHaveBeenCalled();
    expect(getContainer).not.toHaveBeenCalled();
    
    // Verify response is successful
    expect(response.body.message).toContain('development mode');
    expect(response.body.paperId).toBe(devPaperId);
  });

  it('should return 404 if paper does not exist', async () => {
    // Test paper ID
    const nonExistentPaperId = 'non-existent-paper';
    
    // Mock getPaperById to return null (paper not found)
    (getPaperById as jest.Mock).mockResolvedValueOnce(null);
    
    // Mock params with non-existent paperId
    const mockParams = Promise.resolve({ paperId: nonExistentPaperId });
    
    // Call the route handler
    const response = await DELETE(mockRequest, { params: mockParams });
    
    // Verify getPaperById was called with the correct ID
    expect(getPaperById).toHaveBeenCalledWith(nonExistentPaperId);
    
    // Verify response is 404 Not Found
    expect(response.body.error).toBe('Paper not found');
    expect(response.init.status).toBe(404);
  });

  it('should delete paper files from blob storage and delete document from Cosmos DB', async () => {
    // Test paper ID
    const testPaperId = 'test-paper-to-delete';
    
    // Mock paper data
    const mockPaper = {
      id: testPaperId,
      examType: 'iit',
      year: '2023',
      paperType: 'IIT_JEE',
      paperUrl: 'https://example.com/test-paper.pdf',
      solutionUrl: 'https://example.com/test-solution.pdf',
      hasView: true,
      hasSolution: true,
      uploadDate: '2025-06-01T10:00:00Z'
    };
    
    // Mock getPaperById to return our test paper
    (getPaperById as jest.Mock).mockResolvedValueOnce(mockPaper);
    
    // Mock container's item delete method
    const mockDeleteMethod = jest.fn().mockResolvedValueOnce({});
    const mockItem = jest.fn().mockReturnValue({
      delete: mockDeleteMethod
    });
    const mockContainer = {
      item: mockItem
    };
    (getContainer as jest.Mock).mockResolvedValueOnce(mockContainer);
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: testPaperId });
    
    // Call the route handler
    const response = await DELETE(mockRequest, { params: mockParams });
    
    // Verify getPaperById was called with the correct ID
    expect(getPaperById).toHaveBeenCalledWith(testPaperId);
    
    // Verify deleteFileFromStorage was called for both files
    expect(deleteFileFromStorage).toHaveBeenCalledWith(mockPaper.paperUrl);
    expect(deleteFileFromStorage).toHaveBeenCalledWith(mockPaper.solutionUrl);
    expect(deleteFileFromStorage).toHaveBeenCalledTimes(2);
    
    // Verify Cosmos DB delete was called
    expect(mockItem).toHaveBeenCalledWith(testPaperId, testPaperId);
    expect(mockDeleteMethod).toHaveBeenCalled();
    
    // Verify response is successful
    expect(response.body.message).toBe('Paper deleted successfully');
    expect(response.body.paperId).toBe(testPaperId);
  });

  it('should handle errors during deletion and return 500', async () => {
    // Test paper ID
    const testPaperId = 'test-paper-delete-error';
    
    // Mock paper data
    const mockPaper = {
      id: testPaperId,
      examType: 'iit',
      year: '2023',
      paperType: 'IIT_JEE',
      paperUrl: 'https://example.com/test-paper.pdf',
      hasView: true,
      hasSolution: false,
      uploadDate: '2025-06-01T10:00:00Z'
    };
    
    // Mock getPaperById to return our test paper
    (getPaperById as jest.Mock).mockResolvedValueOnce(mockPaper);
    
    // Mock container to throw an error during delete
    const mockDeleteMethod = jest.fn().mockRejectedValueOnce(new Error('Deletion failed'));
    const mockItem = jest.fn().mockReturnValue({
      delete: mockDeleteMethod
    });
    const mockContainer = {
      item: mockItem
    };
    (getContainer as jest.Mock).mockResolvedValueOnce(mockContainer);
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: testPaperId });
    
    // Call the route handler
    const response = await DELETE(mockRequest, { params: mockParams });
    
    // Verify response is 500 Internal Server Error
    expect(response.body.error).toBe('Failed to delete paper');
    expect(response.init.status).toBe(500);
  });

  it('should handle NotFound errors during deletion and return 404', async () => {
    // Test paper ID
    const testPaperId = 'test-paper-not-found';
    
    // Mock paper data
    const mockPaper = {
      id: testPaperId,
      examType: 'iit',
      year: '2023',
      paperType: 'IIT_JEE',
      paperUrl: 'https://example.com/test-paper.pdf',
      hasView: true,
      hasSolution: false,
      uploadDate: '2025-06-01T10:00:00Z'
    };
    
    // Mock getPaperById to return our test paper
    (getPaperById as jest.Mock).mockResolvedValueOnce(mockPaper);
    
    // Mock container to throw a NotFound error during delete
    const notFoundError = new Error('NotFound: Entity does not exist');
    const mockDeleteMethod = jest.fn().mockRejectedValueOnce(notFoundError);
    const mockItem = jest.fn().mockReturnValue({
      delete: mockDeleteMethod
    });
    const mockContainer = {
      item: mockItem
    };
    (getContainer as jest.Mock).mockResolvedValueOnce(mockContainer);
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: testPaperId });
    
    // Call the route handler
    const response = await DELETE(mockRequest, { params: mockParams });
    
    // Verify response is 404 Not Found
    expect(response.body.error).toBe('Paper not found');
    expect(response.init.status).toBe(404);
  });
});
