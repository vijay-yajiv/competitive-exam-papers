import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* New Papers Alert */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">New!</span> 2023 exam papers for IIT-JEE, NEET, and GATE are now available. 
                <Link href="/exams" className="font-bold text-yellow-700 underline ml-1">Check them out</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center py-16 px-4">
        <h1 className="text-5xl font-bold mb-6">Competitive Exam Papers</h1>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Ace Your Competitive Exams</h2>
        <p className="text-xl mb-10 text-gray-600 max-w-3xl mx-auto">
          Your one-stop destination for previous years' IIT, NEET, and other competitive exam papers sorted by exam type and year.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/exams" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
          >
            Browse All Papers
          </Link>
          <Link 
            href="#featured-exams" 
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
          >
            Explore Features
          </Link>
        </div>
      </section>
      
      {/* Featured Exams Section */}
      <section id="featured-exams" className="w-full max-w-6xl py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Exam Papers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="h-2 bg-blue-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">IIT-JEE Papers</h3>
              <p className="text-gray-600 mb-6">Access comprehensive collections of previous years' IIT-JEE papers sorted by year.</p>
              <Link 
                href="/exams"
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                Browse Papers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="h-2 bg-green-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">NEET Papers</h3>
              <p className="text-gray-600 mb-6">Find comprehensive collections of previous years' NEET exam papers organized by year.</p>
              <Link 
                href="/exams"
                className="text-green-600 font-medium hover:text-green-800 flex items-center"
              >
                Browse Papers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="h-2 bg-purple-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">GATE Papers</h3>
              <p className="text-gray-600 mb-6">Access previous years' GATE exam papers for various engineering disciplines.</p>
              <Link 
                href="/exams"
                className="text-purple-600 font-medium hover:text-purple-800 flex items-center"
              >
                Browse Papers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full max-w-6xl py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Use Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organized Collection</h3>
            <p className="text-gray-600">All exam papers are systematically organized by exam type and year for easy navigation.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Downloads</h3>
            <p className="text-gray-600">Download papers and solutions with a single click in PDF format for offline study.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete Solutions</h3>
            <p className="text-gray-600">Access detailed solutions with step-by-step explanations for better understanding.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-gray-50 border-t border-gray-200 mt-16 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold mb-4">Competitive Exam Papers</h3>
              <p className="text-gray-600 mb-4">Your one-stop destination for previous years' competitive exam papers.</p>
              <p className="text-gray-600">© {new Date().getFullYear()} Competitive Exam Papers. All rights reserved.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
                <li><Link href="/exams" className="text-gray-600 hover:text-blue-600">Browse Exams</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Exams</h4>
              <ul className="space-y-2">
                <li><Link href="/exams/iit/2023" className="text-gray-600 hover:text-blue-600">IIT-JEE</Link></li>
                <li><Link href="/exams/neet/2023" className="text-gray-600 hover:text-blue-600">NEET</Link></li>
                <li><Link href="/exams/gate/2023" className="text-gray-600 hover:text-blue-600">GATE</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
