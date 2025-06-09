// API route for getting a specific paper by ID
import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/azure";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    
    console.log(`GET /api/papers/paper/[paperId]: Fetching paper with ID: ${paperId}`);
    
    if (!paperId) {
      console.log('GET /api/papers/paper/[paperId]: Paper ID is missing');
      return NextResponse.json(
        { error: "Paper ID is required" },
        { status: 400 }
      );
    }
    
    // Check if we're in development mode
    const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true';
    console.log(`GET /api/papers/paper/[paperId]: Development mode: ${isDevelopmentMode}`);

    if (isDevelopmentMode) {
      // In development mode, check global devPapers array
      const papers = (global as any).devPapers || [];
      console.log(`GET /api/papers/paper/[paperId]: Dev papers count: ${papers.length}`);
      
      const paper = papers.find((p: any) => p.id === paperId);
      
      if (!paper) {
        console.log(`GET /api/papers/paper/[paperId]: Paper not found in dev papers`);
        return NextResponse.json(
          { error: 'Paper not found' },
          { status: 404 }
        );
      }
      
      console.log(`GET /api/papers/paper/[paperId]: Found paper in dev papers: ${paper.id}`);
      return NextResponse.json(paper);
    }
    
    // Get the paper from Cosmos DB
    console.log(`GET /api/papers/paper/[paperId]: Fetching paper from Cosmos DB with ID: ${paperId}`);
    const paper = await getPaperById(paperId);
    
    if (!paper) {
      console.log(`GET /api/papers/paper/[paperId]: Paper not found in Cosmos DB`);
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }
    
    console.log(`GET /api/papers/paper/[paperId]: Found paper in Cosmos DB: ${paper.id}`);
    return NextResponse.json(paper);
  } catch (error) {
    console.error(`Error fetching paper:`, error);
    return NextResponse.json(
      { error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}
