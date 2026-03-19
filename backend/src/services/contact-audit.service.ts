import { createHash } from 'crypto';

export type AuditDisposition =
  | 'sent'
  | 'honeypot_dropped'
  | 'rate_limited'
  | 'email_cooldown'
  | 'validation_failed';

export function hashEmail(email: string): string {
  return createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex')
    .slice(0, 16);
}

export function logContactAudit(
  ip: string,
  emailHash: string,
  context: string,
  disposition: AuditDisposition,
): void {
  console.log(
    JSON.stringify({
      service: 'contact-form',
      timestamp: new Date().toISOString(),
      ip,
      emailHash,
      context,
      disposition,
    }),
  );
}
