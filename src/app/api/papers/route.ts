// API route for getting all exam papers
import { NextRequest, NextResponse } from "next/server";
import { getAllPapers } from "@/lib/azure";

// Type for development storage
declare global {
  var devPapers: any[] | undefined;
}

// Check if we're in development mode
const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
  (!process.env.AZURE_STORAGE_CONNECTION_STRING || !process.env.COSMOS_ENDPOINT);

export async function GET(request: NextRequest) {
  try {
    if (isDevelopmentMode) {
      // Return development papers
      const papers = global.devPapers || [];
      console.log("🚀 Development mode: Returning", papers.length, "papers");
      return NextResponse.json(papers);
    } else {
      // Use Azure Cosmos DB
      const papers = await getAllPapers();
      return NextResponse.json(papers);
    }
  } catch (error) {
    console.error("Error fetching exam papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam papers" },
      { status: 500 }
    );
  }
}
