'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Paper {
  id: string;
  examType: string;
  year: string;
  paperType: string;
  uploadDate: string;
  hasSolution: boolean;
  paperUrl?: string;
  solutionUrl?: string;
}

export default function AdminManagePapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/papers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }
      
      const papersData = await response.json();
      setPapers(papersData);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setDeleteResult({
        success: false,
        message: 'Failed to load papers'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (paperId: string, paperTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${paperTitle}"? This action cannot be undone and will remove both the paper and solution files from Azure storage.`)) {
      return;
    }

    console.log(`Deleting paper: ${paperId} (${paperTitle})`);
    setIsDeleting(paperId);
    setDeleteResult(null);

    try {
      console.log(`Sending DELETE request to /api/papers/delete/${paperId}`);
      const response = await fetch(`/api/papers/delete/${paperId}`, {
        method: 'DELETE',
      });

      console.log(`Delete response status: ${response.status}`);
      const responseData = await response.json();
      console.log(`Delete response data:`, responseData);
      
      if (response.ok) {
        setDeleteResult({
          success: true,
          message: `Paper "${paperTitle}" deleted successfully`
        });
        
        // Remove the paper from the local state
        setPapers(papers.filter(paper => paper.id !== paperId));
        
        // Refresh the papers list just to be sure
        setTimeout(() => {
          fetchPapers();
        }, 1000);
      } else {
        setDeleteResult({
          success: false,
          message: responseData.error || 'Failed to delete paper'
        });
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
      setDeleteResult({
        success: false,
        message: error instanceof Error ? `Error: ${error.message}` : 'An unexpected error occurred while deleting'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getExamName = (examType: string) => {
    return examType === 'iit' ? 'IIT-JEE' : 
           examType === 'neet' ? 'NEET' : 
           examType === 'gate' ? 'GATE' : examType.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Admin Dashboard
        </Link>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Papers</h1>
          <Link 
            href="/admin/upload" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload New Paper
          </Link>
        </div>
      </div>

      {deleteResult && (
        <div className={`mb-6 p-4 rounded-md ${
          deleteResult.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-medium">{deleteResult.message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">All Papers ({papers.length})</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No papers have been uploaded yet.</p>
            <Link 
              href="/admin/upload" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Upload Your First Paper
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-medium">Paper Details</th>
                  <th className="px-4 py-3 text-sm font-medium">Exam Type</th>
                  <th className="px-4 py-3 text-sm font-medium">Year</th>
                  <th className="px-4 py-3 text-sm font-medium">Upload Date</th>
                  <th className="px-4 py-3 text-sm font-medium">Files</th>
                  <th className="px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr key={paper.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{paper.paperType}</p>
                        <p className="text-sm text-gray-500 font-mono">{paper.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {getExamName(paper.examType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{paper.year}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(paper.uploadDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Paper
                        </span>
                        {paper.hasSolution && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            Solution
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Link 
                          href={`/papers/${paper.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(paper.id, paper.paperType)}
                          disabled={isDeleting === paper.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isDeleting === paper.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Deletion Warning</h3>
            <p className="text-yellow-700 text-sm">
              Deleting a paper will permanently remove both the question paper and solution files from Azure Blob Storage, 
              as well as all metadata from Azure Cosmos DB. This action cannot be undone. Please ensure you have backups 
              if needed before proceeding with deletion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
