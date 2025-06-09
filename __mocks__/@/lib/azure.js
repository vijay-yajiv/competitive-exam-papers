// Mock implementation of the Azure Cosmos DB functions for testing

// Sample paper data for testing
const mockPapers = [
  {
    id: 'test-paper-1',
    examType: 'iit',
    year: '2023',
    paperType: 'IIT_JEE',
    paperUrl: 'https://example.com/test-paper-1.pdf',
    hasDownload: true,
    hasSolution: false,
    uploadDate: '2025-06-01T10:00:00Z'
  },
  {
    id: 'test-paper-2',
    examType: 'neet',
    year: '2024',
    paperType: 'NEET',
    paperUrl: 'https://example.com/test-paper-2.pdf',
    solutionUrl: 'https://example.com/test-paper-2-solution.pdf',
    hasDownload: true,
    hasSolution: true,
    uploadDate: '2025-06-05T15:30:00Z'
  }
];

// Mock Azure Cosmos DB functions
export const getPaperById = jest.fn().mockImplementation((id) => {
  const paper = mockPapers.find(p => p.id === id);
  if (!paper) {
    return Promise.resolve(null);
  }
  return Promise.resolve(paper);
});

export const getAllPapers = jest.fn().mockImplementation(() => {
  return Promise.resolve(mockPapers);
});

export const getPapersByExamTypeAndYear = jest.fn().mockImplementation((examType, year) => {
  const papers = mockPapers.filter(p => p.examType === examType && p.year === year);
  return Promise.resolve(papers);
});

export const createPaper = jest.fn().mockImplementation((paper) => {
  return Promise.resolve({...paper, id: paper.id || 'new-paper-id'});
});

export const updatePaper = jest.fn().mockImplementation((id, paper) => {
  return Promise.resolve({...paper, id});
});

export const deletePaper = jest.fn().mockImplementation((id) => {
  return Promise.resolve({ success: true });
});

const mockContainer = {
  item: jest.fn().mockImplementation((id, partitionKey) => {
    return {
      read: jest.fn().mockImplementation(() => {
        const paper = mockPapers.find(p => p.id === id);
        if (!paper) {
          return Promise.reject(new Error(`Entity with the specified id does not exist in the system`));
        }
        return Promise.resolve({ resource: paper });
      }),
      delete: jest.fn().mockImplementation(() => {
        return Promise.resolve({ resource: null });
      })
    };
  }),
  items: {
    create: jest.fn().mockImplementation((item) => {
      return Promise.resolve({ resource: item });
    }),
    query: jest.fn().mockImplementation((querySpec) => {
      // Simple implementation that only handles querying by id
      const idParam = querySpec.parameters?.find(p => p.name === '@id');
      if (idParam) {
        const papers = mockPapers.filter(p => p.id === idParam.value);
        return {
          fetchAll: jest.fn().mockResolvedValue({ resources: papers })
        };
      }
      const examTypeParam = querySpec.parameters?.find(p => p.name === '@examType');
      const yearParam = querySpec.parameters?.find(p => p.name === '@year');
      if (examTypeParam && yearParam) {
        const papers = mockPapers.filter(p => 
          p.examType === examTypeParam.value && 
          p.year === yearParam.value
        );
        return {
          fetchAll: jest.fn().mockResolvedValue({ resources: papers })
        };
      }
      return {
        fetchAll: jest.fn().mockResolvedValue({ resources: mockPapers })
      };
    })
  }
};

export const getContainer = jest.fn().mockImplementation(() => {
  return Promise.resolve(mockContainer);
});
