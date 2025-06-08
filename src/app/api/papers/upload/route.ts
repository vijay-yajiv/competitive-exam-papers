// API route for uploading exam papers
import { NextRequest, NextResponse } from "next/server";
import { createPaper } from "@/lib/azure";
import { uploadFile } from "@/lib/azureStorage";
import { saveFileLocally } from "@/lib/localStorage";
import { v4 as uuidv4 } from "uuid";

// Type for development storage
declare global {
  var devPapers: any[] | undefined;
}

// Check if we're in development mode
const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true';

export async function POST(request: NextRequest) {
  try {
    // Debug development mode detection
    console.log("🔍 Environment variables:");
    console.log("DEVELOPMENT_MODE:", process.env.DEVELOPMENT_MODE);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("AZURE_STORAGE_CONNECTION_STRING present:", !!process.env.AZURE_STORAGE_CONNECTION_STRING);
    console.log("COSMOS_ENDPOINT present:", !!process.env.COSMOS_ENDPOINT);
    console.log("isDevelopmentMode:", isDevelopmentMode);
    
    const formData = await request.formData();
    
    // Extract paper details
    const examType = formData.get("examType") as string;
    const year = formData.get("year") as string;
    const paperType = formData.get("paperType") as string;
    
    // Get files from form data
    const paperFile = formData.get("paperFile") as File;
    const solutionFile = formData.get("solutionFile") as File;
    
    if (!examType || !year || !paperType || !paperFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check Azure configuration only if not in development mode
    if (!isDevelopmentMode) {
      if (!process.env.AZURE_STORAGE_CONNECTION_STRING || 
          process.env.AZURE_STORAGE_CONNECTION_STRING.includes('your-storage-account-name')) {
        return NextResponse.json(
          { error: "Azure Storage is not configured. Please check your environment variables." },
          { status: 500 }
        );
      }
      
      if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY ||
          process.env.COSMOS_ENDPOINT.includes('your-cosmos-db-account')) {
        return NextResponse.json(
          { error: "Azure Cosmos DB is not configured. Please check your environment variables." },
          { status: 500 }
        );
      }
    }
    
    // Generate unique ID for the paper
    const id = uuidv4();
    
    let paperUrl: string;
    let solutionUrl: string | undefined;
    
    if (isDevelopmentMode) {
      // Development mode: Save files locally
      console.log("🚀 Development mode: Saving files locally");
      
      const paperBuffer = await paperFile.arrayBuffer();
      paperUrl = await saveFileLocally(Buffer.from(paperBuffer), paperFile.name);
      
      if (solutionFile) {
        const solutionBuffer = await solutionFile.arrayBuffer();
        solutionUrl = await saveFileLocally(Buffer.from(solutionBuffer), solutionFile.name);
      }
      
      // In development mode, store in memory (you could use a local database instead)
      const paperData = {
        id,
        examType,
        year,
        paperType,
        paperUrl,
        solutionUrl,
        hasDownload: true,
        hasSolution: !!solutionUrl,
        uploadDate: new Date().toISOString()
      };
      
      // Store in global variable for development (in production, this would be in database)
      if (!global.devPapers) {
        global.devPapers = [];
      }
      global.devPapers.push(paperData);
      
      return NextResponse.json(paperData, { status: 201 });
    } else {
      // Production mode: Use Azure services
      const paperBuffer = await paperFile.arrayBuffer();
      paperUrl = await uploadFile(
        Buffer.from(paperBuffer),
        paperFile.name,
        paperFile.type
      );
      
      if (solutionFile) {
        const solutionBuffer = await solutionFile.arrayBuffer();
        solutionUrl = await uploadFile(
          Buffer.from(solutionBuffer),
          solutionFile.name,
          solutionFile.type
        );
      }
      
      // Create paper document in Cosmos DB
      const paperData = {
        id,
        examType,
        year,
        paperType,
        paperUrl,
        solutionUrl,
        hasDownload: true,
        hasSolution: !!solutionUrl,
        uploadDate: new Date().toISOString()
      };
      
      const createdPaper = await createPaper(paperData);
      return NextResponse.json(createdPaper, { status: 201 });
    }
  } catch (error) {
    console.error("Error uploading exam paper:", error);
    
    // Provide specific error messages based on error type
    let errorMessage = "Failed to upload exam paper";
    
    if (isDevelopmentMode) {
      errorMessage = `Development mode error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } else if (error instanceof Error) {
      if (error.message.includes("AZURE_STORAGE_CONNECTION_STRING")) {
        errorMessage = "Azure Storage configuration error. Please configure AZURE_STORAGE_CONNECTION_STRING.";
      } else if (error.message.includes("COSMOS_ENDPOINT") || error.message.includes("COSMOS_KEY")) {
        errorMessage = "Azure Cosmos DB configuration error. Please configure COSMOS_ENDPOINT and COSMOS_KEY.";
      } else if (error.message.includes("Authentication")) {
        errorMessage = "Azure authentication failed. Please check your credentials.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error while connecting to Azure services. Please try again.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
