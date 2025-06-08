import React from 'react';
import Link from 'next/link';

interface PaperCardProps {
  examType: string;
  year: string;
  paperType: string;
  hasDownload?: boolean;
  hasSolution?: boolean;
}

export default function PaperCard({ examType, year, paperType, hasDownload = true, hasSolution = true }: PaperCardProps) {
  const examName = examType === 'iit' ? 'IIT-JEE' : 
                   examType === 'neet' ? 'NEET' : 
                   examType === 'gate' ? 'GATE' : examType.toUpperCase();
    
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{examName} {year}</h3>
          <p className="text-gray-500">{paperType}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">PDF</span>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-6">
        {hasDownload && (
          <a 
            href={`#`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Paper
          </a>
        )}
        
        {hasSolution && (
          <a 
            href={`#`}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Solution
          </a>
        )}
      </div>
    </div>
  );
}
