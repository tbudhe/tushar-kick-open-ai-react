import mammoth from 'mammoth';
import path from 'path';
import pdfParse from 'pdf-parse';

type PdfParseCallable = (dataBuffer: Buffer) => Promise<{ text?: string }>;

function getPdfParser(): PdfParseCallable {
  const candidate = pdfParse as unknown as { default?: PdfParseCallable } | PdfParseCallable;
  if (typeof candidate === 'function') {
    return candidate;
  }
  if (typeof candidate.default === 'function') {
    return candidate.default;
  }
  throw new Error('PDF parser is unavailable');
}

function getExtension(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function normalizeExtractedText(text: string) {
  return text.replace(/\u0000/g, '').trim();
}

export async function extractResumeTextFromFile(file: Express.Multer.File) {
  const extension = getExtension(file.originalname);

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error('Uploaded file is empty');
  }

  if (extension === '.txt' || extension === '.md' || extension === '.json' || extension === '.rtf') {
    return normalizeExtractedText(file.buffer.toString('utf-8'));
  }

  if (extension === '.pdf') {
    const parsePdf = getPdfParser();
    const parsed = await parsePdf(file.buffer);
    return normalizeExtractedText(parsed.text || '');
  }

  if (extension === '.docx') {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return normalizeExtractedText(parsed.value || '');
  }

  if (extension === '.doc') {
    throw new Error('Legacy .doc files are not supported for automatic extraction. Please convert to .docx or paste text.');
  }

  throw new Error('Unsupported file type');
}
