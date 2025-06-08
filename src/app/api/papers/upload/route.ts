// API route for uploading exam papers
import { NextRequest, NextResponse } from "next/server";
import { createPaper } from "@/lib/azure";
import { uploadFile } from "@/lib/azureStorage";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
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
    
    // Generate unique ID for the paper
    const id = uuidv4();
    
    // Upload paper file to Azure Blob Storage
    const paperBuffer = await paperFile.arrayBuffer();
    const paperUrl = await uploadFile(
      Buffer.from(paperBuffer),
      paperFile.name,
      paperFile.type
    );
    
    // Upload solution file if provided
    let solutionUrl;
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
  } catch (error) {
    console.error("Error uploading exam paper:", error);
    return NextResponse.json(
      { error: "Failed to upload exam paper" },
      { status: 500 }
    );
  }
}
