# Azure Storage PDF Viewing - Technical Implementation

## Overview

This document explains how the PDF viewing system works with Azure Storage and SAS tokens, resolving the "Public access is not permitted" error.

## Problem Statement

The application was encountering "Public access is not permitted on this storage account" errors when trying to view PDFs stored in Azure Blob Storage. This happened because:

1. Azure Storage containers were configured as private (which is correct for security)
2. The application was trying to access blob URLs directly without authentication
3. Direct iframe embedding of private blob URLs is not allowed

## Solution Architecture

### 1. SAS Token-Based Access

Instead of making the container public, we use **Shared Access Signature (SAS) tokens** to provide time-limited, secure access to individual blobs.

```typescript
// Generate SAS token for a blob
const signedUrl = await generateSignedUrl(blobName, 1); // 1 hour expiry
```

### 2. New API Endpoints

#### `/api/view-pdf/[paperId]` - PDF Viewing API
- Handles both Azure blob URLs and external URLs
- Generates SAS tokens for Azure blobs
- Returns appropriate viewing URLs based on source type

#### Updated `/api/download/[paperId]` - Download API
- Enhanced to handle SAS token generation
- Provides secure download URLs for private blobs

### 3. Client-Side Handling

The frontend now distinguishes between:
- **Azure blob URLs**: Use SAS tokens for iframe embedding
- **External URLs**: Open in new tab to avoid CORS issues

## Technical Flow

### PDF Viewing Process

1. **User clicks "View Paper"**
2. **Frontend calls** `/api/view-pdf/[paperId]?type=paper`
3. **API checks URL type**:
   - If Azure blob: Generate SAS token
   - If external URL: Return as-is with `external: true` flag
4. **Frontend handles response**:
   - External URLs: Open in new tab
   - Azure URLs: Display in iframe with SAS token

### Security Features

- **Private containers**: No public access to blob storage
- **Time-limited access**: SAS tokens expire after 1 hour
- **Read-only permissions**: SAS tokens only allow reading
- **Specific blob access**: Each token is for a specific file

## Code Implementation

### Azure Storage Configuration

```typescript
// lib/azureStorage.ts
export const generateSignedUrl = async (blobName: string, expiresInHours: number = 24): Promise<string> => {
  const containerClient = getContainerClient();
  const blobClient = containerClient.getBlobClient(blobName);
  
  // Parse connection string to get account credentials
  const connectionStringParts = azureStorageConnectionString.split(';');
  const accountName = connectionStringParts.find(part => part.startsWith('AccountName='))?.split('=')[1];
  const accountKey = connectionStringParts.find(part => part.startsWith('AccountKey='))?.split('=')[1];
  
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
  
  return `${blobClient.url}?${sasToken}`;
};
```

### Frontend PDF Handling

```typescript
// Frontend component
const handleViewPDF = async (paperId: string, paperTitle: string) => {
  const response = await fetch(`/api/view-pdf/${paperId}?type=paper`);
  const data = await response.json();
  
  if (data.external) {
    // External URL - open in new tab
    window.open(data.pdfUrl, '_blank');
  } else {
    // Azure blob with SAS token - use iframe
    setPdfViewer({ url: data.pdfUrl, title: data.title });
  }
};
```

## Azure Setup Requirements

### Storage Account Configuration

1. **Storage account**: Standard performance, StorageV2
2. **Container**: Private access level (default)
3. **CORS settings**: Configure for your domain (production)

### Environment Variables

```bash
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
```

## Testing

### Test Cases

1. **Azure blob PDF**: Should generate SAS token and display in iframe
2. **External PDF**: Should open in new tab
3. **Missing paper**: Should show appropriate error
4. **Expired token**: Should regenerate automatically

### Verification Steps

1. Upload a PDF through admin interface
2. Try viewing the PDF from exam listing page
3. Check browser network tab for SAS token in URL
4. Verify iframe loads successfully
5. Test token expiry (after 1 hour)

## Error Handling

### Common Issues and Solutions

1. **"Public access is not permitted"**
   - ✅ Fixed: Using SAS tokens instead of direct URLs

2. **CORS errors with external URLs**
   - ✅ Fixed: Opening external URLs in new tab

3. **Token expiry**
   - ✅ Handled: Tokens auto-regenerate on each request

4. **Missing Azure credentials**
   - Check environment variables
   - Verify connection string format

## Performance Considerations

- **SAS token caching**: Consider implementing client-side caching for repeated access
- **Token duration**: Balance security (shorter duration) vs user experience (longer duration)
- **Bandwidth**: Large PDFs may take time to load in iframe

## Security Best Practices

1. **Never expose connection strings** in client-side code
2. **Use minimum required permissions** (read-only for viewing)
3. **Set reasonable expiry times** (1 hour for viewing, longer for downloads)
4. **Monitor access patterns** through Azure Storage analytics

## Future Enhancements

1. **Progressive loading**: Stream large PDFs for better performance
2. **Thumbnail previews**: Generate PDF thumbnails for quick preview
3. **Access logging**: Track which papers are viewed most frequently
4. **Batch token generation**: For performance optimization

## Troubleshooting

### Debug Steps

1. Check browser console for errors
2. Verify API response format
3. Test SAS token generation manually
4. Check Azure Storage logs
5. Validate environment variables

### Common Error Messages

- `"Public access is not permitted"` → Use SAS tokens
- `"Unable to parse account name or key"` → Check connection string
- `"Blob not found"` → Verify blob name extraction
- `"CORS error"` → Configure CORS or use new tab for external URLs

## Conclusion

This implementation provides secure, efficient PDF viewing while maintaining Azure Storage best practices. The solution handles both uploaded PDFs (Azure Storage) and external PDF links seamlessly, with appropriate security measures in place.
