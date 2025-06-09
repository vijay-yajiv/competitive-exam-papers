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

    // Validate Azure configuration
    const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
    const cosmosKey = process.env.COSMOS_KEY;
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const databaseName = process.env.AZURE_COSMOS_DATABASE_NAME || 'ExamPapersDB';
    const containerName = process.env.AZURE_COSMOS_CONTAINER_NAME || 'Papers';

    if (!cosmosEndpoint || !cosmosKey || !storageConnectionString) {
      return NextResponse.json({
        error: 'Missing Azure configuration',
        details: 'Please check COSMOS_ENDPOINT, COSMOS_KEY, and AZURE_STORAGE_CONNECTION_STRING environment variables'
      }, { status: 500 });
    }

    // Initialize Azure clients
    const cosmosClient = new CosmosClient({
      endpoint: cosmosEndpoint,
      key: cosmosKey,
    });

    const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);

    // Get Cosmos DB data
    const database = cosmosClient.database(databaseName);
    const container = database.container(containerName);
    
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
        endpoint: cosmosEndpoint,
        database: databaseName,
        container: containerName,
        documentsCount: papers.length,
        documents: papers.map(paper => ({
          id: paper.id,
          title: paper.title,
          examType: paper.examType,
          year: paper.year,
          paperType: paper.paperType,
          createdAt: paper.createdAt,
          uploadDate: paper.uploadDate,
          paperUrl: paper.paperUrl,
          solutionUrl: paper.solutionUrl,
          hasSolution: !!paper.solutionUrl
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
