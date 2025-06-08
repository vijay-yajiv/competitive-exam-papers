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
    const container = await getContainer();
    const { resource } = await container.item(id, id).read();
    return resource;
  } catch (error) {
    console.error(`Error fetching paper with ID ${id}:`, error);
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
    const container = await getContainer();
    await container.item(id, id).delete();
    return { success: true };
  } catch (error) {
    console.error(`Error deleting paper with ID ${id}:`, error);
    throw error;
  }
}
