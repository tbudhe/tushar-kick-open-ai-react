import React from 'react';
import { Resend } from 'resend';
import ContactEmailTemplate, { ContactEmailTemplateProps } from '../emails/contact-email-template';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  context: 'business' | 'technical';
}

const APP_LABEL = 'YU AI Platform';
const DEFAULT_TARGET = 'tbudhe@yunextgenai.com';

function getResendClient() {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  return new Resend(apiKey);
}

function getSenderAddress() {
  const from = (process.env.CONTACT_FROM_EMAIL || '').trim();
  if (!from) {
    throw new Error('CONTACT_FROM_EMAIL is not configured');
  }

  return from;
}

export async function sendUnifiedContactEmail(payload: ContactFormPayload) {
  const resend = getResendClient();
  const from = getSenderAddress();
  const to = (process.env.CONTACT_TARGET_EMAIL || DEFAULT_TARGET).trim();

  const emailProps: ContactEmailTemplateProps = {
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    context: payload.context,
  };

  const result = await resend.emails.send({
    from,
    to: [to],
    subject: `${APP_LABEL}: ${payload.subject}`,
    replyTo: payload.email,
    react: React.createElement(ContactEmailTemplate, emailProps),
    text: [
      `${APP_LABEL} contact submission`,
      `From: ${payload.name} (${payload.email})`,
      `Context: ${payload.context}`,
      `Subject: ${payload.subject}`,
      '',
      payload.message,
    ].join('\n'),
  });

  if (result.error) {
    throw new Error(result.error.message || 'Failed to send email through Resend');
  }

  return { id: result.data?.id || null };
}
