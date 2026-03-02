import { Request, Response } from 'express';
import { extractResumeTextFromFile } from '../services/resume-file-extractor.service';
import { parseResume } from '../services/resume-parser.service';
import { persistTailoredResume, tailorResumeForJob } from '../services/resume-tailor.service';
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

const MAX_JOB_DESCRIPTION_LENGTH = 20000;

export async function tailorResumeController(req: Request, res: Response) {
  try {
    const resumeText = typeof req.body?.resumeText === 'string' ? req.body.resumeText : '';
    const job = req.body?.job as {
      id?: string;
      title?: string;
      company?: string;
      description?: string;
    };

    if (!resumeText.trim()) {
      return sendError(res, 'Resume text is required for tailoring', 400);
    }

    if (resumeText.length > MAX_RESUME_LENGTH) {
      return sendError(res, `Resume text is too large. Limit is ${MAX_RESUME_LENGTH} characters.`, 413);
    }

    if (!job || typeof job !== 'object' || !job.id || !job.title) {
      return sendError(res, 'Job details (id and title) are required for tailoring', 400);
    }

    const jobDescription = typeof job.description === 'string' ? job.description : '';
    if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return sendError(
        res,
        `Job description is too large. Limit is ${MAX_JOB_DESCRIPTION_LENGTH} characters.`,
        413,
      );
    }

    const targetJob = {
      id: job.id,
      title: job.title,
      company: typeof job.company === 'string' ? job.company : 'Unknown Company',
      description: jobDescription,
    };

    const tailored = await tailorResumeForJob(resumeText, targetJob);
    const persisted = await persistTailoredResume(targetJob, resumeText, tailored);

    return sendSuccess(res, {
      success: true,
      source: tailored.source,
      originalResume: resumeText,
      tailoredResume: tailored.tailoredResume,
      jobAnalysis: tailored.jobAnalysis,
      changeHighlights: tailored.changeHighlights,
      saved: persisted.saved,
      tailoredId: persisted.id,
      ragDocumentId: persisted.ragDocumentId,
    });
  } catch (error) {
    console.error('[RESUME_TAILOR] Unexpected error:', error);
    return sendError(res, 'Failed to tailor resume', 500);
  }
}
