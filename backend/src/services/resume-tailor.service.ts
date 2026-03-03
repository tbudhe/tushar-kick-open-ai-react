import { isDatabaseConnected } from '../config/database';
import { getRagContextForTailoring, upsertRagDocument } from './rag.service';
import { TailoredResumeModel } from '../models/tailored-resume.model';

export interface TailorResumeJobInput {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface TailorResumeResult {
  source: 'openai';
  tailoredResume: string;
  jobAnalysis: string;
  changeHighlights: string[];
}

export type ResumeTemplateKey = 'classic' | 'impact' | 'compact';

interface TemplateGuide {
  label: string;
  sectionOrder: string[];
  styleHint: string;
}

const TEMPLATE_GUIDES: Record<ResumeTemplateKey, TemplateGuide> = {
  classic: {
    label: 'Classic Professional',
    sectionOrder: ['Summary', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications'],
    styleHint: 'Use professional, balanced detail with clear bullet points in standard section order.',
  },
  impact: {
    label: 'Impact Focused',
    sectionOrder: ['Summary', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education'],
    styleHint: 'Prioritize measurable impact and achievements, especially in Experience and Projects.',
  },
  compact: {
    label: 'Compact ATS',
    sectionOrder: ['Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications'],
    styleHint: 'Keep language concise and ATS-friendly. Favor compact lines and keyword-rich statements.',
  },
};

function getOpenAiApiKey() {
  const key = process.env.OPENAI_API_KEY || '';
  return key.trim();
}
function parseModelJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model response did not contain valid JSON');
  }

  return JSON.parse(text.slice(start, end + 1)) as {
    tailoredResume?: string;
    jobAnalysis?: string;
    changeHighlights?: string[];
  };
}

async function tailorWithOpenAi(
  resumeText: string,
  job: TailorResumeJobInput,
  resumeTemplate: ResumeTemplateKey,
): Promise<TailorResumeResult> {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for trailer resume generation');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const templateGuide = TEMPLATE_GUIDES[resumeTemplate];
  const ragContext = await getRagContextForTailoring(
    resumeText,
    `${job.title}\n${job.company}\n${job.description}`,
  );

  const prompt = `Tailor the resume for this job. Return JSON only with keys: tailoredResume (string), jobAnalysis (string), changeHighlights (string[] max 5).

Use this resume template:
- Template Key: ${resumeTemplate}
- Template Name: ${templateGuide.label}
- Section Order: ${templateGuide.sectionOrder.join(' > ')}
- Style Guidance: ${templateGuide.styleHint}

Ensure the tailored resume is complete and includes core sections when possible: Summary, Skills, Experience, Education, Projects, Certifications.
Do not output a skills-only resume. Preserve and improve concrete role content from Experience, Education, Projects, and Certifications whenever available.
Keep the resume line-based and section-based so each point can be compared item-by-item in a side-by-side UI.

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description.slice(0, 3500)}

Retrieved Context (RAG):
${ragContext || 'No retrieved context available'}

Original Resume:
${resumeText.slice(0, 12000)}

Return strict JSON with this shape only:
{
  "tailoredResume": "string",
  "jobAnalysis": "string",
  "changeHighlights": ["string", "string"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume tailoring assistant. Output valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    if (response.status === 401) {
      throw new Error('OpenAI authentication failed. Verify OPENAI_API_KEY in your environment.');
    }

    if (response.status === 429) {
      if (errorBody.includes('insufficient_quota')) {
        throw new Error('OpenAI quota exceeded for this API key. Update billing/quota or use a different key.');
      }
      throw new Error('OpenAI rate limit reached. Retry after a short wait.');
    }

    throw new Error(`OpenAI request failed (${response.status}). Please retry or verify API settings.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = payload.choices?.[0]?.message?.content || '';
  if (!text.trim()) {
    throw new Error('OpenAI returned an empty tailoring response');
  }

  const parsed = parseModelJson(text);
  const tailoredResume = typeof parsed.tailoredResume === 'string' ? parsed.tailoredResume.trim() : '';
  const jobAnalysis = typeof parsed.jobAnalysis === 'string' ? parsed.jobAnalysis.trim() : '';
  const changeHighlights = Array.isArray(parsed.changeHighlights)
    ? parsed.changeHighlights.filter((item) => typeof item === 'string').slice(0, 5)
    : [];

  if (!tailoredResume || !jobAnalysis) {
    throw new Error('OpenAI response missing required fields tailoredResume/jobAnalysis');
  }

  return {
    source: 'openai',
    tailoredResume,
    jobAnalysis,
    changeHighlights,
  };
}

export async function tailorResumeForJob(
  resumeText: string,
  job: TailorResumeJobInput,
  resumeTemplate: ResumeTemplateKey = 'classic',
): Promise<TailorResumeResult> {
  return tailorWithOpenAi(resumeText, job, resumeTemplate);
}

export async function persistTailoredResume(
  job: TailorResumeJobInput,
  originalResume: string,
  tailored: TailorResumeResult,
) {
  const ragDocumentId = `tailored-${job.id}-${Date.now()}`;
  await upsertRagDocument({
    id: ragDocumentId,
    text: `${job.title}\n${job.company}\n${job.description}\n\n${tailored.tailoredResume}`,
    metadata: {
      kind: 'tailored_resume',
      jobId: job.id,
      jobTitle: job.title,
      jobCompany: job.company,
      source: tailored.source,
    },
  });

  if (!isDatabaseConnected()) {
    return { saved: false, id: null as string | null, ragDocumentId };
  }

  const created = await TailoredResumeModel.create({
    jobExternalId: job.id,
    jobTitle: job.title,
    jobCompany: job.company,
    jobDescription: job.description,
    originalResume,
    tailoredResume: tailored.tailoredResume,
    jobAnalysis: tailored.jobAnalysis,
    changeHighlights: tailored.changeHighlights,
    source: tailored.source,
  });

  return { saved: true, id: String(created._id), ragDocumentId };
}
