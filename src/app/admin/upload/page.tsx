'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminUploadPage() {
  const [examType, setExamType] = useState('');
  const [year, setYear] = useState('');
  const [paperType, setPaperType] = useState('');
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examType || !year || !paperType || !paperFile) {
      setUploadResult({
        success: false,
        message: 'Please fill in all required fields and upload a paper file'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const formData = new FormData();
      formData.append('examType', examType);
      formData.append('year', year);
      formData.append('paperType', paperType);
      formData.append('paperFile', paperFile);
      
      if (solutionFile) {
        formData.append('solutionFile', solutionFile);
      }
      
      const response = await fetch('/api/papers/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadResult({
          success: true,
          message: `Paper uploaded successfully with ID: ${data.id}`
        });
        
        // Reset the form
        setExamType('');
        setYear('');
        setPaperType('');
        setPaperFile(null);
        setSolutionFile(null);
      } else {
        const errorData = await response.json();
        setUploadResult({
          success: false,
          message: errorData.error || 'Failed to upload paper'
        });
      }
    } catch (error) {
      console.error('Error uploading paper:', error);
      setUploadResult({
        success: false,
        message: 'An unexpected error occurred while uploading'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
      
      <h1 className="text-3xl font-bold mb-8">Upload Exam Paper</h1>
      
      {/* Development Mode Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="font-semibold text-blue-800 mb-2">🚀 Development Mode</h2>
        <p className="text-blue-700 text-sm">
          Azure services are not configured. Files will be stored locally for testing. 
          To use Azure services, configure COSMOS_ENDPOINT, COSMOS_KEY, and AZURE_STORAGE_CONNECTION_STRING in your .env.local file.
        </p>
      </div>
      
      {uploadResult && (
        <div className={`mb-6 p-4 rounded-md ${
          uploadResult.success 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-medium">{uploadResult.message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type*
            </label>
            <select
              id="examType"
              value={examType}
              onChange={e => setExamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Exam Type</option>
              <option value="iit">IIT-JEE</option>
              <option value="neet">NEET</option>
              <option value="gate">GATE</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year*
            </label>
            <select
              id="year"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Year</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-1">
            Paper Type/Title*
          </label>
          <input
            id="paperType"
            type="text"
            value={paperType}
            onChange={e => setPaperType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. JEE Main April Session - Paper 1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="paperFile" className="block text-sm font-medium text-gray-700 mb-1">
            Paper PDF*
          </label>
          <input
            id="paperFile"
            type="file"
            accept=".pdf"
            onChange={e => setPaperFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <p className="mt-1 text-sm text-gray-500">Upload the exam question paper (PDF format only)</p>
        </div>
        
        <div>
          <label htmlFor="solutionFile" className="block text-sm font-medium text-gray-700 mb-1">
            Solution PDF (Optional)
          </label>
          <input
            id="solutionFile"
            type="file"
            accept=".pdf"
            onChange={e => setSolutionFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">Upload the solution if available (PDF format only)</p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : 'Upload Paper'}
          </button>
        </div>
      </form>
    </div>
  );
}
