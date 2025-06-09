// API route for getting exam metadata (unique exam types, years, counts)
import { NextRequest, NextResponse } from "next/server";
import { getAllPapers } from "@/lib/azure";

interface ExamMetadata {
  examType: string;
  name: string;
  years: string[];
  totalPapers: number;
  description: string;
  color: string;
  latestYear: string;
}

// Check if we're in development mode
const isDevelopmentMode = process.env.NODE_ENV === 'development' && 
  (!process.env.AZURE_STORAGE_CONNECTION_STRING || !process.env.COSMOS_ENDPOINT);

// Exam type mappings
const examTypeConfig = {
  'iit': {
    name: 'IIT-JEE',
    description: "The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India.",
    color: "bg-blue-600"
  },
  'neet': {
    name: 'NEET',
    description: "The National Eligibility cum Entrance Test (NEET) is the entrance examination for medical and dental colleges across India.",
    color: "bg-green-600"
  },
  'gate': {
    name: 'GATE',
    description: "The Graduate Aptitude Test in Engineering (GATE) is an examination for admission to postgraduate programs in engineering and science.",
    color: "bg-purple-600"
  },
  'cat': {
    name: 'CAT',
    description: "The Common Admission Test (CAT) is a computer-based test for admission into postgraduate management programs.",
    color: "bg-yellow-600"
  },
  'upsc': {
    name: 'UPSC',
    description: "Union Public Service Commission conducts various examinations for recruitment to civil services of the Government of India.",
    color: "bg-red-600"
  }
};

export async function GET(request: NextRequest) {
  try {
    if (isDevelopmentMode) {
      // Return development exam metadata
      const papers = global.devPapers || [];
      const metadata = generateExamMetadata(papers);
      console.log("🚀 Development mode: Returning exam metadata for", metadata.length, "exam types");
      return NextResponse.json(metadata);
    } else {
      // Use Azure Cosmos DB
      const papers = await getAllPapers();
      const metadata = generateExamMetadata(papers);
      return NextResponse.json(metadata);
    }
  } catch (error) {
    console.error("Error fetching exam metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam metadata" },
      { status: 500 }
    );
  }
}

function generateExamMetadata(papers: any[]): ExamMetadata[] {
  // Group papers by exam type
  const examGroups = papers.reduce((acc, paper) => {
    const examType = paper.examType;
    if (!acc[examType]) {
      acc[examType] = [];
    }
    acc[examType].push(paper);
    return acc;
  }, {} as Record<string, any[]>);

  // Generate metadata for each exam type
  const metadata: ExamMetadata[] = [];
  
  Object.entries(examGroups).forEach(([examType, examPapers]) => {
    const typedExamPapers = examPapers as any[];
    // Get unique years and sort them in descending order
    const years = [...new Set(typedExamPapers.map((paper: any) => paper.year as string))]
      .sort((a: string, b: string) => parseInt(b) - parseInt(a));
    
    const config = examTypeConfig[examType as keyof typeof examTypeConfig] || {
      name: examType.toUpperCase(),
      description: `${examType.toUpperCase()} examination papers and solutions.`,
      color: "bg-gray-600"
    };

    metadata.push({
      examType,
      name: config.name,
      years,
      totalPapers: typedExamPapers.length,
      description: config.description,
      color: config.color,
      latestYear: years[0] || '2023'
    });
  });

  // Sort metadata by exam type priority
  const priorityOrder = ['iit', 'neet', 'gate', 'cat', 'upsc'];
  metadata.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.examType);
    const bIndex = priorityOrder.indexOf(b.examType);
    
    if (aIndex === -1 && bIndex === -1) return a.examType.localeCompare(b.examType);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });

  return metadata;
}
