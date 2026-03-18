import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Twilio from 'twilio';

type VerificationMethod = 'email' | 'phone';

interface VerificationSession {
  method: VerificationMethod;
  destination: string;
  codeHash: string;
  expiresAt: number;
  verified: boolean;
  attempts: number;
}

const CONTACT_TARGET = 'tbudhe@yunextgenai.com';
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const sessionStore = new Map<string, VerificationSession>();

function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function generateCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function smtpEnabled() {
  return (
    (process.env.SMTP_HOST || '').trim().length > 0
    && (process.env.SMTP_USER || '').trim().length > 0
    && (process.env.SMTP_PASS || '').trim().length > 0
  );
}

function twilioEnabled() {
  return (
    (process.env.TWILIO_ACCOUNT_SID || '').trim().length > 0
    && (process.env.TWILIO_AUTH_TOKEN || '').trim().length > 0
    && (process.env.TWILIO_FROM_PHONE || '').trim().length > 0
  );
}

function createSmtpTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
  });
}

async function sendVerificationEmail(destination: string, code: string) {
  if (!smtpEnabled()) {
    console.warn('[CONTACT] SMTP is not configured. Verification code will be logged only for development use.');
    console.log(`[CONTACT] Verification code for ${destination}: ${code}`);
    return { sent: false, provider: 'log-only' as const };
  }

  const from = (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '').trim();
  const transporter = createSmtpTransport();

  try {
    console.log(`[CONTACT] Sending verification email to ${destination} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'}`);
    await transporter.sendMail({
      from,
      to: destination,
      subject: 'YuNextGenAI verification code',
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });
    console.log(`[CONTACT] Verification email sent to ${destination}`);
  } catch (error) {
    console.error(`[CONTACT] Verification email send failed for ${destination}`);
    console.error('[CONTACT] SMTP error:', error instanceof Error ? error.message : error);
    throw error;
  }

  return { sent: true, provider: 'smtp' as const };
}

async function sendVerificationPhone(destination: string, code: string) {
  if (!twilioEnabled()) {
    console.warn('[CONTACT] Twilio is not configured. Verification code logged only.');
    console.log(`[CONTACT] SMS verification code for ${destination}: ${code}`);
    return { sent: false, provider: 'log-only' as const, reason: 'sms-provider-not-configured' };
  }

  const sid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
  const token = (process.env.TWILIO_AUTH_TOKEN || '').trim();
  const from = (process.env.TWILIO_FROM_PHONE || '').trim();
  const client = Twilio(sid, token);

  await client.messages.create({
    from,
    to: destination,
    body: `Your YuNextGenAI verification code is ${code}. It expires in 10 minutes.`,
  });

  return { sent: true, provider: 'twilio' as const };
}

export async function requestVerificationCode(method: VerificationMethod, destination: string) {
  const code = generateCode();
  const sessionId = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + CODE_TTL_MS;

  sessionStore.set(sessionId, {
    method,
    destination,
    codeHash: hashCode(code),
    expiresAt,
    verified: false,
    attempts: 0,
  });

  if (method === 'email') {
    const result = await sendVerificationEmail(destination, code);
    return { sessionId, expiresAt, ...result };
  }

  const smsResult = await sendVerificationPhone(destination, code);
  return { sessionId, expiresAt, ...smsResult };
}

export function verifyCode(sessionId: string, code: string) {
  const session = sessionStore.get(sessionId);
  if (!session) return { ok: false, reason: 'session-not-found' as const };
  if (Date.now() > session.expiresAt) return { ok: false, reason: 'session-expired' as const };
  if (session.attempts >= MAX_ATTEMPTS) return { ok: false, reason: 'too-many-attempts' as const };

  session.attempts += 1;
  if (hashCode(code) !== session.codeHash) {
    return { ok: false, reason: 'invalid-code' as const };
  }

  session.verified = true;
  return { ok: true, destination: session.destination, method: session.method };
}

export async function sendContactMessage(sessionId: string, subject: string, message: string) {
  const session = sessionStore.get(sessionId);
  if (!session) return { ok: false, reason: 'session-not-found' as const };
  if (!session.verified) return { ok: false, reason: 'not-verified' as const };
  if (Date.now() > session.expiresAt) return { ok: false, reason: 'session-expired' as const };

  if (!smtpEnabled()) {
    console.warn('[CONTACT] SMTP is not configured. Message logged only for development use.');
    console.log('[CONTACT] Message subject:', subject);
    console.log('[CONTACT] Message body:', message);
    return { ok: true, delivered: false, provider: 'log-only' as const };
  }

  const from = (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '').trim();
  const transporter = createSmtpTransport();

  try {
    console.log(`[CONTACT] Sending contact message to ${CONTACT_TARGET} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'}`);
    await transporter.sendMail({
      from,
      to: CONTACT_TARGET,
      subject: `[Contact Form] ${subject}`,
      text: [
        'Message received from verified contact flow.',
        `Verification method: ${session.method}`,
        `Destination used for verification: ${session.destination}`,
        '',
        message,
      ].join('\n'),
    });
    console.log('[CONTACT] Contact message sent successfully');
  } catch (error) {
    console.error('[CONTACT] Contact message send failed');
    console.error('[CONTACT] SMTP error:', error instanceof Error ? error.message : error);
    throw error;
  }

  return { ok: true, delivered: true, provider: 'smtp' as const };
}

export function getContactTarget() {
  return CONTACT_TARGET;
}
