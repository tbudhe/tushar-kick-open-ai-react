import { Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { sendSuccess } from '../helpers/response';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

export function getHeartbeat(_req: Request, res: Response) {
  const dbStatus = isDatabaseConnected() ? 'connected' : 'disconnected';

  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    database: dbStatus,
    environment: NODE_ENV,
  });
}

export function getHealth(_req: Request, res: Response) {
  return res.status(200).send('OK');
}

export function getApiHealth(_req: Request, res: Response) {
  const connected = isDatabaseConnected();

  return sendSuccess(res, {
    status: connected ? 'healthy' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  }, connected ? 200 : 503);
}
