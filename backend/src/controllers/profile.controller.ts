import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import { getProfile, updateProfile } from '../services/profile.service';

export async function getProfileController(_req: Request, res: Response) {
  try {
    const profile = await getProfile();
    return sendSuccess(res, { profile });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to load profile', 500);
  }
}

export async function updateProfileController(req: Request, res: Response) {
  try {
    const body = req.body || {};

    // Accept a partial update — only take known safe fields
    const patch: Record<string, unknown> = {};
    if (typeof body.name === 'string') patch.name = body.name.trim();
    if (typeof body.title === 'string') patch.title = body.title.trim();
    if (typeof body.location === 'string') patch.location = body.location.trim();
    if (typeof body.email === 'string') patch.email = body.email.trim();
    if (typeof body.phone === 'string') patch.phone = body.phone.trim();
    if (typeof body.summary === 'string') patch.summary = body.summary.trim();
    if (Array.isArray(body.skillGroups)) patch.skillGroups = body.skillGroups;
    if (Array.isArray(body.experience)) patch.experience = body.experience;
    if (body.socialLinks && typeof body.socialLinks === 'object') patch.socialLinks = body.socialLinks;
    if (typeof body.resumeText === 'string') patch.resumeText = body.resumeText; // explicit override

    const updated = await updateProfile(patch);
    return sendSuccess(res, { profile: updated });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'Failed to update profile', 500);
  }
}
