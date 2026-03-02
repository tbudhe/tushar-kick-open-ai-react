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
  source: 'claude' | 'fallback';
  tailoredResume: string;
  jobAnalysis: string;
  changeHighlights: string[];
}

function getClaudeApiKey() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '';
  return key.trim();
}

function extractKeywords(text: string, limit = 8) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const stopWords = new Set([
    'with', 'that', 'this', 'from', 'will', 'have', 'your', 'team', 'role', 'experience',
    'years', 'work', 'build', 'used', 'using', 'required', 'strong', 'skills', 'looking',
    'join', 'across', 'into', 'their', 'about', 'more', 'than', 'where', 'when', 'what',
  ]);

  const counts = new Map<string, number>();
  words.forEach((word) => {
    if (!stopWords.has(word)) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

function buildFallbackTailoring(resumeText: string, job: TailorResumeJobInput): TailorResumeResult {
  const keywords = extractKeywords(`${job.title} ${job.description}`, 6);
  const resumeLines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summaryLine = resumeLines.find((line) => /summary|profile/i.test(line))
    ? 'Summary aligned to target role'
    : 'Professional Summary';

  const tailoredSummary = `Targeting ${job.title} at ${job.company}. Emphasizes impact in ${keywords.join(', ')}.`;
  const highlightBullets = [
    `Matched role keywords: ${keywords.join(', ')}`,
    `Reframed summary toward ${job.title} responsibilities`,
    'Prioritized achievements likely relevant to the job description',
  ];

  const tailoredResume = [
    ...resumeLines.slice(0, 2),
    '',
    summaryLine,
    tailoredSummary,
    '',
    'Targeted Highlights',
    `- Applied strengths relevant to ${job.title}`,
    `- Focused on ${keywords.slice(0, 3).join(', ')}`,
    '',
    ...resumeLines.slice(2),
  ].join('\n');

  return {
    source: 'fallback',
    tailoredResume,
    jobAnalysis: `Role focus: ${job.title}. Priority themes: ${keywords.join(', ')}.`,
    changeHighlights: highlightBullets,
  };
}

function parseClaudeJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Claude response did not contain valid JSON');
  }

  return JSON.parse(text.slice(start, end + 1)) as {
    tailoredResume?: string;
    jobAnalysis?: string;
    changeHighlights?: string[];
  };
}

async function tailorWithClaude(resumeText: string, job: TailorResumeJobInput): Promise<TailorResumeResult | null> {
  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-latest';
  const ragContext = await getRagContextForTailoring(
    resumeText,
    `${job.title}\n${job.company}\n${job.description}`,
  );

  const prompt = `Tailor the resume for this job. Return JSON only with keys: tailoredResume (string), jobAnalysis (string), changeHighlights (string[] max 5).

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description.slice(0, 3500)}

Retrieved Context (RAG):
${ragContext || 'No retrieved context available'}

Original Resume:
${resumeText.slice(0, 12000)}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1800,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const text = (payload.content || [])
      .filter((part) => part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text as string)
      .join('\n');

    if (!text.trim()) {
      return null;
    }

    const parsed = parseClaudeJson(text);
    const tailoredResume = typeof parsed.tailoredResume === 'string' ? parsed.tailoredResume.trim() : '';
    const jobAnalysis = typeof parsed.jobAnalysis === 'string' ? parsed.jobAnalysis.trim() : '';
    const changeHighlights = Array.isArray(parsed.changeHighlights)
      ? parsed.changeHighlights.filter((item) => typeof item === 'string').slice(0, 5)
      : [];

    if (!tailoredResume || !jobAnalysis) {
      return null;
    }

    return {
      source: 'claude',
      tailoredResume,
      jobAnalysis,
      changeHighlights,
    };
  } catch {
    return null;
  }
}

export async function tailorResumeForJob(resumeText: string, job: TailorResumeJobInput): Promise<TailorResumeResult> {
  const claudeResult = await tailorWithClaude(resumeText, job);
  if (claudeResult) {
    return claudeResult;
  }

  return buildFallbackTailoring(resumeText, job);
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
