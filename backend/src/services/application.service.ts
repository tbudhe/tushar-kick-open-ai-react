import { isDatabaseConnected } from '../config/database';
import { ApplicationModel, ApplicationStatus } from '../models/application.model';

export interface ApplyJobInput {
  id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  tailoredResumeText?: string;
}

export interface ApplicationRecord {
  id: string;
  jobExternalId: string;
  jobTitle: string;
  jobCompany: string;
  jobLocation: string;
  jobUrl: string;
  status: ApplicationStatus;
  notes: string;
  tailoredResumeId: string | null;
  emailDraft: string;
  appliedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const MEMORY_APPLICATIONS = new Map<string, ApplicationRecord>();

function buildEmailDraft(job: ApplyJobInput) {
  return [
    `Subject: Application for ${job.title} role`,
    '',
    `Hi ${job.company} Hiring Team,`,
    '',
    `I am excited to apply for the ${job.title} role. I have attached my tailored resume and would welcome an opportunity to discuss how my background aligns with your needs.`,
    '',
    'Thanks,',
    'Candidate',
  ].join('\n');
}

async function generateAiCoverLetter(job: ApplyJobInput, tailoredResumeText: string): Promise<string> {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return buildEmailDraft(job);
  }

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const prompt = `Write a concise, professional job application email (max 180 words) for the following.
Output only the email text starting with "Subject:" — no extra commentary.

Job Title: ${job.title}
Company: ${job.company}

Tailored Resume (excerpt):
${tailoredResumeText.slice(0, 2000)}

Requirements:
- Subject line referencing the role
- 2-3 sentence opening that connects the candidate's background to this specific role
- 1-2 sentences mentioning a relevant skill or achievement from the resume
- Brief closing requesting an interview
- Sign off as "Candidate"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: 'system', content: 'You write concise professional job application emails. Output only the email text.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return buildEmailDraft(job);
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = payload.choices?.[0]?.message?.content?.trim() || '';
    return text || buildEmailDraft(job);
  } catch {
    return buildEmailDraft(job);
  }
}

function mapDocToRecord(doc: any): ApplicationRecord {
  return {
    id: String(doc._id),
    jobExternalId: doc.jobExternalId,
    jobTitle: doc.jobTitle,
    jobCompany: doc.jobCompany,
    jobLocation: doc.jobLocation,
    jobUrl: doc.jobUrl,
    status: doc.status,
    notes: doc.notes,
    tailoredResumeId: doc.tailoredResumeId,
    emailDraft: doc.emailDraft,
    appliedAt: doc.appliedAt,
    createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : undefined,
  };
}

export async function applyToJob(input: {
  job: ApplyJobInput;
  tailoredResumeId?: string | null;
  notes?: string;
}) {
  const emailDraft = input.job.tailoredResumeText
    ? await generateAiCoverLetter(input.job, input.job.tailoredResumeText)
    : buildEmailDraft(input.job);
  const notes = (input.notes || '').trim();

  if (isDatabaseConnected()) {
    const created = await ApplicationModel.create({
      jobExternalId: input.job.id,
      jobTitle: input.job.title,
      jobCompany: input.job.company,
      jobLocation: input.job.location || '',
      jobUrl: input.job.url || '',
      status: 'pending',
      notes,
      tailoredResumeId: input.tailoredResumeId || null,
      emailDraft,
      appliedAt: null,
    });

    return {
      record: mapDocToRecord(created),
      databaseConnected: true,
    };
  }

  const id = `memory-${Date.now()}`;
  const now = new Date().toISOString();
  const record: ApplicationRecord = {
    id,
    jobExternalId: input.job.id,
    jobTitle: input.job.title,
    jobCompany: input.job.company,
    jobLocation: input.job.location || '',
    jobUrl: input.job.url || '',
    status: 'pending',
    notes,
    tailoredResumeId: input.tailoredResumeId || null,
    emailDraft,
    appliedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  MEMORY_APPLICATIONS.set(id, record);

  return {
    record,
    databaseConnected: false,
  };
}

export async function listApplications() {
  if (isDatabaseConnected()) {
    const docs = await ApplicationModel.find({})
      .sort({ updatedAt: -1 })
      .lean();

    return {
      items: docs.map(mapDocToRecord),
      databaseConnected: true,
    };
  }

  const items = Array.from(MEMORY_APPLICATIONS.values())
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  return {
    items,
    databaseConnected: false,
  };
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string) {
  if (isDatabaseConnected()) {
    const updated = await ApplicationModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          notes: (notes || '').trim(),
          appliedAt: status === 'applied' ? new Date().toISOString() : null,
        },
      },
      { new: true },
    ).lean();

    if (!updated) {
      return null;
    }

    return {
      record: mapDocToRecord(updated),
      databaseConnected: true,
    };
  }

  const existing = MEMORY_APPLICATIONS.get(id);
  if (!existing) {
    return null;
  }

  const next: ApplicationRecord = {
    ...existing,
    status,
    notes: (notes || '').trim(),
    appliedAt: status === 'applied' ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };

  MEMORY_APPLICATIONS.set(id, next);
  return {
    record: next,
    databaseConnected: false,
  };
}
