'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PaperCard from '@/components/PaperCard';
import { ExamPaper } from '@/types/examPaper';
import { useSession } from 'next-auth/react';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose, title }) => {
  const [error, setError] = useState(false);

  const handleIframeError = () => {
    setError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 p-4">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Unable to display PDF in viewer</h3>
              <p className="text-gray-600 mb-4">The PDF cannot be displayed in the browser viewer.</p>
              <a 
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Open PDF in New Tab
              </a>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full border rounded"
              title={title}
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function ExamYearPage({ params }: { params: Promise<{ examType: string, year: string }> }) {
  const [examType, setExamType] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfViewer, setPdfViewer] = useState<{ url: string; title: string } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params;
      setExamType(resolvedParams.examType);
      setYear(resolvedParams.year);
      
      // Fetch papers for this exam type and year
      try {
        const response = await fetch(
          `/api/papers/by-exam-and-year/${resolvedParams.examType}/${resolvedParams.year}`
        );
        
        if (response.ok) {
          const papersData = await response.json();
          setPapers(papersData);
        } else if (response.status === 404) {
          setPapers([]);
        }
      } catch (error) {
        console.error('Error fetching papers:', error);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [params]);

  const handleViewPDF = async (paperId: string, paperTitle: string) => {
    try {
      // Use the new PDF view API that handles SAS tokens properly
      const response = await fetch(`/api/view-pdf/${paperId}?type=paper`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('PDF view API error:', error);
        alert('Unable to load PDF. Please try again.');
        return;
      }
      
      const data = await response.json();
      
      // For external URLs, open in new tab instead of iframe to avoid CORS issues
      if (data.external) {
        window.open(data.pdfUrl, '_blank');
        return;
      }
      
      // For Azure blob URLs with SAS tokens, use iframe viewer
      setPdfViewer({ url: data.pdfUrl, title: data.title });
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Unable to load PDF. Please try again.');
    }
  };

  const closePDFViewer = () => {
    setPdfViewer(null);
  };

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
        return ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry', 'Statistics'];
      case 'neet':
        return ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Plant Biology', 'Animal Biology', 'Human Physiology', 'Genetics', 'Ecology'];
      case 'gate':
        return ['Programming', 'Data Structures', 'Algorithms', 'Computer Networks', 'Operating Systems', 'Database Management', 'Software Engineering', 'Digital Logic'];
      default:
        return ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'];
    }
  }
  
  // Exam name mapping
  const examName = examType === 'iit' ? 'IIT-JEE' : 
                   examType === 'neet' ? 'NEET' : 
                   examType === 'gate' ? 'GATE' : 
                   examType === 'cat' ? 'CAT' :
                   examType === 'upsc' ? 'UPSC' :
                   examType.toUpperCase();

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      {pdfViewer && (
        <PDFViewer
          pdfUrl={pdfViewer.url}
          title={pdfViewer.title}
          onClose={closePDFViewer}
        />
      )}
      
      <div className="mb-8">
        <Link 
          href="/exams" 
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Exams
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{examName} {year}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse {year} {examName} exam papers and solutions
          </p>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <h2 className="text-xl font-medium text-gray-500">No papers available for {examName} {year}</h2>
          <p className="mt-2 text-gray-400">Please check back later or try another year</p>
        </div>
      ) : (
        <div className="space-y-8">
          {papers.map((paper) => {
            const subjectInfo = getSubjectInfo(paper.examType);
            const paperDetails = {
              duration: paper.examType === 'neet' ? '3 hours 20 minutes' : paper.examType === 'iit' ? '3 hours' : '3 hours',
              totalMarks: paper.examType === 'neet' ? '720' : paper.examType === 'iit' ? '300' : '100',
              numQuestions: paper.examType === 'neet' ? '180' : paper.examType === 'iit' ? '75' : '65',
              negativeMarking: paper.examType === 'neet' ? '-1 for wrong answer' : paper.examType === 'iit' ? '-1 for wrong answer' : '-0.33 for wrong answer'
            };

            return (
              <div key={paper.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                {/* Paper Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{paper.paperType}</h2>
                      <p className="text-blue-100">{examName} {paper.year}</p>
                    </div>
                    <div className="flex gap-3">
                      {(paper.hasView || paper.hasDownload || paper.paperUrl) && (
                        <button 
                          onClick={() => handleViewPDF(paper.id, `${examName} ${paper.year} - ${paper.paperType}`)}
                          className="px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Paper
                        </button>
                      )}
                      
                      {paper.hasSolution && (
                        <a 
                          href={`/api/download/${paper.id}?type=solution`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition flex items-center font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          View Solution
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Paper Content */}
                <div className="p-6">
                  {/* Exam Details and Subjects */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Exam Details</h3>
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
                      <h3 className="text-xl font-semibold mb-4">Subjects Covered</h3>
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

                  {/* Topics */}
                  <div className="border-t pt-6 mt-8">
                    <h3 className="text-xl font-semibold mb-4">Important Topics Covered</h3>
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

                  {/* Preparation Tips */}
                  <div className="border-t pt-6 mt-8">
                    <h3 className="text-xl font-semibold mb-4">Preparation Tips</h3>
                    <div className="prose max-w-none text-gray-700">
                      <p>
                        This {examName} {paper.year} paper covers key concepts that you should focus on during your preparation.
                        Here are some tips to effectively utilize this paper:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li>First attempt to solve the paper in the specified time limit without referring to solutions.</li>
                        <li>After completion, calculate your score using the marking scheme provided.</li>
                        <li>For questions you got wrong, thoroughly review the concepts in the solution.</li>
                        <li>Note down difficult questions and concepts to revisit during your revision.</li>
                        <li>Compare with other papers from the same year to identify common patterns.</li>
                      </ul>
                      <p className="mt-4">
                        <strong>Pro Tip:</strong> Create a separate notebook for important formulas and concepts you learned
                        while solving this paper for quick reference during revision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
        <h3 className="text-xl font-semibold mb-2">Preparation Tips for {examName}</h3>
        <p className="text-gray-700 mb-4">
          Studying past papers is crucial for understanding the exam pattern and types of questions asked.
          Here are some tips to make the most out of these papers:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Attempt the papers in timed conditions to improve speed and accuracy</li>
          <li>Analyze your mistakes and focus on weak areas</li>
          <li>Compare your solutions with the official answers provided</li>
          <li>Practice regularly with papers from multiple years to identify patterns</li>
        </ul>
      </div>
    </div>
  );
}
