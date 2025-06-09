// Integration test for delete API route with proper response handling
import { DELETE } from '@/app/api/papers/delete/[paperId]/route';
import { NextRequest } from 'next/server';

// Mock the azure modules
jest.mock('@/lib/azure', () => ({
  getPaperById: jest.fn(),
  deletePaper: jest.fn(),
}));

jest.mock('@/lib/azureStorage', () => ({
  deleteFileFromStorage: jest.fn(),
}));

describe('DELETE /api/papers/delete/[paperId] - Working Test', () => {
  let mockGetPaperById: jest.Mock;
  let mockDeletePaper: jest.Mock;
  let mockDeleteFileFromStorage: jest.Mock;

  beforeEach(() => {
    // Get mocked functions
    const azureModule = require('@/lib/azure');
    const storageModule = require('@/lib/azureStorage');
    
    mockGetPaperById = azureModule.getPaperById;
    mockDeletePaper = azureModule.deletePaper;
    mockDeleteFileFromStorage = storageModule.deleteFileFromStorage;
    
    jest.clearAllMocks();
  });

  const testPaper = {
    id: 'test-paper-delete',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper.pdf',
    solutionUrl: 'https://example.com/test-solution.pdf',
    hasView: true,
    hasSolution: true,
    uploadDate: '2025-06-01T10:00:00Z',
  };

  it('should successfully delete paper and return 200', async () => {
    // Setup mocks
    mockGetPaperById.mockResolvedValue(testPaper);
    mockDeleteFileFromStorage.mockResolvedValue(undefined);
    mockDeletePaper.mockResolvedValue(undefined);
    
    // Create request
    const request = new NextRequest('http://localhost:3000/api/papers/delete/test-paper-delete');
    const params = { params: Promise.resolve({ paperId: 'test-paper-delete' }) };
    
    // Call the function
    const response = await DELETE(request, params);
    
    // Parse the response properly
    const responseData = await response.json();
    
    // Verify response
    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Paper deleted successfully');
    expect(responseData.paperId).toBe('test-paper-delete');
    
    // Verify function calls
    expect(mockGetPaperById).toHaveBeenCalledWith('test-paper-delete');
    expect(mockDeleteFileFromStorage).toHaveBeenCalledTimes(2);
    expect(mockDeleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-paper.pdf');
    expect(mockDeleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-solution.pdf');
    expect(mockDeletePaper).toHaveBeenCalledWith('test-paper-delete');
  });

  it('should return 404 when paper not found', async () => {
    // Setup mock to return null (paper not found)
    mockGetPaperById.mockResolvedValue(null);
    
    // Create request
    const request = new NextRequest('http://localhost:3000/api/papers/delete/non-existent');
    const params = { params: Promise.resolve({ paperId: 'non-existent' }) };
    
    // Call the function
    const response = await DELETE(request, params);
    
    // Parse the response properly
    const responseData = await response.json();
    
    // Verify response
    expect(response.status).toBe(404);
    expect(responseData.error).toBe('Paper not found');
    
    // Verify only getPaperById was called
    expect(mockGetPaperById).toHaveBeenCalledWith('non-existent');
    expect(mockDeletePaper).not.toHaveBeenCalled();
    expect(mockDeleteFileFromStorage).not.toHaveBeenCalled();
  });

  it('should handle deletion errors and return 500', async () => {
    // Setup mocks - paper exists but deletion fails
    mockGetPaperById.mockResolvedValue(testPaper);
    mockDeleteFileFromStorage.mockResolvedValue(undefined);
    mockDeletePaper.mockRejectedValue(new Error('Cosmos deletion failed'));
    
    // Create request
    const request = new NextRequest('http://localhost:3000/api/papers/delete/test-paper-delete');
    const params = { params: Promise.resolve({ paperId: 'test-paper-delete' }) };
    
    // Call the function
    const response = await DELETE(request, params);
    
    // Parse the response properly
    const responseData = await response.json();
    
    // Verify response
    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Failed to delete paper');
    
    // Verify function calls
    expect(mockGetPaperById).toHaveBeenCalledWith('test-paper-delete');
    expect(mockDeleteFileFromStorage).toHaveBeenCalledTimes(2);
    expect(mockDeletePaper).toHaveBeenCalledWith('test-paper-delete');
  });

  it('should handle development mode correctly', async () => {
    // Set development mode correctly
    process.env.DEVELOPMENT_MODE = 'true';
    
    // Create request with dev prefix
    const request = new NextRequest('http://localhost:3000/api/papers/delete/dev-paper-test');
    const params = { params: Promise.resolve({ paperId: 'dev-paper-test' }) };
    
    // Call the function
    const response = await DELETE(request, params);
    
    // Parse the response properly
    const responseData = await response.json();
    
    // Verify response for development mode
    expect(response.status).toBe(200);
    expect(responseData.message).toContain('development mode');
    expect(responseData.paperId).toBe('dev-paper-test');
    
    // No Azure functions should have been called in dev mode
    expect(mockGetPaperById).not.toHaveBeenCalled();
    expect(mockDeletePaper).not.toHaveBeenCalled();
    expect(mockDeleteFileFromStorage).not.toHaveBeenCalled();
    
    // Clean up
    delete process.env.DEVELOPMENT_MODE;
  });
});
