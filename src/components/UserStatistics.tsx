'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type DownloadStats = {
  name: string;
  count: number;
  percentage: number;
};

type ViewStats = {
  month: string;
  views: number;
};

export default function UserStatistics() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [downloadStats, setDownloadStats] = useState<DownloadStats[]>([]);
  const [viewStats, setViewStats] = useState<ViewStats[]>([]);

  useEffect(() => {
    // In a real app, fetch these stats from your API
    // For demonstration, we'll use mock data
    const mockDownloadStats = [
      { name: 'NEET', count: 8, percentage: 40 },
      { name: 'IIT-JEE', count: 7, percentage: 35 },
      { name: 'GATE', count: 5, percentage: 25 }
    ];
    
    const mockViewStats = [
      { month: 'Jan', views: 10 },
      { month: 'Feb', views: 15 },
      { month: 'Mar', views: 12 },
      { month: 'Apr', views: 18 },
      { month: 'May', views: 22 },
      { month: 'Jun', views: 26 }
    ];
    
    setDownloadStats(mockDownloadStats);
    setViewStats(mockViewStats);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Your Activity</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Download Statistics */}
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Downloads by Exam Type</h3>
          <div className="space-y-4">
            {downloadStats.map(stat => (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{stat.name}</span>
                  <span>{stat.count} papers</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* View Statistics */}
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Monthly Paper Views</h3>
          <div className="flex items-end h-40 gap-1">
            {viewStats.map(stat => (
              <div key={stat.month} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${(stat.views / 30) * 100}%` }}
                ></div>
                <span className="text-xs mt-1">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-medium text-gray-800 mb-3">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="text-sm text-gray-600 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            You downloaded NEET 2023 Paper - 2 days ago
          </li>
          <li className="text-sm text-gray-600 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            You favorited IIT-JEE 2022 Paper 2 - 3 days ago
          </li>
          <li className="text-sm text-gray-600 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            You viewed GATE CSE 2023 Paper - 5 days ago
          </li>
        </ul>
      </div>
    </div>
  );
}
