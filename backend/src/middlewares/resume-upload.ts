import multer from 'multer';
import path from 'path';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['.txt', '.md', '.json', '.rtf', '.pdf', '.doc', '.docx']);

const storage = multer.memoryStorage();

function getExtension(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function fileFilter(_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const extension = getExtension(file.originalname);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    cb(new Error('Unsupported resume file type. Allowed: .txt, .md, .json, .rtf, .pdf, .doc, .docx'));
    return;
  }

  cb(null, true);
}

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter,
});
