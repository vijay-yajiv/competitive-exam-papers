'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import UserStatistics from '@/components/UserStatistics';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access your dashboard.</p>
          <Link 
            href="/auth/signin?callbackUrl=/dashboard" 
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session?.user?.name || 'User'}!</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Favorites Card */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Your Favorites</h2>
                <p className="text-gray-600 mb-4">Access your saved exam papers</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <Link
              href="/favorites"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              View Favorites
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
                <p className="text-gray-600 mb-4">Your recently viewed papers</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600 text-sm">JEE Main 2023 Paper 1 - 2 days ago</li>
              <li className="text-gray-600 text-sm">NEET 2023 Biology - 4 days ago</li>
              <li className="text-gray-600 text-sm">GATE CSE 2023 - 1 week ago</li>
            </ul>
          </div>
        </div>

        {/* Downloads Card */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Downloads</h2>
                <p className="text-gray-600 mb-4">Your downloaded papers</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600 text-sm">JEE Advanced 2023 - 1 day ago</li>
              <li className="text-gray-600 text-sm">NEET 2022 Solutions - 3 days ago</li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="mb-12">
        <UserStatistics />
      </div>
      
      {/* Recommended Papers Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-bold mb-2">IIT-JEE 2023 Paper 2</h3>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Mathematics</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Physics</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Based on your interest in JEE papers</p>
            <Link href="/papers/jee-main-2023-april-session2" className="text-blue-600 hover:text-blue-800 text-sm">View details →</Link>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-bold mb-2">NEET 2023 Biology</h3>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Biology</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Based on your recent activity</p>
            <Link href="/papers/neet-2023-biology" className="text-blue-600 hover:text-blue-800 text-sm">View details →</Link>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-bold mb-2">GATE 2023 CSE</h3>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">Computer Science</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Popular among other users</p>
            <Link href="/papers/gate-2023-cse" className="text-blue-600 hover:text-blue-800 text-sm">View details →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
