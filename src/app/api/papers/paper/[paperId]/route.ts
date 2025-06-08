// API route for getting a specific paper by ID
import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/azure";

export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const { paperId } = params;
    
    if (!paperId) {
      return NextResponse.json(
        { error: "Paper ID is required" },
        { status: 400 }
      );
    }
    
    const paper = await getPaperById(paperId);
    
    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(paper);
  } catch (error) {
    console.error(`Error fetching paper with ID ${params.paperId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}
