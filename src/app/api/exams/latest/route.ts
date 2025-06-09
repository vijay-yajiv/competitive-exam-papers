// API route for getting latest exam papers
import { NextRequest, NextResponse } from "next/server";
import { getAllPapers } from "@/lib/azure";

// Check if we're in development mode
const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
  (!process.env.AZURE_STORAGE_CONNECTION_STRING || !process.env.COSMOS_ENDPOINT);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (isDevelopmentMode) {
      // Return development papers
      const papers = global.devPapers || [];
      const latestPapers = getLatestPapers(papers, limit);
      console.log("🚀 Development mode: Returning", latestPapers.length, "latest papers");
      return NextResponse.json(latestPapers);
    } else {
      // Use Azure Cosmos DB
      const papers = await getAllPapers();
      const latestPapers = getLatestPapers(papers, limit);
      return NextResponse.json(latestPapers);
    }
  } catch (error) {
    console.error("Error fetching latest exam papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest exam papers" },
      { status: 500 }
    );
  }
}

function getLatestPapers(papers: any[], limit: number) {
  // Sort papers by year (descending) and then by upload date if available
  const sortedPapers = papers.sort((a, b) => {
    // First sort by year
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;
    
    // Then by upload date if available
    if (a.uploadDate && b.uploadDate) {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
    
    return 0;
  });

  // Get the latest year
  const latestYear = sortedPapers.length > 0 ? sortedPapers[0].year : '2023';
  
  // Filter papers from the latest year and group by exam type
  const latestYearPapers = sortedPapers.filter(paper => paper.year === latestYear);
  
  // Group by exam type to get one representative paper per exam type
  const examTypeGroups = latestYearPapers.reduce((acc, paper) => {
    if (!acc[paper.examType]) {
      acc[paper.examType] = paper;
    }
    return acc;
  }, {} as Record<string, any>);

  return Object.values(examTypeGroups).slice(0, limit);
}
