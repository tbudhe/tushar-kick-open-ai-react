import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import { scoreJobsAgainstResume, JobScoreInput } from '../services/match-score.service';

export async function scoreJobsController(req: Request, res: Response) {
  try {
    const skills = Array.isArray(req.body?.skills) ? (req.body.skills as string[]) : [];
    const resumeText = typeof req.body?.resumeText === 'string' ? req.body.resumeText.trim() : '';
    const jobs = Array.isArray(req.body?.jobs) ? (req.body.jobs as JobScoreInput[]) : [];

    if (skills.length === 0 && !resumeText) {
      return sendError(res, 'skills or resumeText is required', 400);
    }

    if (jobs.length === 0) {
      return sendSuccess(res, { scores: [] });
    }

    // Prefer structured skills array; fall back to extracting lines from resumeText
    const effectiveSkills: string[] =
      skills.length > 0
        ? skills
        : resumeText.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);

    const validJobs = jobs.filter(
      (j) => typeof j?.id === 'string' && typeof j?.description === 'string',
    );

    const scores = scoreJobsAgainstResume(effectiveSkills, validJobs);
    return sendSuccess(res, { scores });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to score jobs', 500);
  }
}
