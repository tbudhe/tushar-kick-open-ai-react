import { NextFunction, Request, Response } from 'express';
import { hashEmail, logContactAudit } from '../services/contact-audit.service';

const WINDOW_MS = parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS_PER_WINDOW = parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '8', 10);

type Bucket = {
  count: number;
  resetAt: number;
};

const BUCKETS = new Map<string, Bucket>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded || '').toString().split(',')[0];
  return forwardedIp.trim() || req.ip || 'unknown';
}

export function contactFormRateLimit(req: Request, res: Response, next: NextFunction) {
  if (!Number.isFinite(MAX_REQUESTS_PER_WINDOW) || MAX_REQUESTS_PER_WINDOW <= 0) {
    return next();
  }

  if (!Number.isFinite(WINDOW_MS) || WINDOW_MS <= 0) {
    return next();
  }

  const ip = getClientIp(req);
  const key = `contact:${ip}`;
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
    const rawEmail = (req.body && typeof req.body.email === 'string') ? req.body.email : '';
    const emailHash = rawEmail ? hashEmail(rawEmail) : 'unknown';
    const context = (req.body && typeof req.body.context === 'string') ? req.body.context : 'unknown';
    logContactAudit(ip, emailHash, context, 'rate_limited');
    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      error: `Too many contact requests. Try again in ${retryAfterSeconds} seconds.`,
    });
  }

  bucket.count += 1;
  BUCKETS.set(key, bucket);
  return next();
}
