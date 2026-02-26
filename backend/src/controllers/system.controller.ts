import { Request, Response } from 'express';
import { getDatabaseDiagnostics } from '../config/database';
import { sendError, sendSuccess } from '../helpers/response';

const menuItems = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Profile', path: '/profile', icon: 'person' },
  { label: 'Job Search', path: '/job-search', icon: 'briefcase' },
  { label: 'Applications', path: '/applications', icon: 'checklist' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
];

export function getMenu(_req: Request, res: Response) {
  return sendSuccess(res, menuItems);
}

export async function getDbStatus(_req: Request, res: Response) {
  try {
    const diagnostics = await getDatabaseDiagnostics();
    return sendSuccess(res, diagnostics);
  } catch (error) {
    return sendError(
      res,
      error instanceof Error ? error.message : 'Unknown error',
      500,
    );
  }
}
