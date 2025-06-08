// Azure Blob Storage Configuration
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

// Azure Blob Storage configuration
const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = "exam-papers";

// Get Azure Storage Blob service client
const getBlobServiceClient = () => {
  return BlobServiceClient.fromConnectionString(azureStorageConnectionString);
};

// Get the container client
export const getContainerClient = (): ContainerClient => {
  const blobServiceClient = getBlobServiceClient();
  return blobServiceClient.getContainerClient(containerName);
};

// Create container if it doesn't exist
export const createContainerIfNotExists = async (): Promise<void> => {
  try {
    const containerClient = getContainerClient();
    await containerClient.createIfNotExists({
      access: "blob" // This makes blobs public readable
    });
    console.log(`Container '${containerName}' created or already exists`);
  } catch (error) {
    console.error(`Error creating container '${containerName}':`, error);
    throw error;
  }
};

// Upload a file to Azure Blob Storage
export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    await createContainerIfNotExists();
    const containerClient = getContainerClient();
    
    // Create unique blob name to avoid overwrites
    const timestamp = new Date().getTime();
    const blobName = `${timestamp}-${fileName}`;
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    // Upload file
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });
    
    // Return the URL to the blob
    return blockBlobClient.url;
  } catch (error) {
    console.error(`Error uploading file '${fileName}':`, error);
    throw error;
  }
};

// Download a file from Azure Blob Storage
export const downloadFile = async (blobName: string): Promise<Buffer> => {
  try {
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);
    
    // Download blob content
    const downloadBlockBlobResponse = await blobClient.download(0);
    
    // Read stream into buffer
    const chunks: Buffer[] = [];
    if (downloadBlockBlobResponse.readableStreamBody) {
      for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
        chunks.push(Buffer.from(chunk));
      }
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error(`Error downloading blob '${blobName}':`, error);
    throw error;
  }
};

// Delete a file from Azure Blob Storage
export const deleteFile = async (blobName: string): Promise<void> => {
  try {
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.delete();
    console.log(`Blob '${blobName}' deleted successfully`);
  } catch (error) {
    console.error(`Error deleting blob '${blobName}':`, error);
    throw error;
  }
};

// List all files in the container
export const listFiles = async (): Promise<string[]> => {
  try {
    const containerClient = getContainerClient();
    const blobs = containerClient.listBlobsFlat();
    
    const blobNames: string[] = [];
    for await (const blob of blobs) {
      blobNames.push(blob.name);
    }
    
    return blobNames;
  } catch (error) {
    console.error("Error listing blobs:", error);
    throw error;
  }
};
