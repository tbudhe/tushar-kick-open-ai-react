import crypto from 'crypto';
import { promises as dns } from 'dns';
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
const APP_MAIL_LABEL = 'YU-Ex-Gen-AI';
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

function resendEnabled() {
  return (process.env.RESEND_API_KEY || '').trim().length > 0;
}

function twilioEnabled() {
  return (
    (process.env.TWILIO_ACCOUNT_SID || '').trim().length > 0
    && (process.env.TWILIO_AUTH_TOKEN || '').trim().length > 0
    && (process.env.TWILIO_FROM_PHONE || '').trim().length > 0
  );
}

async function createSmtpTransport() {
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  let connectHost = smtpHost;

  try {
    const lookup = await dns.lookup(smtpHost, { family: 4 });
    connectHost = lookup.address;
    console.log(`[CONTACT] Resolved SMTP host ${smtpHost} to IPv4 ${connectHost}`);
  } catch (error) {
    console.warn(`[CONTACT] IPv4 DNS lookup failed for ${smtpHost}, falling back to hostname`);
    console.warn('[CONTACT] DNS lookup error:', error instanceof Error ? error.message : error);
  }

  return nodemailer.createTransport({
    host: connectHost,
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
    tls: {
      // Keep TLS validation against the original SMTP hostname.
      servername: smtpHost,
    },
  } as Parameters<typeof nodemailer.createTransport>[0]);
}

async function sendViaResend(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const from = (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '').trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API ${response.status}: ${body}`);
  }
}

async function sendVerificationEmail(destination: string, code: string) {
  const hasResend = resendEnabled();
  const hasSmtp = smtpEnabled();

  if (!hasResend && !hasSmtp) {
    console.warn('[CONTACT] SMTP is not configured. Verification code will be logged only for development use.');
    console.log(`[CONTACT] Verification code for ${destination}: ${code}`);
    return { sent: false, provider: 'log-only' as const };
  }

  const from = (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '').trim();

  if (hasResend) {
    try {
      console.log(`[CONTACT] Sending verification email to ${destination} via Resend API`);
      await sendViaResend({
        to: destination,
        subject: APP_MAIL_LABEL,
        text: `Your ${APP_MAIL_LABEL} verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your ${APP_MAIL_LABEL} verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
      });
      console.log(`[CONTACT] Verification email sent to ${destination} via Resend API`);
      return { sent: true, provider: 'resend' as const };
    } catch (error) {
      console.error(`[CONTACT] Resend verification email failed for ${destination}`);
      console.error('[CONTACT] Resend error:', error instanceof Error ? error.message : error);
      if (!hasSmtp) {
        throw error;
      }
      console.warn('[CONTACT] Falling back to SMTP after Resend failure');
    }
  }

  const transporter = await createSmtpTransport();

  try {
    console.log(`[CONTACT] Sending verification email to ${destination} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'}`);
    await transporter.sendMail({
      from,
      to: destination,
      subject: APP_MAIL_LABEL,
      text: `Your ${APP_MAIL_LABEL} verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your ${APP_MAIL_LABEL} verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
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

export async function sendContactMessage(sessionId: string, subject: string, message: string, name = '') {
  const session = sessionStore.get(sessionId);
  if (!session) return { ok: false, reason: 'session-not-found' as const };
  if (!session.verified) return { ok: false, reason: 'not-verified' as const };
  if (Date.now() > session.expiresAt) return { ok: false, reason: 'session-expired' as const };

  const hasResend = resendEnabled();
  const hasSmtp = smtpEnabled();

  if (!hasResend && !hasSmtp) {
    console.warn('[CONTACT] SMTP is not configured. Message logged only for development use.');
    console.log('[CONTACT] Message subject:', subject);
    console.log('[CONTACT] Message body:', message);
    return { ok: true, delivered: false, provider: 'log-only' as const };
  }

  const from = (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || '').trim();

  if (hasResend) {
    try {
      console.log(`[CONTACT] Sending contact message to ${CONTACT_TARGET} via Resend API`);
      await sendViaResend({
        to: CONTACT_TARGET,
        subject: `${APP_MAIL_LABEL}: ${subject}`,
        text: [
          `${APP_MAIL_LABEL} message`,
          name ? `Name: ${name}` : '',
          `Email: ${session.destination}`,
          '',
          message,
        ].filter(Boolean).join('\n'),
        html: [
          `<p><strong>${APP_MAIL_LABEL} message</strong></p>`,
          name ? `<p><strong>Name:</strong> ${name}</p>` : '',
          `<p><strong>Email:</strong> ${session.destination}</p>`,
          '<hr/>',
          `<pre>${message}</pre>`,
        ].filter(Boolean).join(''),
      });
      console.log('[CONTACT] Contact message sent successfully via Resend API');
      return { ok: true, delivered: true, provider: 'resend' as const };
    } catch (error) {
      console.error('[CONTACT] Resend contact message failed');
      console.error('[CONTACT] Resend error:', error instanceof Error ? error.message : error);
      if (!hasSmtp) {
        throw error;
      }
      console.warn('[CONTACT] Falling back to SMTP after Resend failure');
    }
  }

  const transporter = await createSmtpTransport();

  try {
    console.log(`[CONTACT] Sending contact message to ${CONTACT_TARGET} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || '587'}`);
    await transporter.sendMail({
      from,
      to: CONTACT_TARGET,
      subject: `${APP_MAIL_LABEL}: ${subject}`,
      text: [
        `${APP_MAIL_LABEL} message`,
        name ? `Name: ${name}` : '',
        `Email: ${session.destination}`,
        '',
        message,
      ].filter(Boolean).join('\n'),
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
