// API route for getting papers by exam type and year
import { NextRequest, NextResponse } from "next/server";
import { getPapersByExamTypeAndYear } from "@/lib/azure";

export async function GET(
  request: NextRequest,
  { params }: { params: { examType: string; year: string } }
) {
  try {
    const { examType, year } = params;
    
    // Validate params
    if (!examType || !year) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    const papers = await getPapersByExamTypeAndYear(examType, year);
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching exam papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam papers" },
      { status: 500 }
    );
  }
}
