'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type PaperStat = {
  id: string;
  name: string;
  downloads: number;
  views: number;
};

type ExamStat = {
  name: string;
  papers: number;
  downloads: number;
  views: number;
};

export default function AdminAnalytics() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [topPapers, setTopPapers] = useState<PaperStat[]>([]);
  const [examStats, setExamStats] = useState<ExamStat[]>([]);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // In a real app, fetch these stats from your API
    // For demonstration, we'll use mock data
    const mockTopPapers = [
      { id: 'jee-main-2023-jan-session1', name: 'IIT-JEE Main 2023 (Jan)', downloads: 245, views: 1254 },
      { id: 'neet-2023-paper', name: 'NEET 2023', downloads: 189, views: 987 },
      { id: 'gate-2023-cse', name: 'GATE 2023 CSE', downloads: 176, views: 856 },
      { id: 'jee-advanced-2023', name: 'IIT-JEE Advanced 2023', downloads: 152, views: 723 },
      { id: 'neet-2022-paper', name: 'NEET 2022', downloads: 98, views: 542 }
    ];
    
    const mockExamStats = [
      { name: 'IIT-JEE', papers: 15, downloads: 782, views: 3241 },
      { name: 'NEET', papers: 10, downloads: 645, views: 2198 },
      { name: 'GATE', papers: 12, downloads: 521, views: 1876 }
    ];
    
    setTopPapers(mockTopPapers);
    setExamStats(mockExamStats);
    setTotalDownloads(1948);
    setTotalViews(7315);
    setTotalUsers(324);
    setIsLoading(false);
  }, []);

  if (!session?.user) {
    return (
      <div className="bg-white border rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">You need to be an administrator to view these analytics.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        <select className="border rounded-md px-3 py-1 text-sm">
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-500 mb-1">Total Paper Views</h3>
          <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-500 mb-1">Total Views</h3>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-500 mb-1">Registered Users</h3>
          <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Papers */}
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Most Viewed Papers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Paper</th>
                  <th className="text-center py-2 font-medium text-gray-500">Paper Views</th>
                  <th className="text-center py-2 font-medium text-gray-500">Page Views</th>
                </tr>
              </thead>
              <tbody>
                {topPapers.map((paper) => (
                  <tr key={paper.id} className="border-b">
                    <td className="py-2">
                      <Link href={`/papers/${paper.id}`} className="text-blue-600 hover:underline">
                        {paper.name}
                      </Link>
                    </td>
                    <td className="text-center py-2">{paper.downloads}</td>
                    <td className="text-center py-2">{paper.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Exam Stats */}
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Exam Type Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Exam</th>
                  <th className="text-center py-2 font-medium text-gray-500">Papers</th>
                  <th className="text-center py-2 font-medium text-gray-500">Paper Views</th>
                  <th className="text-center py-2 font-medium text-gray-500">Page Views</th>
                </tr>
              </thead>
              <tbody>
                {examStats.map((exam) => (
                  <tr key={exam.name} className="border-b">
                    <td className="py-2">{exam.name}</td>
                    <td className="text-center py-2">{exam.papers}</td>
                    <td className="text-center py-2">{exam.downloads}</td>
                    <td className="text-center py-2">{exam.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-medium text-gray-800 mb-3">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="text-sm text-gray-600">
            New paper uploaded: GATE CSE 2023 - 1 day ago
          </li>
          <li className="text-sm text-gray-600">
            User registration spike: 24 new users - 2 days ago
          </li>
          <li className="text-sm text-gray-600">
            Peak download time: 3PM-6PM (58% of downloads) - weekly trend
          </li>
        </ul>
      </div>
    </div>
  );
}
