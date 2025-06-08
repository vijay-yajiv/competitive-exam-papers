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
    
    // Check if this is a development mode local file
    if (blobUrl.startsWith('/uploads/')) {
      return NextResponse.redirect(new URL(blobUrl, request.url));
    }
    
    // Generate signed URL for Azure blob (valid for 1 hour)
    const signedUrl = await getSignedUrlFromBlobUrl(blobUrl, 1);
    
    // Redirect to the signed URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Error generating signed download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
