import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import { fetchJobs, listStoredJobs, persistJobs } from '../services/job-search.service';

function parseLimit(value: unknown) {
  if (typeof value !== 'string') {
    return 20;
  }

  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 20;
  }

  return parsed;
}

export async function searchJobsController(req: Request, res: Response) {
  try {
    const query = typeof req.body?.query === 'string' ? req.body.query : '';
    const location = typeof req.body?.location === 'string' ? req.body.location : '';
    const employmentType = typeof req.body?.employmentType === 'string' ? req.body.employmentType : '';
    const limit = typeof req.body?.limit === 'number' ? req.body.limit : parseLimit(req.body?.limit);

    const jobs = await fetchJobs({ query, location, employmentType, limit });
    const persistence = await persistJobs(jobs, query);

    return sendSuccess(res, {
      success: true,
      query,
      location,
      employmentType,
      count: jobs.length,
      persisted: persistence.persisted,
      databaseConnected: persistence.connected,
      jobs,
    });
  } catch (error) {
    console.error('[JOB_SEARCH] Search error:', error);
    return sendError(res, 'Failed to search jobs', 500);
  }
}

export async function getJobsController(req: Request, res: Response) {
  try {
    const query = typeof req.query.query === 'string' ? req.query.query : '';
    const location = typeof req.query.location === 'string' ? req.query.location : '';
    const employmentType = typeof req.query.employmentType === 'string' ? req.query.employmentType : '';
    const limit = parseLimit(req.query.limit);

    const jobs = await listStoredJobs({ query, location, employmentType, limit });

    return sendSuccess(res, {
      success: true,
      query,
      location,
      employmentType,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('[JOB_SEARCH] List error:', error);
    return sendError(res, 'Failed to load jobs', 500);
  }
}
