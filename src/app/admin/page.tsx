'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminAnalytics from '@/components/AdminAnalytics';

interface PaperSummary {
  examType: string;
  year: string;
  count: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [paperSummary, setPaperSummary] = useState<PaperSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/api/papers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch papers');
        }
        
        const papers = await response.json();
        
        // Group papers by exam type and year
        const summary = papers.reduce((acc: PaperSummary[], paper: any) => {
          const existingEntry = acc.find(
            item => item.examType === paper.examType && item.year === paper.year
          );
          
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            acc.push({
              examType: paper.examType,
              year: paper.year,
              count: 1
            });
          }
          
          return acc;
        }, []);
        
        setPaperSummary(summary);
      } catch (error) {
        console.error('Error fetching papers:', error);
        setError('Failed to load paper statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPapers();
  }, []);

  const getExamName = (examType: string) => {
    return examType === 'iit' ? 'IIT-JEE' : 
           examType === 'neet' ? 'NEET' : 
           examType === 'gate' ? 'GATE' : examType.toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link 
            href="/admin/manage" 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 13h-7A1.5 1.5 0 018 11.5V5zM6.5 9.5a1 1 0 112 0 1 1 0 01-2 0zm5 0a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            Manage Papers
          </Link>
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
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Paper Statistics</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : paperSummary.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No papers have been uploaded yet.</p>
            <Link 
              href="/admin/upload" 
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Upload Your First Paper
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3">Exam Type</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Papers Count</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paperSummary.map((item, index) => (
                  <tr 
                    key={index} 
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{getExamName(item.examType)}</td>
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3">{item.count}</td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/exams/${item.examType}/${item.year}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Analytics Dashboard */}
      <AdminAnalytics />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold">Azure Storage Information</h2>
          <Link 
            href="/admin/debug" 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            Debug Azure Data
          </Link>
        </div>
        <p className="mb-4">
          Your exam papers and solutions are being stored in Azure Cloud. Here's some information about your setup:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Azure Cosmos DB</h3>
            <p className="text-gray-600 text-sm">
              All paper metadata is stored in Cosmos DB, making it easy to query and filter papers based on exam type, year, and other criteria.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <h3 className="font-medium mb-2">Azure Blob Storage</h3>
            <p className="text-gray-600 text-sm">
              The actual PDF files are stored in Azure Blob Storage, providing secure and scalable file storage with fast access times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
