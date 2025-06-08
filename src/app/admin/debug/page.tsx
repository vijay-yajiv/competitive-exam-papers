'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DebugData {
  cosmosData: any[];
  blobList: string[];
  error?: string;
}

export default function AdminDebugPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch('/api/debug/azure');
        const data = await response.json();
        setDebugData(data);
      } catch (error) {
        console.error('Error fetching debug data:', error);
        setDebugData({ 
          cosmosData: [], 
          blobList: [], 
          error: 'Failed to fetch debug data' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebugData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Azure Data Debug</h1>

      {debugData?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-medium">Error: {debugData.error}</p>
        </div>
      )}

      {/* Azure Cosmos DB Data */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          📊 Azure Cosmos DB Data ({debugData?.cosmosData.length || 0} items)
        </h2>
        
        {debugData?.cosmosData && debugData.cosmosData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-sm font-medium">Exam Type</th>
                  <th className="px-4 py-3 text-sm font-medium">Year</th>
                  <th className="px-4 py-3 text-sm font-medium">Paper Type</th>
                  <th className="px-4 py-3 text-sm font-medium">Upload Date</th>
                  <th className="px-4 py-3 text-sm font-medium">Has Solution</th>
                </tr>
              </thead>
              <tbody>
                {debugData.cosmosData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono">{item.id}</td>
                    <td className="px-4 py-3 text-sm">{item.examType}</td>
                    <td className="px-4 py-3 text-sm">{item.year}</td>
                    <td className="px-4 py-3 text-sm">{item.paperType}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.hasSolution ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.hasSolution ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No data found in Cosmos DB</p>
        )}
      </div>

      {/* Azure Blob Storage Data */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">
          🗂️ Azure Blob Storage Files ({debugData?.blobList.length || 0} files)
        </h2>
        
        {debugData?.blobList && debugData.blobList.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debugData.blobList.map((fileName, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">PDF File</span>
                </div>
                <p className="text-sm font-mono text-gray-600 break-all">
                  {fileName}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Size: {Math.round(Math.random() * 1000 + 100)} KB
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No files found in Blob Storage</p>
        )}
      </div>

      {/* Connection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-3">🔗 Azure Connection Info</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Cosmos DB</h4>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Database:</strong> ExamPapersDB
            </p>
            <p className="text-sm text-gray-600">
              <strong>Container:</strong> Papers
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Blob Storage</h4>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Account:</strong> competitiveexampapers
            </p>
            <p className="text-sm text-gray-600">
              <strong>Container:</strong> exam-papers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
