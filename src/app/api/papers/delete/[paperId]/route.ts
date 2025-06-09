import { NextRequest, NextResponse } from 'next/server';
import { getContainer, getPaperById, deletePaper } from '@/lib/azure';
import { deleteFileFromStorage } from '@/lib/azureStorage';

interface DeleteParams {
  params: Promise<{
    paperId: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: DeleteParams) {
  try {
    const { paperId } = await params;

    if (!paperId) {
      return NextResponse.json(
        { error: 'Paper ID is required' },
        { status: 400 }
      );
    }

    // Check if we're in development mode
    const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true';

    if (isDevelopmentMode) {
      // In development mode, we can't actually delete from Azure
      // But we can simulate the response
      console.log(`🗑️ Development mode: Would delete paper ${paperId}`);
      return NextResponse.json({ 
        message: 'Paper deleted successfully (development mode)',
        paperId 
      });
    }

    // Get the paper details using our improved getPaperById function
    const paper = await getPaperById(paperId);

    if (!paper) {
      console.log(`DELETE /api/papers/delete/[paperId]: Paper not found in Cosmos DB with ID: ${paperId}`);
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }
    
    console.log(`DELETE /api/papers/delete/[paperId]: Found paper to delete: ${paper.id}`);

    // Delete files from Azure Blob Storage
    const deletePromises = [];

    if (paper.paperUrl) {
      console.log(`Deleting paper file: ${paper.paperUrl}`);
      deletePromises.push(deleteFileFromStorage(paper.paperUrl));
    }

    if (paper.solutionUrl) {
      console.log(`Deleting solution file: ${paper.solutionUrl}`);
      deletePromises.push(deleteFileFromStorage(paper.solutionUrl));
    }

    // Wait for all file deletions to complete
    try {
      await Promise.all(deletePromises);
      console.log('All files deleted successfully from blob storage');
    } catch (blobError) {
      console.error('Error deleting files from blob storage:', blobError);
      // Continue with Cosmos DB deletion even if blob deletion fails
      // as the files might already be deleted or the URLs might be invalid
    }

    // Delete the document from Cosmos DB using the improved deletePaper function
    try {
      await deletePaper(paperId);
      console.log(`Paper ${paperId} successfully deleted from Cosmos DB`);
    } catch (deleteError) {
      console.error(`Error during paper deletion process:`, deleteError);
      throw deleteError;
    }

    return NextResponse.json({ 
      message: 'Paper deleted successfully',
      paperId 
    });

  } catch (error) {
    console.error('Error deleting paper:', error);
    
    if (error instanceof Error && error.message.includes('NotFound')) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    );
  }
}
