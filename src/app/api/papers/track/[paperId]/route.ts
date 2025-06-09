import { NextRequest, NextResponse } from 'next/server';
import { updatePaperViewCount } from '@/lib/azure';

// API route to track paper views and downloads
export async function POST(request: NextRequest, { params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  
  if (!paperId) {
    return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
  }
  
  try {
    const { type } = await request.json();
    
    // Check if tracking type is valid
    if (!['view', 'download'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid tracking type' },
        { status: 400 }
      );
    }
    
    // Track view or download
    // In a real app, this would update the database
    if (type === 'view') {
      // In production, this would call the Azure function to track views
      // await updatePaperViewCount(paperId);
      console.log(`View tracked for paper: ${paperId}`);
    } else {
      console.log(`Download tracked for paper: ${paperId}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking paper activity:', error);
    return NextResponse.json(
      { error: 'Failed to track paper activity' },
      { status: 500 }
    );
  }
}
