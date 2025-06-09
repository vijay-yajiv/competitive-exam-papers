// Azure Database Configuration
import { CosmosClient } from "@azure/cosmos";

// Azure Cosmos DB configuration
export const cosmosConfig = {
  endpoint: process.env.COSMOS_ENDPOINT || "",
  key: process.env.COSMOS_KEY || "",
  databaseId: "ExamPapersDB",
  containerId: "Papers"
};

// Validate Azure Cosmos DB configuration
const validateCosmosConfig = () => {
  if (!cosmosConfig.endpoint) {
    throw new Error("COSMOS_ENDPOINT is not configured in environment variables");
  }
  if (!cosmosConfig.key) {
    throw new Error("COSMOS_KEY is not configured in environment variables");
  }
};

// Initialize the Cosmos Client
const getCosmosClient = () => {
  validateCosmosConfig();
  return new CosmosClient({
    endpoint: cosmosConfig.endpoint,
    key: cosmosConfig.key
  });
};

// Get database and container
export async function getDatabase() {
  const client = getCosmosClient();
  const { database } = await client.databases.createIfNotExists({ id: cosmosConfig.databaseId });
  return database;
}

export async function getContainer() {
  const database = await getDatabase();
  const { container } = await database.containers.createIfNotExists({ id: cosmosConfig.containerId });
  return container;
}

// Paper operations
export async function getAllPapers() {
  try {
    const container = await getContainer();
    const { resources } = await container.items.readAll().fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching papers from Cosmos DB:", error);
    throw error;
  }
}

export async function getPapersByExamTypeAndYear(examType: string, year: string) {
  try {
    const container = await getContainer();
    const querySpec = {
      query: "SELECT * FROM c WHERE c.examType = @examType AND c.year = @year",
      parameters: [
        { name: "@examType", value: examType },
        { name: "@year", value: year }
      ]
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error(`Error fetching ${examType} papers for ${year}:`, error);
    throw error;
  }
}

export async function getPaperById(id: string) {
  try {
    console.log(`Attempting to get paper with ID: ${id}`);
    const container = await getContainer();
    
    // First try: Attempt to read by ID with same ID as partition key (default pattern)
    try {
      const { resource } = await container.item(id, id).read();
      if (resource) {
        console.log(`Successfully found paper with ID ${id} using direct lookup`);
        return resource;
      }
    } catch (directLookupError: any) {
      console.log(`Direct lookup failed for paper with ID ${id}:`, directLookupError?.message || 'Unknown error');
      // Continue to try alternative methods
    }
    
    // Second try: Query by ID (works regardless of partition key)
    console.log(`Trying query lookup for paper with ID ${id}`);
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        { name: "@id", value: id }
      ]
    };
    
    const { resources } = await container.items.query(querySpec).fetchAll();
    if (resources && resources.length > 0) {
      console.log(`Paper with ID ${id} found using query lookup.`);
      return resources[0];
    }
    
    // Third try: Query with exact ID match to catch any case-sensitivity issues or encoding problems
    console.log(`Trying broad query lookup for paper related to ID ${id}`);
    const broadQuerySpec = {
      query: "SELECT * FROM c WHERE CONTAINS(c.id, @idFragment)",
      parameters: [
        { name: "@idFragment", value: id.substring(0, Math.min(id.length, 8)) }
      ]
    };
    
    const broadResults = await container.items.query(broadQuerySpec).fetchAll();
    if (broadResults.resources && broadResults.resources.length > 0) {
      const closestMatch = broadResults.resources.find(p => p.id.toLowerCase() === id.toLowerCase());
      if (closestMatch) {
        console.log(`Found paper with case-insensitive match for ID ${id}`);
        return closestMatch;
      }
      
      // Return the first result as a fallback
      console.log(`Found ${broadResults.resources.length} papers with similar IDs, returning first match`);
      return broadResults.resources[0];
    }
    
    console.log(`No paper found with ID ${id} after all lookup attempts`);
    return null;
  } catch (error) {
    console.error(`Error fetching paper with ID ${id}:`, error);
    
    // Log more details if it's a specific type of error
    if (error instanceof Error) {
      if (error.message.includes('Entity with the specified id does not exist')) {
        console.log(`Paper with ID ${id} was not found in the database.`);
      }
    }
    
    return null;
  }
}

export async function createPaper(paper: any) {
  try {
    const container = await getContainer();
    const { resource } = await container.items.create(paper);
    return resource;
  } catch (error) {
    console.error("Error creating paper:", error);
    throw error;
  }
}

export async function updatePaper(id: string, paper: any) {
  try {
    const container = await getContainer();
    const { resource } = await container.item(id, id).replace(paper);
    return resource;
  } catch (error) {
    console.error(`Error updating paper with ID ${id}:`, error);
    throw error;
  }
}

export async function deletePaper(id: string) {
  try {
    console.log(`Attempting to delete paper with ID: ${id}`);
    const container = await getContainer();
    
    // First try: Delete with default partition key
    try {
      await container.item(id, id).delete();
      console.log(`Successfully deleted paper with ID ${id} using direct approach`);
      return { success: true };
    } catch (directDeleteError: any) {
      console.log(`Direct delete failed for paper with ID ${id}:`, directDeleteError?.message || 'Unknown error');
      
      // If direct delete fails, try to find the correct document first
      console.log(`Trying to find paper with ID ${id} before deletion`);
      const paper = await getPaperById(id);
      
      if (!paper) {
        console.log(`Cannot delete paper with ID ${id} because it was not found`);
        throw new Error(`Paper with ID ${id} not found`);
      }
      
      // Try to delete with query approach
      const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [
          { name: "@id", value: id }
        ]
      };
      
      const { resources } = await container.items.query(querySpec).fetchAll();
      if (resources && resources.length > 0) {
        // We found the item, now delete it
        console.log(`Found paper with ID ${id} via query, attempting deletion again`);
        
        try {
          // Try delete with undefined partition key as a last resort
          await container.item(id, undefined).delete();
          console.log(`Successfully deleted paper with ID ${id} using undefined partition key`);
          return { success: true };
        } catch (finalDeleteError: any) {
          console.error(`Final delete attempt failed for paper with ID ${id}:`, finalDeleteError?.message || 'Unknown error');
          throw finalDeleteError;
        }
      } else {
        throw new Error(`Paper with ID ${id} could not be found for deletion`);
      }
    }
  } catch (error) {
    console.error(`Error deleting paper with ID ${id}:`, error);
    throw error;
  }
}

// Function to update paper view count
export async function updatePaperViewCount(paperId: string): Promise<void> {
  try {
    console.log(`Updating view count for paper with ID: ${paperId}`);
    
    const container = await getContainer();
    
    // First, try to get the paper to update its view count
    try {
      const { resource: paper } = await container.item(paperId, paperId).read();
      
      if (paper) {
        // Increment view count
        const updatedPaper = {
          ...paper,
          viewCount: (paper.viewCount || 0) + 1,
          lastViewed: new Date().toISOString()
        };
        
        // Update the paper
        await container.item(paperId, paperId).replace(updatedPaper);
        console.log(`Successfully updated view count for paper ${paperId}`);
      }
    } catch (readError: any) {
      console.log(`Could not update view count for paper ${paperId}:`, readError?.message || 'Unknown error');
      // Don't throw error for view count updates to avoid breaking the main flow
    }
  } catch (error) {
    console.error(`Error updating view count for paper ${paperId}:`, error);
    // Don't throw error for view count updates
  }
}
