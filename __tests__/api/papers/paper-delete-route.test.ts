import { NextRequest } from 'next/server';
import * as nextServer from 'next/server';
import { DELETE } from '@/app/api/papers/delete/[paperId]/route';
import { getPaperById, getContainer } from '@/lib/azure';
import { deleteFileFromStorage } from '@/lib/azureStorage';

// Mock modules
jest.mock('@/lib/azure', () => ({
  getPaperById: jest.fn(),
  getContainer: jest.fn()
}));
jest.mock('@/lib/azureStorage', () => ({
  deleteFileFromStorage: jest.fn()
}));

// Mock NextResponse.json
const mockJsonFunction = jest.fn();
jest.mock('next/server', () => ({
  NextRequest: jest.requireActual('next/server').NextRequest,
  NextResponse: {
    json: (body: any, init?: ResponseInit) => {
      mockJsonFunction(body, init);
      return { body, init };
    }
  }
}));

describe('DELETE /api/papers/delete/[paperId] API route', () => {
  // Sample test paper
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
    process.env.DEVELOPMENT_MODE = 'false';
  });

  it('should return 400 if paperId is missing', async () => {
    const mockRequest = {} as NextRequest;
    const mockParams = Promise.resolve({});
    
    // @ts-ignore - missing paperId is intentional for test
    const result = await DELETE(mockRequest, { params: mockParams });
    
    expect(mockJsonFunction).toHaveBeenCalledWith(
      { error: 'Paper ID is required' },
      { status: 400 }
    );
  });

  it('should handle development mode', async () => {
    process.env.DEVELOPMENT_MODE = 'true';
    
    const mockRequest = {} as NextRequest;
    const mockParams = Promise.resolve({ paperId: 'dev-paper-id' });
    
    await DELETE(mockRequest, { params: mockParams });
    
    // Should not call real services in dev mode
    expect(getPaperById).not.toHaveBeenCalled();
    expect(getContainer).not.toHaveBeenCalled();
    expect(deleteFileFromStorage).not.toHaveBeenCalled();
    
    // Should return success message for dev mode
    expect(mockJsonFunction).toHaveBeenCalledWith(
      expect.objectContaining({ 
        message: expect.stringContaining('development mode'),
        paperId: 'dev-paper-id' 
      }),
      undefined
    );
  });

  it('should return 404 if paper is not found', async () => {
    (getPaperById as jest.Mock).mockResolvedValueOnce(null);
    
    const mockRequest = {} as NextRequest;
    const mockParams = Promise.resolve({ paperId: 'non-existent-paper' });
    
    await DELETE(mockRequest, { params: mockParams });
    
    expect(getPaperById).toHaveBeenCalledWith('non-existent-paper');
    expect(mockJsonFunction).toHaveBeenCalledWith(
      { error: 'Paper not found' },
      { status: 404 }
    );
  });

  it('should delete paper files and document when found', async () => {
    // Setup mocks
    (getPaperById as jest.Mock).mockResolvedValueOnce(testPaper);
    
    const mockDeleteMethod = jest.fn().mockResolvedValueOnce({});
    const mockItem = jest.fn().mockReturnValue({ delete: mockDeleteMethod });
    (getContainer as jest.Mock).mockResolvedValueOnce({ item: mockItem });
    
    // Mock file deletion
    (deleteFileFromStorage as jest.Mock).mockResolvedValue(undefined);
    
    const mockRequest = {} as NextRequest;
    const mockParams = Promise.resolve({ paperId: 'test-delete-paper' });
    
    await DELETE(mockRequest, { params: mockParams });
    
    // Verify paper was retrieved
    expect(getPaperById).toHaveBeenCalledWith('test-delete-paper');
    
    // Verify files were deleted
    expect(deleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-paper.pdf');
    expect(deleteFileFromStorage).toHaveBeenCalledWith('https://example.com/test-solution.pdf');
    
    // Verify document was deleted
    expect(mockItem).toHaveBeenCalledWith('test-delete-paper', 'test-delete-paper');
    expect(mockDeleteMethod).toHaveBeenCalled();
    
    // Verify response
    expect(mockJsonFunction).toHaveBeenCalledWith(
      { message: 'Paper deleted successfully', paperId: 'test-delete-paper' },
      undefined
    );
  });

  it('should handle errors during deletion', async () => {
    // Setup mocks
    (getPaperById as jest.Mock).mockResolvedValueOnce(testPaper);
    
    const mockError = new Error('Delete operation failed');
    const mockDeleteMethod = jest.fn().mockRejectedValueOnce(mockError);
    const mockItem = jest.fn().mockReturnValue({ delete: mockDeleteMethod });
    (getContainer as jest.Mock).mockResolvedValueOnce({ item: mockItem });
    
    // Mock file deletion
    (deleteFileFromStorage as jest.Mock).mockResolvedValue(undefined);
    
    const mockRequest = {} as NextRequest;
    const mockParams = Promise.resolve({ paperId: 'test-delete-paper' });
    
    await DELETE(mockRequest, { params: mockParams });
    
    // Verify error handling
    expect(mockJsonFunction).toHaveBeenCalledWith(
      { error: 'Failed to delete paper' },
      { status: 500 }
    );
  });
});
