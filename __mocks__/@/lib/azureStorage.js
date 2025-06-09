// Mock implementation of the Azure Storage functions for testing

export const deleteFileFromStorage = jest.fn().mockImplementation((blobUrl) => {
  return Promise.resolve();
});

export const uploadFile = jest.fn().mockImplementation((fileBuffer, fileName, contentType) => {
  return Promise.resolve(`https://example.com/mock-upload/${fileName}`);
});

export const getSignedUrlFromBlobUrl = jest.fn().mockImplementation((blobUrl) => {
  return Promise.resolve(`${blobUrl}?sig=mockSignature`);
});

export const generateSignedUrl = jest.fn().mockImplementation((blobName) => {
  return Promise.resolve(`https://example.com/${blobName}?sig=mockSignature`);
});

export const getContainerClient = jest.fn().mockReturnValue({
  getBlobClient: jest.fn().mockReturnValue({
    url: 'https://example.com/mock-blob',
    deleteIfExists: jest.fn().mockResolvedValue(true)
  }),
  getBlockBlobClient: jest.fn().mockReturnValue({
    url: 'https://example.com/mock-blob',
    upload: jest.fn().mockResolvedValue({}),
    deleteIfExists: jest.fn().mockResolvedValue(true)
  })
});
