'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PaperCard from '@/components/PaperCard';
import { ExamPaper } from '@/types/examPaper';

// Get user's favorite papers from API
const getFavoritePapers = async (userId: string): Promise<ExamPaper[]> => {
  try {
    const response = await fetch('/api/favorites');
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    const data = await response.json();
    const favoriteIds = data.favorites || [];
    
    // Get paper details from examPapers data based on favorited IDs
    const { examPapers } = await import('@/data/examPapers');
    return examPapers.filter(paper => favoriteIds.includes(paper.id));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<ExamPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const papers = await getFavoritePapers(session.user.id);
          setFavorites(papers);
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [session, status]);

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your favorites</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access your favorite papers.</p>
          <Link 
            href="/auth/signin?callbackUrl=/favorites" 
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
      <h1 className="text-3xl font-bold mb-8">Your Favorite Papers</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {favorites.map(paper => (
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
              isFavorited={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">
            You don't have any favorite papers yet. Browse our collection and add some to your favorites!
          </p>
          <Link 
            href="/exams" 
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Browse Exam Papers
          </Link>
        </div>
      )}
    </div>
  );
}
