// __mocks__/azureStorage.ts
// Mock implementation of the Azure Storage functions for testing

export const deleteFileFromStorage = jest.fn().mockImplementation((blobUrl) => {
  return Promise.resolve();
});
