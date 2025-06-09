// __tests__/api/papers/getPaperId.test.ts
import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/papers/get/[paperId]/route';
import { getPaperById } from '@/lib/azure';

// Mock dependencies
jest.mock('@/lib/azure');
jest.mock('next/server', () => {
  return {
    ...jest.requireActual('next/server'),
    NextResponse: {
      json: jest.fn((data, options) => {
        return {
          body: data,
          init: options,
        };
      }),
    },
  };
});

describe('GET /api/papers/get/[paperId]', () => {
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
    const response = await GET(mockRequest, { params: mockParams });
    
    expect(response.body.error).toBe('Paper ID is required');
    expect(response.init.status).toBe(400);
  });

  it('should return the paper if it exists in Cosmos DB', async () => {
    // Test paper ID
    const testPaperId = 'test-paper-1';
    
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
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: testPaperId });
    
    // Call the route handler
    const response = await GET(mockRequest, { params: mockParams });
    
    // Verify getPaperById was called with the correct ID
    expect(getPaperById).toHaveBeenCalledWith(testPaperId);
    
    // Verify response contains the correct paper
    expect(response.body).toEqual(mockPaper);
  });

  it('should return 404 if paper does not exist in Cosmos DB', async () => {
    // Test paper ID
    const nonExistentPaperId = 'non-existent-paper';
    
    // Mock getPaperById to return null (paper not found)
    (getPaperById as jest.Mock).mockResolvedValueOnce(null);
    
    // Mock params with non-existent paperId
    const mockParams = Promise.resolve({ paperId: nonExistentPaperId });
    
    // Call the route handler
    const response = await GET(mockRequest, { params: mockParams });
    
    // Verify getPaperById was called with the correct ID
    expect(getPaperById).toHaveBeenCalledWith(nonExistentPaperId);
    
    // Verify response is 404 Not Found
    expect(response.body.error).toBe('Paper not found');
    expect(response.init.status).toBe(404);
  });

  it('should handle development mode and return paper from global.devPapers', async () => {
    // Enable development mode
    process.env.DEVELOPMENT_MODE = 'true';
    
    // Test paper ID
    const devPaperId = 'dev-paper-1';
    
    // Mock paper data for development mode
    const mockDevPaper = {
      id: devPaperId,
      examType: 'iit',
      year: '2023',
      paperType: 'IIT_JEE',
      paperUrl: '/uploads/test-paper.pdf',
      hasView: true,
      hasSolution: false,
      uploadDate: '2025-06-01T10:00:00Z'
    };
    
    // Set up global.devPapers with our test paper
    (global as any).devPapers = [mockDevPaper];
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: devPaperId });
    
    // Call the route handler
    const response = await GET(mockRequest, { params: mockParams });
    
    // Verify getPaperById was NOT called (should use devPapers in development mode)
    expect(getPaperById).not.toHaveBeenCalled();
    
    // Verify response contains the correct paper
    expect(response.body).toEqual(mockDevPaper);
  });

  it('should handle errors and return 500', async () => {
    // Test paper ID
    const testPaperId = 'test-paper-error';
    
    // Mock getPaperById to throw an error
    (getPaperById as jest.Mock).mockRejectedValueOnce(new Error('Database connection error'));
    
    // Mock params with valid paperId
    const mockParams = Promise.resolve({ paperId: testPaperId });
    
    // Call the route handler
    const response = await GET(mockRequest, { params: mockParams });
    
    // Verify response is 500 Internal Server Error
    expect(response.body.error).toBe('Failed to fetch paper');
    expect(response.init.status).toBe(500);
  });
});
