'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PaperCardProps {
  id: string;
  examType: string;
  year: string;
  paperType: string;
  hasDownload?: boolean;
  hasSolution?: boolean;
  paperUrl?: string;
  solutionUrl?: string;
  subjects?: string[];
  views?: number;
  isFavorited?: boolean;
}

export default function PaperCard({ 
  id,
  examType, 
  year, 
  paperType, 
  hasDownload = true, 
  hasSolution = true,
  paperUrl = '#',
  solutionUrl = '#',
  subjects,
  views,
  isFavorited = false
}: PaperCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Load favorite status from API when user is authenticated
  useEffect(() => {
    if (session?.user) {
      fetch(`/api/favorites?paperId=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.isFavorited !== undefined) {
            setFavorited(data.isFavorited);
          }
        })
        .catch(error => {
          console.error('Error checking favorite status:', error);
        });
    }
  }, [session, id]);
  
  const examName = examType === 'iit' ? 'IIT-JEE' : 
                   examType === 'neet' ? 'NEET' : 
                   examType === 'gate' ? 'GATE' : examType.toUpperCase();
                   
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If user is not logged in, redirect to login
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=/papers/${id}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make actual API call to toggle favorites
      const response = await fetch('/api/favorites', {
        method: favorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paperId: id }),
      });
      
      if (!response.ok) throw new Error('Failed to update favorites');
      
      // Toggle favorite state on successful API call
      setFavorited(!favorited);
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <Link href={`/papers/${id}`} className="block cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">{examName} {year}</h3>
            <p className="text-gray-500">{paperType}</p>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">PDF</span>
        </div>
        
        {subjects && subjects.length > 0 && (
          <div className="mt-3 mb-4">
            <div className="flex flex-wrap gap-1">
              {subjects.map((subject, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {views !== undefined && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views} views
          </div>
        )}
      </Link>
      
      <div className="flex flex-wrap gap-3 mt-6">
        {hasDownload && (
          <a 
            href={`/api/download/${id}?type=paper`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center text-sm"
            onClick={(e) => {
              // In a real app, track download events
              console.log(`Download event for paper ${id}`);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Paper
          </a>
        )}
        
        {hasSolution && (
          <a 
            href={`/api/download/${id}?type=solution`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Solution
          </a>
        )}
        
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`p-2 border rounded hover:bg-gray-50 transition flex items-center justify-center ${
            favorited ? 'text-red-500 border-red-300' : 'text-gray-400 border-gray-300'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={favorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        
        <Link 
          href={`/papers/${id}`}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition flex items-center text-sm ml-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Details
        </Link>
      </div>
    </div>
  );
}
