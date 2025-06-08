import React from 'react';
import Link from 'next/link';
import SearchComponent from '@/components/SearchComponent';

export default function ExamsPage() {
  const examTypes = [
    { name: 'IIT-JEE', id: 'iit', years: ["2023", "2022", "2021", "2020", "2019"], 
      description: "The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India.",
      color: "bg-blue-600" 
    },
    { name: 'NEET', id: 'neet', years: ["2023", "2022", "2021", "2020", "2019"],
      description: "The National Eligibility cum Entrance Test (NEET) is the entrance examination for medical and dental colleges across India.",
      color: "bg-green-600" 
    },
    { name: 'GATE', id: 'gate', years: ["2023", "2022", "2021", "2020", "2019"],
      description: "The Graduate Aptitude Test in Engineering (GATE) is an examination for admission to postgraduate programs in engineering and science.",
      color: "bg-purple-600" 
    },
  ];

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
        {examTypes.map((exam) => (
          <div key={exam.id} className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className={`h-2 ${exam.color}`}></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3">{exam.name}</h2>
              <p className="mb-6 text-gray-600">
                {exam.description}
              </p>
              
              <h3 className="text-lg font-medium mb-3">Available Years:</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {exam.years.map((year) => (
                  <Link 
                    href={`/exams/${exam.id}/${year}`} 
                    key={`${exam.id}-${year}`}
                    className="px-4 py-1 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition text-sm font-medium"
                  >
                    {year}
                  </Link>
                ))}
              </div>
              
              <Link 
                href={`/exams/${exam.id}/${exam.years[0]}`} 
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
              >
                Browse Latest Papers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New 2023 Papers Section */}
      <div className="mb-12 border-2 border-yellow-400 bg-yellow-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <span className="bg-yellow-400 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">NEW</span>
          <h2 className="text-2xl font-bold">Latest 2023 Papers Now Available!</h2>
        </div>
        <p className="text-gray-700 mb-4">
          We've just added the latest 2023 question papers for IIT-JEE, NEET, and GATE exams. 
          These papers include detailed solutions to help you in your preparation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <Link href="/exams/iit/2023" className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">IIT-JEE 2023 Papers</span>
          </Link>
          <Link href="/exams/neet/2023" className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">NEET 2023 Papers</span>
          </Link>
          <Link href="/exams/gate/2023" className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">GATE 2023 Papers</span>
          </Link>
        </div>
      </div>
      
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
