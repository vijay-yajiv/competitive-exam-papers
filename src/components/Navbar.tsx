import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow dark:bg-gray-800 mb-8">
      <div className="container mx-auto px-6 py-3">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                Competitive Exam Papers
              </Link>
            </div>
            
            <div className="md:hidden">
              <button 
                type="button" 
                className="block text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="toggle menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:justify-between flex-1">
            <div className="flex flex-col md:flex-row md:mx-6">
              <Link href="/" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Home
              </Link>
              <Link href="/exams" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Browse Exams
              </Link>
              <Link href="#" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                About
              </Link>
              <Link href="#" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
