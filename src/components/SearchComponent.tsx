'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Mock search function - in a real app, this would search your database or API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results based on query
      const mockResults = [
        { 
          id: 1, 
          name: 'IIT-JEE 2023 Paper 1',
          examType: 'iit',
          year: '2023',
          subject: 'Physics, Chemistry' 
        },
        { 
          id: 2, 
          name: 'IIT-JEE 2022 Paper 2',
          examType: 'iit',
          year: '2022',
          subject: 'Mathematics' 
        },
        { 
          id: 3, 
          name: 'NEET 2023 Biology',
          examType: 'neet',
          year: '2023',
          subject: 'Biology' 
        },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.subject.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for exam papers by name, year or subject..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isSearching ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : 'Search'}
        </button>
      </form>
      
      {searchResults.length > 0 && (
        <div className="mt-6 border rounded-lg overflow-hidden shadow-sm">
          <h3 className="bg-gray-50 px-4 py-2 font-medium border-b">Search Results ({searchResults.length})</h3>
          <ul className="divide-y">
            {searchResults.map((result) => (
              <li key={result.id} className="p-4 hover:bg-gray-50">
                <Link 
                  href={`/exams/${result.examType}/${result.year}`}
                  className="block"
                >
                  <h4 className="font-medium text-blue-600">{result.name}</h4>
                  <p className="text-sm text-gray-500">Subject: {result.subject}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {query && searchResults.length === 0 && !isSearching && (
        <div className="mt-4 text-center py-8 border rounded-lg">
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm mt-2">Try different keywords or check spelling</p>
        </div>
      )}
    </div>
  );
}
