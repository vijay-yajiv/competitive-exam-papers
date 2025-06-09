// Simple test to debug DELETE function response
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

describe('Debug DELETE Function', () => {
  it('should return a response object', async () => {
    const mockGetPaperById = require('@/lib/azure').getPaperById;
    
    // Mock to return a test paper
    mockGetPaperById.mockResolvedValue({
      id: 'test-paper',
      examType: 'iit',
      year: '2023',
    });
    
    // Create a simple request
    const request = new NextRequest('http://localhost:3000/api/papers/delete/test-paper');
    const params = { params: Promise.resolve({ paperId: 'test-paper' }) };
    
    console.log('About to call DELETE function...');
    
    try {
      const response = await DELETE(request, params);
      console.log('Response received:', response);
      console.log('Response type:', typeof response);
      console.log('Response constructor:', response?.constructor?.name);
      
      // Check if response exists
      expect(response).toBeDefined();
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('json');
      
      // Try to get status
      console.log('Response status:', response.status);
      
      // Try to parse JSON
      const data = await response.json();
      console.log('Response data:', data);
      
    } catch (error) {
      console.error('Error during DELETE call:', error);
      throw error;
    }
  });
});
