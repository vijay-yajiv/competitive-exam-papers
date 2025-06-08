// Local development storage fallback
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
};

// Save file locally for development
export const saveFileLocally = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  try {
    await ensureUploadDir();
    
    const timestamp = new Date().getTime();
    const safeFileName = `${timestamp}-${fileName}`;
    const filePath = join(UPLOAD_DIR, safeFileName);
    
    await writeFile(filePath, fileBuffer);
    
    // Return a local URL (this would need a file serving route in production)
    return `/uploads/${safeFileName}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw error;
  }
};
