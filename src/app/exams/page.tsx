'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchComponent from '@/components/SearchComponent';

interface ExamMetadata {
  examType: string;
  name: string;
  years: string[];
  totalPapers: number;
  description: string;
  color: string;
  latestYear: string;
}

interface LatestPaper {
  id: string;
  examType: string;
  year: string;
  paperType: string;
  paperUrl: string;
  solutionUrl?: string;
  hasView: boolean;
  hasSolution: boolean;
}

export default function ExamsPage() {
  const [examTypes, setExamTypes] = useState<ExamMetadata[]>([]);
  const [latestPapers, setLatestPapers] = useState<LatestPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['iit', 'gate', 'neet']));

  // Define comprehensive year ranges for each exam type
  const examYearRanges: Record<string, string[]> = {
    iit: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    neet: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    gate: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    upsc: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    cat: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examResponse, latestResponse] = await Promise.all([
          fetch('/api/exams/metadata'),
          fetch('/api/exams/latest?limit=3')
        ]);

        // Define core exam types that should always be visible
        const coreExamTypes: ExamMetadata[] = [
          { 
            examType: 'iit', 
            name: 'IIT-JEE', 
            years: [], 
            totalPapers: 0,
            description: "The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India.",
            color: "bg-blue-600",
            latestYear: "2025"
          },
          { 
            examType: 'neet', 
            name: 'NEET', 
            years: [], 
            totalPapers: 0,
            description: "The National Eligibility cum Entrance Test (NEET) is the entrance examination for medical and dental colleges across India.",
            color: "bg-green-600",
            latestYear: "2025"
          },
          { 
            examType: 'gate', 
            name: 'GATE', 
            years: [], 
            totalPapers: 0,
            description: "The Graduate Aptitude Test in Engineering (GATE) is an examination for admission to postgraduate programs in engineering and science.",
            color: "bg-purple-600",
            latestYear: "2025"
          }
        ];

        let finalExamTypes = [...coreExamTypes];

        if (examResponse.ok) {
          const examData = await examResponse.json();
          
          // Merge API data with core exam types, prioritizing API data
          finalExamTypes = coreExamTypes.map(coreExam => {
            const apiExam = examData.find((exam: ExamMetadata) => exam.examType === coreExam.examType);
            return apiExam || coreExam;
          });

          // Add any additional exam types from API that aren't in core types
          const additionalExams = examData.filter((exam: ExamMetadata) => 
            !coreExamTypes.some(coreExam => coreExam.examType === exam.examType)
          );
          finalExamTypes.push(...additionalExams);
        }

        setExamTypes(finalExamTypes);

        if (latestResponse.ok) {
          const latestData = await latestResponse.json();
          setLatestPapers(latestData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // If everything fails, use fallback core exam types
        setExamTypes([
          { 
            examType: 'iit', 
            name: 'IIT-JEE', 
            years: [], 
            totalPapers: 0,
            description: "The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India.",
            color: "bg-blue-600",
            latestYear: "2025"
          },
          { 
            examType: 'neet', 
            name: 'NEET', 
            years: [], 
            totalPapers: 0,
            description: "The National Eligibility cum Entrance Test (NEET) is the entrance examination for medical and dental colleges across India.",
            color: "bg-green-600",
            latestYear: "2025"
          },
          { 
            examType: 'gate', 
            name: 'GATE', 
            years: [], 
            totalPapers: 0,
            description: "The Graduate Aptitude Test in Engineering (GATE) is an examination for admission to postgraduate programs in engineering and science.",
            color: "bg-purple-600",
            latestYear: "2025"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCard = (examType: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(examType)) {
        newSet.delete(examType);
      } else {
        newSet.add(examType);
      }
      return newSet;
    });
  };

  const isYearAvailable = (examType: string, year: string): boolean => {
    const exam = examTypes.find(e => e.examType === examType);
    return exam ? exam.years.includes(year) : false;
  };

  // Get the latest year from available data
  const latestYear = examTypes.length > 0 ? 
    Math.max(...examTypes.flatMap(exam => exam.years.map(year => parseInt(year)))).toString() :
    '2023';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Competitive Exam Papers</h1>
      
      {/* Search Component */}
      <div className="mb-12">
        <SearchComponent />
      </div>
      
      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <button className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          All Exams
        </button>
        <button className="px-5 py-2 bg-white border text-gray-700 rounded-full hover:bg-gray-50 transition">
          Engineering
        </button>
        <button className="px-5 py-2 bg-white border text-gray-700 rounded-full hover:bg-gray-50 transition">
          Medical
        </button>
        <button className="px-5 py-2 bg-white border text-gray-700 rounded-full hover:bg-gray-50 transition">
          Recent Papers
        </button>
      </div>
      
      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {examTypes.map((exam) => {
          const isExpanded = expandedCards.has(exam.examType);
          const availableYears = examYearRanges[exam.examType] || exam.years;
          
          return (
            <div key={exam.examType} className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className={`h-2 ${exam.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold">{exam.name}</h2>
                  <button
                    onClick={() => toggleCard(exam.examType)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <p className="mb-6 text-gray-600">
                  {exam.description}
                </p>
                
                {isExpanded && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {exam.totalPapers > 0 ? 
                        `Available Years (${exam.totalPapers} papers):` : 
                        'Years (No papers available yet):'
                      }
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {availableYears.map((year) => {
                        const isAvailable = isYearAvailable(exam.examType, year);
                        return (
                          <div key={`${exam.examType}-${year}`}>
                            {isAvailable ? (
                              <Link 
                                href={`/exams/${exam.examType}/${year}`}
                                className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition text-sm font-medium"
                              >
                                {year}
                              </Link>
                            ) : (
                              <span className="px-4 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-medium cursor-not-allowed">
                                {year}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {exam.totalPapers === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-2">No papers uploaded yet</p>
                        <p className="text-sm text-gray-400">Papers will be available soon!</p>
                      </div>
                    ) : (
                      <Link 
                        href={`/exams/${exam.examType}/${exam.latestYear}`} 
                        className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
                      >
                        Browse Latest Papers
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    )}
                  </div>
                )}
                
                {!isExpanded && (
                  <div className="text-center">
                    <button 
                      onClick={() => toggleCard(exam.examType)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Years & Papers
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Papers Section */}
      {latestPapers.length > 0 && (
        <div className="mb-12 border-2 border-yellow-400 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-400 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">NEW</span>
            <h2 className="text-2xl font-bold">Latest {latestYear} Papers Now Available!</h2>
          </div>
          <p className="text-gray-700 mb-4">
            We've just added the latest {latestYear} question papers for various competitive exams. 
            These papers include detailed solutions to help you in your preparation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {latestPapers.map((paper) => {
              const examConfig = examTypes.find(exam => exam.examType === paper.examType);
              const examName = examConfig?.name || paper.examType.toUpperCase();
              const colorClass = examConfig?.color.replace('bg-', 'text-') || 'text-gray-600';
              
              return (
                <Link 
                  key={paper.id} 
                  href={`/exams/${paper.examType}/${paper.year}`} 
                  className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colorClass} mr-2`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{examName} {paper.year} Papers</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">Exam Preparation Tips</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Study Past Papers</h3>
            <p className="text-gray-700">Analyzing previous years' question papers helps understand the exam pattern and important topics.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Time Management</h3>
            <p className="text-gray-700">Practice solving papers within the time limit to improve your speed and accuracy during the actual exam.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Focus on Solutions</h3>
            <p className="text-gray-700">Don't just solve questions, understand the solution methodology to improve your problem-solving skills.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
