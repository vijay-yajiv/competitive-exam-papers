'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserStatistics() {
  const { data: session } = useSession();

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* View All Papers */}
        <Link 
          href="/exams"
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-blue-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Browse Papers</h3>
          <p className="text-sm text-gray-600 mt-1">Explore all available exam papers</p>
        </Link>

        {/* View Favorites */}
        <Link 
          href="/favorites"
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-red-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Your Favorites</h3>
          <p className="text-sm text-gray-600 mt-1">Access your saved papers</p>
        </Link>

        {/* Search Papers */}
        <Link 
          href="/"
          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          <div className="text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-900">Search Papers</h3>
          <p className="text-sm text-gray-600 mt-1">Find specific papers quickly</p>
        </Link>
      </div>
    </div>
  );
}
