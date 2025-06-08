import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Simple in-memory storage for favorites (in production, use a database)
const userFavorites = new Map<string, Set<string>>();

// API route for handling user favorites
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'You must be logged in to manage favorites' },
      { status: 401 }
    );
  }
  
  try {
    const { paperId } = await request.json();
    
    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would add the paper to the user's favorites in your database
    const userId = session.user.id || session.user.email || 'anonymous';
    
    // Get or create user's favorites set
    if (!userFavorites.has(userId)) {
      userFavorites.set(userId, new Set());
    }
    
    const favorites = userFavorites.get(userId)!;
    favorites.add(paperId);
    
    console.log(`Adding paper ${paperId} to favorites for user ${userId}`);
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Paper added to favorites' 
    });
  } catch (error) {
    console.error('Error adding paper to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add paper to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'You must be logged in to manage favorites' },
      { status: 401 }
    );
  }
  
  try {
    const { paperId } = await request.json();
    
    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, this would remove the paper from the user's favorites in your database
    const userId = session.user.id || session.user.email || 'anonymous';
    
    // Get user's favorites set
    if (userFavorites.has(userId)) {
      const favorites = userFavorites.get(userId)!;
      favorites.delete(paperId);
    }
    
    console.log(`Removing paper ${paperId} from favorites for user ${userId}`);
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Paper removed from favorites' 
    });
  } catch (error) {
    console.error('Error removing paper from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove paper from favorites' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's favorites or check if a specific paper is favorited
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'You must be logged in to view favorites' },
      { status: 401 }
    );
  }
  
  try {
    const url = new URL(request.url);
    const paperId = url.searchParams.get('paperId');
    const userId = session.user.id || session.user.email || 'anonymous';
    
    const userFavs = userFavorites.get(userId) || new Set();
    
    if (paperId) {
      // Check if specific paper is favorited
      return NextResponse.json({ 
        isFavorited: userFavs.has(paperId)
      });
    } else {
      // Return all favorites
      return NextResponse.json({ 
        favorites: Array.from(userFavs)
      });
    }
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve favorites' },
      { status: 500 }
    );
  }
}
