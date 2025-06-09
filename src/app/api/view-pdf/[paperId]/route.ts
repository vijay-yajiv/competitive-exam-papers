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
    
    console.log(`PDF view request for paper ${paperId}, type: ${type}`);
    
    // Get paper details from database
    const paper = await getPaperById(paperId);
    if (!paper) {
      console.log(`Paper ${paperId} not found`);
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    // Get the appropriate URL
    const blobUrl = type === 'solution' ? paper.solutionUrl : paper.paperUrl;
    if (!blobUrl) {
      console.log(`${type} not found for paper ${paperId}`);
      return NextResponse.json(
        { error: `${type} not found for this paper` },
        { status: 404 }
      );
    }

    console.log(`Original blob URL: ${blobUrl}`);

    // Check if this is an Azure blob URL that needs a SAS token
    if (blobUrl.includes('.blob.core.windows.net') && blobUrl.includes('/exam-papers/')) {
      try {
        // Generate signed URL for secure access
        const signedUrl = await getSignedUrlFromBlobUrl(blobUrl, 1); // 1 hour expiry
        console.log(`Generated signed URL for PDF viewing`);
        
        // Return the signed URL as JSON so it can be used in iframe
        return NextResponse.json({ 
          pdfUrl: signedUrl,
          type,
          title: `${paper.examType.toUpperCase()} ${paper.year} - ${paper.paperType}`
        });
      } catch (error) {
        console.error(`Error generating signed URL for ${blobUrl}:`, error);
        return NextResponse.json(
          { error: "Failed to generate secure access URL" },
          { status: 500 }
        );
      }
    }

    // For external URLs (like embibe.com), return as-is
    console.log(`Returning external URL: ${blobUrl}`);
    return NextResponse.json({ 
      pdfUrl: blobUrl,
      type,
      title: `${paper.examType.toUpperCase()} ${paper.year} - ${paper.paperType}`,
      external: true
    });

  } catch (error) {
    console.error("Error in PDF view API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
