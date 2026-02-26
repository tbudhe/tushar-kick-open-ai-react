import { NextFunction, Request, Response } from 'express';

const NODE_ENV = process.env.NODE_ENV || 'development';

export function notFoundHandler(_req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next();
  }

  return res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', err);

  return res.status(500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err?.message || 'Unexpected error',
  });
}
