import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import { getAllVideos, syncVideosFromYouTube } from '../services/video.service';

function parseLimit(value: unknown): number {
  if (typeof value !== 'string') return 20;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 20 : parsed;
}

export async function getVideosController(req: Request, res: Response) {
  try {
    const tags = typeof req.query.tags === 'string' ? req.query.tags : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const limit = parseLimit(req.query.limit);

    const videos = await getAllVideos({ tags, category, limit });

    return sendSuccess(res, {
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error('[VIDEO] getVideos error:', error);
    return sendError(res, 'Failed to load videos', 500);
  }
}

export async function syncVideosController(_req: Request, res: Response) {
  try {
    const result = await syncVideosFromYouTube();

    return sendSuccess(res, {
      success: true,
      synced: result.synced,
      source: result.source,
    });
  } catch (error) {
    console.error('[VIDEO] syncVideos error:', error);
    return sendError(res, 'Failed to sync videos', 500);
  }
}
