import { NextRequest, NextResponse } from "next/server";
import { getPaperById } from "@/lib/azure";
import { getSignedUrlFromBlobUrl } from "@/lib/azureStorage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'paper'; // 'paper' or 'solution'
    
    // Get paper details from database
    const paper = await getPaperById(paperId);
    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }
    
    // Get the appropriate URL
    const blobUrl = type === 'solution' ? paper.solutionUrl : paper.paperUrl;
    if (!blobUrl) {
      return NextResponse.json(
        { error: `${type} not found for this paper` },
        { status: 404 }
      );
    }
    
    // Check if this is an Azure blob URL that needs a SAS token
    if (blobUrl.includes('.blob.core.windows.net') && blobUrl.includes('/exam-papers/')) {
      try {
        // Generate signed URL for secure access
        const signedUrl = await getSignedUrlFromBlobUrl(blobUrl, 1); // 1 hour expiry
        console.log(`Generated signed URL for download`);
        
        // Redirect to the signed URL for download
        return NextResponse.redirect(signedUrl);
      } catch (error) {
        console.error(`Error generating signed URL for ${blobUrl}:`, error);
        return NextResponse.json(
          { error: "Failed to generate secure download URL" },
          { status: 500 }
        );
      }
    }
    
    // For external URLs (like embibe.com), redirect directly
    return NextResponse.redirect(blobUrl);
  } catch (error) {
    console.error("Error in download API:", error);
    return NextResponse.json(
      { error: "Failed to process download request" },
      { status: 500 }
    );
  }
}
