export interface ParsedResumeData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  experience: string[];
  education: string[];
}

const COMMON_SKILLS = [
  'react',
  'typescript',
  'javascript',
  'node.js',
  'node',
  'express',
  'mongodb',
  'sql',
  'postgresql',
  'python',
  'aws',
  'docker',
  'kubernetes',
  'rest',
  'graphql',
  'java',
  'c++',
];

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  values
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      const key = value.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(value);
      }
    });

  return result;
}

function normalizeLine(line: string) {
  return line.replace(/^[-•*\u2022]\s*/, '').trim();
}

function sanitizeSkillList(skills: string[]) {
  const normalized = uniqueNonEmpty(skills);
  const lowercase = new Set(normalized.map((skill) => skill.toLowerCase()));

  return normalized.filter((skill) => {
    const key = skill.toLowerCase();
    if (key === 'node' && lowercase.has('node.js')) {
      return false;
    }
    return true;
  });
}

function extractSectionLines(text: string, sectionNames: string[]) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const normalizedSectionNames = sectionNames.map((name) => name.toLowerCase());
  const allSectionNames = [
    'summary',
    'skills',
    'experience',
    'education',
    'projects',
    'certifications',
  ];

  const startIndex = lines.findIndex((line) => {
    const lower = line.toLowerCase().replace(':', '');
    return normalizedSectionNames.includes(lower);
  });

  if (startIndex === -1) {
    return [];
  }

  const collected: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const current = lines[index].toLowerCase().replace(':', '');
    if (allSectionNames.includes(current)) {
      break;
    }
    collected.push(normalizeLine(lines[index]));
  }

  return uniqueNonEmpty(collected);
}

function parseResumeWithFallback(resumeText: string): ParsedResumeData {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = resumeText.match(/(\+?\d[\d\s().-]{7,}\d)/);

  const inferredName =
    lines.find((line) => /^[a-zA-Z][a-zA-Z\s'.-]{1,60}$/.test(line) && !line.includes('@')) || null;

  const summaryLines = extractSectionLines(resumeText, ['summary', 'profile']);
  const summary = summaryLines.length > 0 ? summaryLines.join(' ') : null;

  const skillLines = extractSectionLines(resumeText, ['skills', 'technical skills']);
  const sectionSkills = skillLines
    .join(', ')
    .split(/[,|]/)
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 1);

  const lowerResume = resumeText.toLowerCase();
  const detectedSkills = COMMON_SKILLS.filter((skill) => lowerResume.includes(skill));

  const experience = extractSectionLines(resumeText, ['experience', 'work experience']);
  const education = extractSectionLines(resumeText, ['education', 'academic background']);

  return {
    fullName: inferredName,
    email: emailMatch?.[0] ?? null,
    phone: phoneMatch?.[0]?.trim() ?? null,
    summary,
    skills: sanitizeSkillList([...sectionSkills, ...detectedSkills]).slice(0, 20),
    experience: experience.slice(0, 10),
    education: education.slice(0, 10),
  };
}

function getClaudeApiKey() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '';
  return key.trim();
}

function extractJsonObject(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in Claude response');
  }

  return text.slice(start, end + 1);
}

function coerceParsedResumeData(raw: any): ParsedResumeData {
  const toStringOrNull = (value: unknown) => {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const toStringArray = (value: unknown) => {
    if (!Array.isArray(value)) {
      return [];
    }
    return uniqueNonEmpty(value.filter((item) => typeof item === 'string'));
  };

  return {
    fullName: toStringOrNull(raw?.fullName),
    email: toStringOrNull(raw?.email),
    phone: toStringOrNull(raw?.phone),
    summary: toStringOrNull(raw?.summary),
    skills: toStringArray(raw?.skills),
    experience: toStringArray(raw?.experience),
    education: toStringArray(raw?.education),
  };
}

async function parseResumeWithClaude(resumeText: string) {
  const apiKey = getClaudeApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-latest';
  const prompt = `Extract resume data and return JSON only (no markdown, no explanation) with this schema:\n{\n  "fullName": string | null,\n  "email": string | null,\n  "phone": string | null,\n  "summary": string | null,\n  "skills": string[],\n  "experience": string[],\n  "education": string[]\n}\n\nResume:\n${resumeText.slice(0, 18000)}`;

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
        max_tokens: 1200,
        temperature: 0,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[RESUME_PARSER] Claude API error:', errorBody);
      return null;
    }

    const claudePayload = await response.json() as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const combinedText = (claudePayload.content || [])
      .filter((part) => part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text as string)
      .join('\n');

    if (!combinedText.trim()) {
      return null;
    }

    const jsonText = extractJsonObject(combinedText);
    const parsed = JSON.parse(jsonText);
    return coerceParsedResumeData(parsed);
  } catch (error) {
    console.error('[RESUME_PARSER] Claude parse failed:', error instanceof Error ? error.message : error);
    return null;
  }
}

function mergeParsedResumeData(primary: ParsedResumeData, fallback: ParsedResumeData): ParsedResumeData {
  return {
    fullName: primary.fullName || fallback.fullName,
    email: primary.email || fallback.email,
    phone: primary.phone || fallback.phone,
    summary: primary.summary || fallback.summary,
    skills: sanitizeSkillList([...primary.skills, ...fallback.skills]),
    experience: uniqueNonEmpty([...primary.experience, ...fallback.experience]),
    education: uniqueNonEmpty([...primary.education, ...fallback.education]),
  };
}

export async function parseResume(resumeText: string): Promise<{ source: 'claude' | 'fallback'; parsedData: ParsedResumeData }> {
  const fallbackParsed = parseResumeWithFallback(resumeText);
  const claudeParsed = await parseResumeWithClaude(resumeText);

  return {
    source: claudeParsed ? 'claude' : 'fallback',
    parsedData: claudeParsed
      ? mergeParsedResumeData(claudeParsed, fallbackParsed)
      : fallbackParsed,
  };
}
