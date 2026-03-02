import { NextFunction, Request, Response } from 'express';

const WINDOW_MS = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS_PER_WINDOW = parseInt(process.env.API_RATE_LIMIT_MAX || '180', 10);

type Bucket = {
  count: number;
  resetAt: number;
};

const BUCKETS = new Map<string, Bucket>();

function getClientKey(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded || '').toString().split(',')[0];
  return forwardedIp.trim() || req.ip || 'unknown';
}

export function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  if (!Number.isFinite(MAX_REQUESTS_PER_WINDOW) || MAX_REQUESTS_PER_WINDOW <= 0) {
    return next();
  }

  if (!Number.isFinite(WINDOW_MS) || WINDOW_MS <= 0) {
    return next();
  }

  const key = getClientKey(req);
  const now = Date.now();
  const bucket = BUCKETS.get(key);

  if (!bucket || now >= bucket.resetAt) {
    BUCKETS.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return next();
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      error: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
    });
  }

  bucket.count += 1;
  BUCKETS.set(key, bucket);
  return next();
}
