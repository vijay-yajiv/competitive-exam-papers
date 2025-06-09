'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PaperCard from '@/components/PaperCard';
import { ExamPaper } from '@/types/examPaper';

// PDF Viewer Component
interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="flex-1 p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full border rounded"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

// Get user's favorite papers from API
const getFavoritePapers = async (): Promise<ExamPaper[]> => {
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
  const [pdfViewer, setPdfViewer] = useState<{ url: string; title: string } | null>(null);

  // Function to handle PDF viewing inline
  const handleViewPDF = async (paperId: string, paperTitle: string) => {
    try {
      // Use the new PDF view API that handles SAS tokens properly
      const response = await fetch(`/api/view-pdf/${paperId}?type=paper`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('PDF view API error:', error);
        alert('Unable to load PDF. Please try again.');
        return;
      }
      
      const data = await response.json();
      
      // For external URLs, open in new tab instead of iframe to avoid CORS issues
      if (data.external) {
        window.open(data.pdfUrl, '_blank');
        return;
      }
      
      // For Azure blob URLs with SAS tokens, use iframe viewer
      setPdfViewer({ url: data.pdfUrl, title: data.title });
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Unable to load PDF. Please try again.');
    }
  };

  const closePDFViewer = () => {
    setPdfViewer(null);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const papers = await getFavoritePapers();
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
      {pdfViewer && (
        <PDFViewer
          pdfUrl={pdfViewer.url}
          title={pdfViewer.title}
          onClose={closePDFViewer}
        />
      )}
      
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
              hasView={paper.hasView}
              hasSolution={paper.hasSolution}
              paperUrl={paper.paperUrl}
              solutionUrl={paper.solutionUrl}
              subjects={paper.subjects}
              views={paper.views}
              isFavorited={true}
              onViewPaper={(paperId, paperTitle) => handleViewPDF(paperId, paperTitle)}
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
