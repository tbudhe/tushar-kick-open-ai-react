import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import {
  applyToJob,
  listApplications,
  updateApplicationStatus,
} from '../services/application.service';
import { sendApplicationCreatedAlert } from '../services/email-alert.service';

const ALLOWED_STATUSES = new Set(['pending', 'applied', 'rejected', 'interview']);

export async function applyController(req: Request, res: Response) {
  try {
    const job = req.body?.job as {
      id?: string;
      title?: string;
      company?: string;
      location?: string;
      url?: string;
    };

    if (!job || !job.id || !job.title || !job.company) {
      return sendError(res, 'job.id, job.title and job.company are required', 400);
    }

    const result = await applyToJob({
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location || '',
        url: job.url || '',
        tailoredResumeText: typeof req.body?.tailoredResumeText === 'string' ? req.body.tailoredResumeText : undefined,
      },
      tailoredResumeId: typeof req.body?.tailoredResumeId === 'string' ? req.body.tailoredResumeId : null,
      notes: typeof req.body?.notes === 'string' ? req.body.notes : '',
    });

    const alertResult = await sendApplicationCreatedAlert(result.record);
    if (!alertResult.sent) {
      console.log(`[EMAIL_ALERT] Application alert not sent: ${alertResult.reason || 'unknown-reason'}`);
    }

    return sendSuccess(res, {
      success: true,
      databaseConnected: result.databaseConnected,
      application: result.record,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to create application', 500);
  }
}

export async function getApplicationsController(_req: Request, res: Response) {
  try {
    const result = await listApplications();

    return sendSuccess(res, {
      success: true,
      databaseConnected: result.databaseConnected,
      count: result.items.length,
      items: result.items,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to load applications', 500);
  }
}

export async function updateApplicationController(req: Request, res: Response) {
  try {
    const id = typeof req.params?.id === 'string' ? req.params.id : '';
    const status = typeof req.body?.status === 'string' ? req.body.status.toLowerCase() : '';
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : '';

    if (!id) {
      return sendError(res, 'Application id is required', 400);
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return sendError(res, 'Invalid status. Use pending/applied/rejected/interview', 400);
    }

    const updated = await updateApplicationStatus(id, status as 'pending' | 'applied' | 'rejected' | 'interview', notes);
    if (!updated) {
      return sendError(res, 'Application not found', 404);
    }

    return sendSuccess(res, {
      success: true,
      databaseConnected: updated.databaseConnected,
      application: updated.record,
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to update application', 500);
  }
}
