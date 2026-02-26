import { Request, Response } from 'express';
import { extractResumeTextFromFile } from '../services/resume-file-extractor.service';
import { parseResume } from '../services/resume-parser.service';
import { sendError, sendSuccess } from '../helpers/response';

const MAX_RESUME_LENGTH = 200000;

export async function parseResumeController(req: Request, res: Response) {
  try {
    const rawResumeText = typeof req.body?.resumeText === 'string' ? req.body.resumeText : '';
    const uploadedFile = req.file;
    const fileName = uploadedFile?.originalname
      || (typeof req.body?.fileName === 'string' ? req.body.fileName : 'uploaded-resume.txt');

    let resumeText = rawResumeText;

    if (uploadedFile) {
      try {
        resumeText = await extractResumeTextFromFile(uploadedFile);
      } catch (error) {
        return sendError(
          res,
          error instanceof Error ? error.message : 'Unable to extract text from uploaded file',
          400,
        );
      }
    }

    if (!resumeText.trim()) {
      return sendError(res, 'Provide resume text or upload a supported resume file', 400);
    }

    if (resumeText.length > MAX_RESUME_LENGTH) {
      return sendError(res, `Resume text is too large. Limit is ${MAX_RESUME_LENGTH} characters.`, 413);
    }

    const { source, parsedData } = await parseResume(resumeText);

    return sendSuccess(res, {
      success: true,
      source,
      fileName,
      parsedData,
    });
  } catch (error) {
    console.error('[RESUME_PARSER] Unexpected error:', error);
    return sendError(res, 'Failed to parse resume', 500);
  }
}
