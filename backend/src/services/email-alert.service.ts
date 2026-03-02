import { ApplicationRecord } from './application.service';

type AlertResult = {
  sent: boolean;
  reason?: string;
};

function isEmailNotificationsEnabled() {
  return (process.env.FEATURE_EMAIL_NOTIFICATIONS || '').trim().toLowerCase() === 'true';
}

function getSendGridConfig() {
  return {
    apiKey: (process.env.SENDGRID_API_KEY || '').trim(),
    from: (process.env.ALERT_EMAIL_FROM || process.env.TEST_EMAIL || '').trim(),
    to: (process.env.ALERT_EMAIL_TO || process.env.TEST_EMAIL || '').trim(),
  };
}

function buildApplicationAlert(record: ApplicationRecord) {
  const subject = `New application tracked: ${record.jobTitle} @ ${record.jobCompany}`;
  const text = [
    'A new job application was created in your dashboard.',
    '',
    `Role: ${record.jobTitle}`,
    `Company: ${record.jobCompany}`,
    `Location: ${record.jobLocation || 'N/A'}`,
    `Status: ${record.status}`,
    `Applied At: ${record.appliedAt || 'N/A'}`,
    `Job URL: ${record.jobUrl || 'N/A'}`,
    `Notes: ${record.notes || 'N/A'}`,
  ].join('\n');

  const html = `
    <h2>New application tracked</h2>
    <p><strong>Role:</strong> ${record.jobTitle}</p>
    <p><strong>Company:</strong> ${record.jobCompany}</p>
    <p><strong>Location:</strong> ${record.jobLocation || 'N/A'}</p>
    <p><strong>Status:</strong> ${record.status}</p>
    <p><strong>Applied At:</strong> ${record.appliedAt || 'N/A'}</p>
    <p><strong>Job URL:</strong> ${record.jobUrl || 'N/A'}</p>
    <p><strong>Notes:</strong> ${record.notes || 'N/A'}</p>
  `;

  return { subject, text, html };
}

async function sendViaSendGrid(payload: {
  subject: string;
  text: string;
  html: string;
}): Promise<AlertResult> {
  const config = getSendGridConfig();

  if (!config.apiKey) {
    return { sent: false, reason: 'sendgrid-api-key-missing' };
  }

  if (!config.from || !config.to) {
    return { sent: false, reason: 'alert-email-from-or-to-missing' };
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: config.to }] }],
      from: { email: config.from },
      subject: payload.subject,
      content: [
        { type: 'text/plain', value: payload.text },
        { type: 'text/html', value: payload.html },
      ],
    }),
  });

  if (!response.ok) {
    return { sent: false, reason: `sendgrid-http-${response.status}` };
  }

  return { sent: true };
}

export async function sendApplicationCreatedAlert(record: ApplicationRecord): Promise<AlertResult> {
  if (!isEmailNotificationsEnabled()) {
    return { sent: false, reason: 'feature-disabled' };
  }

  try {
    const payload = buildApplicationAlert(record);
    return await sendViaSendGrid(payload);
  } catch (error) {
    console.error('[EMAIL_ALERT] Failed to send application alert:', error);
    return { sent: false, reason: 'send-failed' };
  }
}
