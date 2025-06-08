'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { examPapers } from '@/data/examPapers';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

// Extend the NextAuth session type
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Helper function to get subject-specific information based on exam type
function getSubjectInfo(examType: string) {
  switch (examType) {
    case 'iit':
      return [
        { name: 'Physics', questions: '25', marks: '100', color: 'bg-blue-500' },
        { name: 'Chemistry', questions: '25', marks: '100', color: 'bg-green-500' },
        { name: 'Mathematics', questions: '25', marks: '100', color: 'bg-purple-500' }
      ];
    case 'neet':
      return [
        { name: 'Physics', questions: '45', marks: '180', color: 'bg-blue-500' },
        { name: 'Chemistry', questions: '45', marks: '180', color: 'bg-green-500' },
        { name: 'Biology', questions: '90', marks: '360', color: 'bg-red-500' }
      ];
    case 'gate':
      return [
        { name: 'General Aptitude', questions: '15', marks: '15', color: 'bg-yellow-500' },
        { name: 'Subject Specific', questions: '50', marks: '85', color: 'bg-purple-500' }
      ];
    default:
      return [
        { name: 'Subject 1', questions: '20', marks: '60', color: 'bg-blue-500' },
        { name: 'Subject 2', questions: '20', marks: '60', color: 'bg-green-500' }
      ];
  }
}

// Helper function to get topics based on exam type
function getTopics(examType: string) {
  switch (examType) {
    case 'iit':
      return [
        'Mechanics', 'Thermodynamics', 'Electrodynamics', 
        'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
        'Calculus', 'Algebra', 'Coordinate Geometry'
      ];
    case 'neet':
      return [
        'Human Physiology', 'Plant Physiology', 'Genetics', 
        'Organic Chemistry', 'Inorganic Chemistry', 'Mechanics',
        'Thermodynamics', 'Modern Physics', 'Optics'
      ];
    case 'gate':
      return [
        'Data Structures', 'Algorithms', 'Operating Systems', 
        'Database Management', 'Computer Networks', 'Theory of Computation'
      ];
    default:
      return ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'];
  }
}

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.paperId as string;
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the specific paper by ID
  const paper = examPapers.find(p => p.id === paperId);
  
  // If paper doesn't exist, return 404
  if (!paper) {
    notFound();
  }
  
  // Track page view
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/papers/paper/${paperId}/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'view' }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };
    
    trackView();
  }, [paperId]);
  
  // Check if paper is in user favorites
  useEffect(() => {
    if (session?.user) {
      // Fetch favorite status from API
      fetch(`/api/favorites?paperId=${paperId}`)
        .then(res => res.json())
        .then(data => {
          if (data.isFavorited !== undefined) {
            setIsFavorited(data.isFavorited);
          }
        })
        .catch(error => {
          console.error('Error checking favorite status:', error);
        });
    }
  }, [session, paperId]);
  
  // Function to track downloads
  const trackDownload = async () => {
    try {
      await fetch(`/api/papers/paper/${paperId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'download' }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };
  
  // Determine exam display name
  const examName = paper.examType === 'iit' ? 'IIT-JEE' : 
                   paper.examType === 'neet' ? 'NEET' : 
                   paper.examType === 'gate' ? 'GATE' : paper.examType.toUpperCase();

  // Paper details (This would typically come from your database)
  const paperDetails = {
    duration: paper.examType === 'iit' ? '3 hours' : 
              paper.examType === 'neet' ? '3 hours 20 minutes' : 
              '3 hours',
    totalMarks: paper.examType === 'iit' ? '300' : 
                paper.examType === 'neet' ? '720' : 
                '100',
    numQuestions: paper.examType === 'iit' ? '75' : 
                  paper.examType === 'neet' ? '180' : 
                  '65',
    negativeMarking: paper.examType === 'iit' ? 'Yes (1/4th)' : 
                     paper.examType === 'neet' ? 'Yes (1/4th)' : 
                     'Yes (1/3rd)'
  };

  // Prepare subject-specific information
  const subjectInfo = getSubjectInfo(paper.examType);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href={`/exams/${paper.examType}/${paper.year}`} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to {examName} {paper.year}
        </Link>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-8 mb-8">
        <div className="flex justify-between flex-wrap gap-4 mb-8">
          <div>
            <span className="text-gray-500 text-sm">{paper.year} • {examName}</span>
            <h1 className="text-3xl font-bold mt-1">{paper.paperType}</h1>
          </div>
          
          <div className="flex gap-3">
            {paper.hasDownload && (
              <a 
                href={paper.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackDownload}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Paper
              </a>
            )}
            
            {paper.hasSolution && (
              <a 
                href={paper.solutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Solution
              </a>
            )}
            
            <button
              onClick={async () => {
                if (!session) {
                  window.location.href = `/auth/signin?callbackUrl=/papers/${paperId}`;
                  return;
                }
                setIsLoading(true);
                
                try {
                  // Make actual API call to toggle favorites
                  const response = await fetch('/api/favorites', {
                    method: isFavorited ? 'DELETE' : 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ paperId }),
                  });
                  
                  if (!response.ok) throw new Error('Failed to update favorites');
                  
                  // Toggle favorite state on successful API call
                  setIsFavorited(!isFavorited);
                } catch (error) {
                  console.error('Error updating favorites:', error);
                } finally {
                  setIsLoading(false);
                }
              }}
              className={`px-4 py-2.5 border rounded-lg flex items-center transition ${
                isFavorited 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{paperDetails.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marks</span>
                <span className="font-medium">{paperDetails.totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium">{paperDetails.numQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Negative Marking</span>
                <span className="font-medium">{paperDetails.negativeMarking}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Subjects Covered</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-3">
                {subjectInfo.map((subject, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`h-6 w-6 rounded-full ${subject.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-gray-500">{subject.questions} questions • {subject.marks} marks</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Important Topics Covered</h2>
          <div className="flex flex-wrap gap-2">
            {getTopics(paper.examType).map((topic, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-4">Preparation Tips</h2>
        <div className="prose max-w-none">
          <p>
            This {examName} {paper.year} paper covers key concepts that you should focus on during your preparation.
            Here are some tips to effectively utilize this paper:
          </p>
          <ul>
            <li>First attempt to solve the paper in the specified time limit without referring to solutions.</li>
            <li>After completion, calculate your score using the marking scheme provided.</li>
            <li>For questions you got wrong, thoroughly review the concepts in the solution.</li>
            <li>Note down difficult questions and concepts to revisit during your revision.</li>
            <li>Compare with other papers from the same year to identify common patterns.</li>
          </ul>
          <p>
            <strong>Pro Tip:</strong> Create a separate notebook for important formulas and concepts you learned
            while solving this paper for quick reference during revision.
          </p>
        </div>
      </div>
    </div>
  );
}
