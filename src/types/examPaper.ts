export interface ExamPaper {
  id: string;
  examType: string; // 'iit' | 'neet' | 'gate'
  year: string;
  paperType: string;
  paperUrl: string;
  solutionUrl?: string;
  hasDownload: boolean;
  hasSolution: boolean;
  uploadDate?: string; // ISO date string when stored in Cosmos DB
  views?: number; // Track paper views/downloads
  subjects?: string[]; // e.g., ['Physics', 'Chemistry'] for better filtering
}
