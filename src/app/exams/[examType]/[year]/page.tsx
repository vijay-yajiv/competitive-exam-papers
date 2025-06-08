import React from 'react';
import Link from 'next/link';
import PaperCard from '@/components/PaperCard';
import { examPapers } from '@/data/examPapers';

export default async function ExamYearPage({ params }: { params: Promise<{ examType: string, year: string }> }) {
  const { examType, year } = await params;
  
  // Get papers for this exam type and year
  const papers = examPapers.filter(
    paper => paper.examType === examType && paper.year === year
  );
  
  // This would typically come from your database or API
  const examName = examType === 'iit' ? 'IIT-JEE' : 
                   examType === 'neet' ? 'NEET' : 
                   examType === 'gate' ? 'GATE' : examType.toUpperCase();
  
  return (
    <div className="container mx-auto p-8">
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
        
        <div className="hidden md:block">
          <select className="px-4 py-2 border rounded-md bg-white">
            <option value="">Filter by Subject</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
            {examType === 'neet' && <option value="biology">Biology</option>}
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <PaperCard 
              key={paper.id}
              id={paper.id}
              examType={paper.examType}
              year={paper.year}
              paperType={paper.paperType}
              hasDownload={paper.hasDownload}
              hasSolution={paper.hasSolution}
              paperUrl={paper.paperUrl}
              solutionUrl={paper.solutionUrl}
              subjects={paper.subjects}
              views={paper.views}
            />
          ))
        ) : (
          <div className="col-span-2 text-center p-8 border rounded-lg">
            <h2 className="text-xl font-medium text-gray-500">No papers available for {examName} {year}</h2>
            <p className="mt-2 text-gray-400">Please check back later or try another year</p>
          </div>
        )}
      </div>
      
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
