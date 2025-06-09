// Azure Blob Storage Configuration
import { BlobServiceClient, ContainerClient, BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";

// Azure Blob Storage configuration
const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = "exam-papers";

// Validate Azure configuration
const validateAzureConfig = () => {
  if (!azureStorageConnectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured in environment variables");
  }
};

// Get Azure Storage Blob service client
const getBlobServiceClient = () => {
  validateAzureConfig();
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
      // Container is private by default, which is what we want for security
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

// Generate a signed URL for secure access to private blobs
export const generateSignedUrl = async (blobName: string, expiresInHours: number = 24): Promise<string> => {
  try {
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);
    
    // Parse connection string to get account name and key
    const connectionStringParts = azureStorageConnectionString.split(';');
    const accountName = connectionStringParts.find(part => part.startsWith('AccountName='))?.split('=')[1];
    const accountKey = connectionStringParts.find(part => part.startsWith('AccountKey='))?.split('=')[1];
    
    if (!accountName || !accountKey) {
      throw new Error('Unable to parse account name or key from connection string');
    }
    
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    
    // Set permissions and expiry
    const permissions = new BlobSASPermissions();
    permissions.read = true;
    
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (expiresInHours * 60 * 60 * 1000));
    
    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters({
      containerName,
      blobName,
      permissions,
      expiresOn: expiryDate
    }, sharedKeyCredential);
    
    // Return URL with SAS token
    return `${blobClient.url}?${sasToken}`;
  } catch (error) {
    console.error(`Error generating signed URL for blob '${blobName}':`, error);
    throw error;
  }
};

// Get a signed URL for a blob by extracting blob name from full URL
export const getSignedUrlFromBlobUrl = async (blobUrl: string, expiresInHours: number = 24): Promise<string> => {
  try {
    // Extract blob name from URL
    const url = new URL(blobUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts[pathParts.length - 1];
    
    return await generateSignedUrl(blobName, expiresInHours);
  } catch (error) {
    console.error(`Error getting signed URL from blob URL '${blobUrl}':`, error);
    throw error;
  }
};

// Delete a file from Azure Blob Storage
export const deleteFileFromStorage = async (blobUrl: string): Promise<void> => {
  try {
    validateAzureConfig();
    
    const containerClient = getContainerClient();
    
    // Extract blob name from URL
    const url = new URL(blobUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts[pathParts.length - 1];
    
    // Delete the blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
    
    console.log(`File '${blobName}' deleted successfully from Azure Blob Storage`);
  } catch (error) {
    console.error(`Error deleting file '${blobUrl}' from Azure Blob Storage:`, error);
    throw error;
  }
};
