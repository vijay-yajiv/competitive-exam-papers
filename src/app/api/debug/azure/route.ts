import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';
import { BlobServiceClient } from '@azure/storage-blob';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in development mode
    const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true';
    
    if (isDevelopmentMode) {
      return NextResponse.json({
        mode: 'development',
        message: 'Running in development mode - no Azure data to show',
        localStorage: 'Data is stored in browser localStorage'
      });
    }

    // Initialize Azure clients
    const cosmosClient = new CosmosClient({
      endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
      key: process.env.AZURE_COSMOS_KEY!,
    });

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );

    // Get Cosmos DB data
    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE_NAME!);
    const container = database.container(process.env.AZURE_COSMOS_CONTAINER_NAME!);
    
    const { resources: papers } = await container.items
      .query('SELECT * FROM c ORDER BY c._ts DESC')
      .fetchAll();

    // Get Blob Storage data
    const containerClient = blobServiceClient.getContainerClient('exam-papers');
    const blobs = [];
    
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();
      
      blobs.push({
        name: blob.name,
        size: properties.contentLength,
        lastModified: properties.lastModified,
        contentType: properties.contentType,
        url: blobClient.url
      });
    }

    return NextResponse.json({
      mode: 'production',
      cosmosDB: {
        endpoint: process.env.AZURE_COSMOS_ENDPOINT,
        database: process.env.AZURE_COSMOS_DATABASE_NAME,
        container: process.env.AZURE_COSMOS_CONTAINER_NAME,
        documentsCount: papers.length,
        documents: papers.map(paper => ({
          id: paper.id,
          title: paper.title,
          examType: paper.examType,
          year: paper.year,
          createdAt: paper.createdAt,
          paperUrl: paper.paperUrl,
          solutionUrl: paper.solutionUrl
        }))
      },
      blobStorage: {
        containerName: 'exam-papers',
        blobsCount: blobs.length,
        blobs: blobs
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch Azure data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
