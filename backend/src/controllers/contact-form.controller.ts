import { Request, Response } from 'express';
import { z } from 'zod';
import { sendError, sendSuccess } from '../helpers/response';
import { sendUnifiedContactEmail } from '../services/contact-form.service';
import { hashEmail, logContactAudit } from '../services/contact-audit.service';
import { getClientIp } from '../middlewares/contact-form-rate-limit';

// No HTML/JS injection characters in subject
const safeText = (max: number) =>
  z
    .string()
    .max(max)
    .refine((v) => !/[<>{}$`]/.test(v), 'Contains invalid characters');

const contactFormSchema = z.object({
  name: safeText(100).pipe(z.string().min(2)),
  email: z.string().email().max(254),
  subject: safeText(200).pipe(z.string().min(1)),
  message: safeText(4000).pipe(z.string().min(10)),
  context: z.enum(['business', 'technical']).default('business'),
  companyWebsite: z.string().optional(),
});

// Per-email cooldown: 1 successful submission per email per 60 s.
const EMAIL_COOLDOWN_MS = 60_000;
const EMAIL_COOLDOWN_MAP = new Map<string, number>();
const EMAIL_COOLDOWN_MAX_ENTRIES = 10_000;

function checkEmailCooldown(emailHash: string): boolean {
  // Safety valve: purge map if too large (in-process, no persistence)
  if (EMAIL_COOLDOWN_MAP.size >= EMAIL_COOLDOWN_MAX_ENTRIES) {
    EMAIL_COOLDOWN_MAP.clear();
  }
  const expiresAt = EMAIL_COOLDOWN_MAP.get(emailHash);
  if (expiresAt && Date.now() < expiresAt) {
    return false; // still in cooldown
  }
  EMAIL_COOLDOWN_MAP.set(emailHash, Date.now() + EMAIL_COOLDOWN_MS);
  return true; // allowed
}

export async function submitContactFormController(req: Request, res: Response) {
  const ip = getClientIp(req);
  const parsed = contactFormSchema.safeParse(req.body);

  if (!parsed.success) {
    logContactAudit(ip, 'unknown', String(req.body?.context ?? 'unknown'), 'validation_failed');
    return sendError(res, 'Invalid request payload', 400);
  }

  const { name, email, subject, message, context, companyWebsite } = parsed.data;
  const emailHash = hashEmail(email);

  // Honeypot: if this hidden field is populated, acknowledge without processing.
  if ((companyWebsite || '').trim().length > 0) {
    logContactAudit(ip, emailHash, context, 'honeypot_dropped');
    return sendSuccess(res, { message: 'Message sent successfully' }, 200);
  }

  // Per-email cooldown check.
  if (!checkEmailCooldown(emailHash)) {
    logContactAudit(ip, emailHash, context, 'email_cooldown');
    return res.status(429).json({ error: 'Please wait a moment before sending another message.' });
  }

  try {
    await sendUnifiedContactEmail({ name, email, subject, message, context });
    logContactAudit(ip, emailHash, context, 'sent');
    return sendSuccess(res, { message: 'Message sent successfully' }, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to send message';
    return sendError(res, errorMessage, 500);
  }
}

