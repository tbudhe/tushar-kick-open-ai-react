import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../helpers/response';
import {
  getContactTarget,
  requestVerificationCode,
  sendContactMessage,
  verifyCode,
} from '../services/contact.service';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string) {
  return /^\+?[0-9()\-\s]{8,20}$/.test(value);
}

export async function requestContactVerificationController(req: Request, res: Response) {
  try {
    const method = String(req.body?.method || '').trim().toLowerCase();
    const destination = String(req.body?.destination || '').trim();

    if (method !== 'email' && method !== 'phone') {
      return sendError(res, 'method must be email or phone', 400);
    }

    if (!destination) {
      return sendError(res, 'destination is required', 400);
    }

    if (method === 'email' && !isEmail(destination)) {
      return sendError(res, 'invalid email format', 400);
    }

    if (method === 'phone' && !isPhone(destination)) {
      return sendError(res, 'invalid phone format', 400);
    }

    const result = await requestVerificationCode(method, destination);
    return sendSuccess(res, {
      sessionId: result.sessionId,
      expiresAt: result.expiresAt,
      channel: method,
      target: destination,
      delivery: {
        sent: result.sent,
        provider: result.provider,
        reason: 'reason' in result ? result.reason : undefined,
      },
      message: result.sent
        ? 'Verification code sent'
        : 'Verification flow active in development mode; code logged on backend',
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'failed to request verification', 500);
  }
}

export function verifyContactCodeController(req: Request, res: Response) {
  try {
    const sessionId = String(req.body?.sessionId || '').trim();
    const code = String(req.body?.code || '').trim();

    if (!sessionId || !code) {
      return sendError(res, 'sessionId and code are required', 400);
    }

    const result = verifyCode(sessionId, code);
    if (!result.ok) {
      return sendError(res, result.reason || 'verification-failed', 400);
    }

    return sendSuccess(res, {
      verified: true,
      method: result.method,
      destination: result.destination,
      contactTarget: getContactTarget(),
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'failed to verify code', 500);
  }
}

export async function sendContactMessageController(req: Request, res: Response) {
  try {
    const sessionId = String(req.body?.sessionId || '').trim();
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!sessionId || !subject || !message) {
      return sendError(res, 'sessionId, subject, and message are required', 400);
    }

    const result = await sendContactMessage(sessionId, subject, message);
    if (!result.ok) {
      return sendError(res, result.reason || 'message-send-failed', 400);
    }

    return sendSuccess(res, {
      delivered: result.delivered,
      provider: result.provider,
      target: getContactTarget(),
      message: result.delivered
        ? 'Message sent successfully'
        : 'Message accepted in development mode; SMTP not configured',
    });
  } catch (error) {
    return sendError(res, error instanceof Error ? error.message : 'failed to send message', 500);
  }
}
