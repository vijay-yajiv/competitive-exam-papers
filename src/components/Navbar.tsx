'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

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
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="toggle menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:justify-between flex-1">
            <div className="flex flex-col md:flex-row md:mx-6">
              <Link href="/" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Home
              </Link>
              <Link href="/exams" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Browse Exams
              </Link>
              <Link href="/about" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                About
              </Link>
              <Link href="/contact" className="my-1 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0">
                Contact
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center">
              {status === 'authenticated' ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <span className="mr-2 text-sm font-medium text-gray-700">{session.user?.name?.split(' ')[0]}</span>
                    <div className="w-8 h-8 overflow-hidden border-2 border-gray-200 rounded-full">
                      <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20">
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={toggleProfileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={toggleProfileMenu}
                      >
                        Favorites
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          toggleProfileMenu();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-500">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 py-4 mt-4">
              <div className="flex flex-col space-y-4 px-2">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Home
                </Link>
                <Link 
                  href="/exams" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Browse Exams
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Contact
                </Link>
                
                {/* Mobile Auth Links */}
                {status === 'authenticated' ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/favorites" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Favorites
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-left w-full text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/signin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
