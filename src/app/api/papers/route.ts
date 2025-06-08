// API route for getting all exam papers
import { NextRequest, NextResponse } from "next/server";
import { getAllPapers } from "@/lib/azure";

export async function GET(request: NextRequest) {
  try {
    const papers = await getAllPapers();
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error fetching exam papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam papers" },
      { status: 500 }
    );
  }
}
