import React, { useEffect, useMemo, useState } from 'react';
import { Document, HeadingLevel, Packer, Paragraph } from 'docx';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
  source: string;
  employmentType: string;
  publishedAt: string | null;
}

interface ParsedResumeData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  experience: string[];
  education: string[];
}

interface ParseResumeResponse {
  success: boolean;
  source: 'claude' | 'fallback';
  fileName: string;
  parsedData: ParsedResumeData;
}

interface JobsResponse {
  success: boolean;
  count: number;
  jobs: Job[];
}

interface SearchJobsResponse extends JobsResponse {
  persisted: number;
  databaseConnected: boolean;
}

interface ApplyResponse {
  success: boolean;
  databaseConnected: boolean;
  application: {
    id: string;
    status: 'pending' | 'applied' | 'rejected' | 'interview';
  };
}

interface TailorResumeResponse {
  success: boolean;
  source: 'openai' | 'claude' | 'fallback';
  originalResume: string;
  tailoredResume: string;
  jobAnalysis: string;
  changeHighlights: string[];
  saved: boolean;
  tailoredId: string | null;
  ragDocumentId: string | null;
}

interface RagUpsertResponse {
  success: boolean;
  id: string;
  backend: 'pinecone' | 'mongo' | 'memory';
  embeddingProvider: 'openai' | 'gemini' | 'fallback';
}

interface RagRetrievedItem {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  score: number;
}

interface RagRetrieveResponse {
  success: boolean;
  backend: 'pinecone' | 'mongo' | 'memory';
  embeddingProvider: 'openai' | 'gemini' | 'fallback';
  items: RagRetrievedItem[];
}

interface RagBenchmarkRow {
  provider: 'openai' | 'gemini' | 'fallback';
  upsertOk: boolean;
  backend: 'pinecone' | 'mongo' | 'memory' | 'n/a';
  retrievedCount: number;
  topScore: number;
  upsertMs: number;
  retrieveMs: number;
  tokenEstimate: number;
  estCostUsd: number;
  error?: string;
}

interface RagBenchmarkRunsSaveResponse {
  success: boolean;
  saved: boolean;
  runId?: string;
  reason?: string;
}

interface JobFilters {
  query: string;
  location: string;
  employmentType: string;
}

type ResumeTemplateKey = 'classic' | 'impact' | 'compact';

interface ResumeTemplateDefinition {
  label: string;
  sectionOrder: string[];
  skillsInline: boolean;
}

interface StructuredResume {
  headerLines: string[];
  sections: Record<string, string[]>;
}

type TrailerDecision = 'accepted' | 'skipped';

interface ComparisonSection {
  sectionTitle: string;
  originalItems: string[];
  trailerItems: string[];
}

const SAMPLE_RESUME = `Alex Johnson
Email: alex.johnson@example.com
Phone: +1 (415) 555-1290

Summary
Full-stack engineer with 6 years of experience building React and Node.js applications. Strong focus on performance, reliability, and product iteration.

Skills
React, TypeScript, Node.js, Express, MongoDB, REST APIs, AWS, Docker

Experience
Senior Software Engineer - CloudNova (2022 - Present)
- Led migration from JavaScript to TypeScript across 4 frontend apps
- Improved page load performance by 35%

Software Engineer - BrightStack (2019 - 2022)
- Built internal analytics dashboards used by 120+ team members

Education
B.S. Computer Science, University of Washington (2019)
`;

const TEXT_BASED_EXTENSIONS = new Set(['txt', 'md', 'json', 'rtf']);

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function buildResumeTextFromParsed(parsed: ParsedResumeData) {
  return [
    parsed.fullName ? `${parsed.fullName}` : '',
    parsed.email ? `Email: ${parsed.email}` : '',
    parsed.phone ? `Phone: ${parsed.phone}` : '',
    '',
    'Summary',
    parsed.summary || '',
    '',
    'Skills',
    parsed.skills.join(', '),
    '',
    'Experience',
    parsed.experience.join('\n'),
    '',
    'Education',
    parsed.education.join('\n'),
  ]
    .map((line) => line.trimEnd())
    .filter((line, index, array) => line || (array[index - 1] && array[index - 1] !== ''))
    .join('\n');
}

function estimateTokens(input: string) {
  return Math.max(1, Math.ceil(input.length / 4));
}

function estimateEmbeddingCost(provider: 'openai' | 'gemini' | 'fallback', tokens: number) {
  const per1k = provider === 'openai' ? 0.00002 : provider === 'gemini' ? 0.00001 : 0;
  return Number(((tokens / 1000) * per1k).toFixed(6));
}

const RESUME_SECTIONS = new Set(['Summary', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications']);

const SECTION_ALIASES: Record<string, string> = {
  summary: 'Summary',
  'professional summary': 'Summary',
  objective: 'Summary',
  'career objective': 'Summary',
  profile: 'Summary',
  skills: 'Skills',
  'core skills': 'Skills',
  'technical skills': 'Skills',
  'key skills': 'Skills',
  technologies: 'Skills',
  'technical expertise': 'Skills',
  experience: 'Experience',
  'professional experience': 'Experience',
  'work experience': 'Experience',
  'work history': 'Experience',
  'employment history': 'Experience',
  employment: 'Experience',
  education: 'Education',
  academics: 'Education',
  'academic background': 'Education',
  projects: 'Projects',
  'key projects': 'Projects',
  'personal projects': 'Projects',
  certifications: 'Certifications',
  certification: 'Certifications',
  'licenses & certifications': 'Certifications',
  'certifications & licenses': 'Certifications',
};

const RESUME_TEMPLATES: Record<ResumeTemplateKey, ResumeTemplateDefinition> = {
  classic: {
    label: 'Classic Professional',
    sectionOrder: ['Summary', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications'],
    skillsInline: false,
  },
  impact: {
    label: 'Impact Focused',
    sectionOrder: ['Summary', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education'],
    skillsInline: false,
  },
  compact: {
    label: 'Compact ATS',
    sectionOrder: ['Summary', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications'],
    skillsInline: true,
  },
};

function normalizeSectionHeading(rawHeading: string) {
  const normalized = rawHeading
    .trim()
    .replace(/^#+\s*/, '')
    .replace(/^\*+|\*+$/g, '')
    .replace(/:$/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  return SECTION_ALIASES[normalized] || null;
}

function dedupeCaseInsensitive(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function parseResumeIntoSections(resumeText: string): StructuredResume {
  const sections: Record<string, string[]> = {};
  const headerLines: string[] = [];

  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let activeSection: string | null = null;

  lines.forEach((line) => {
    const sectionHeading = normalizeSectionHeading(line);

    if (sectionHeading) {
      activeSection = sectionHeading;
      if (!sections[activeSection]) {
        sections[activeSection] = [];
      }
      return;
    }

    if (!activeSection) {
      headerLines.push(line);
      return;
    }

    const normalizedLine = line.replace(/^[-•]\s+/, '').trim();
    if (!normalizedLine) {
      return;
    }

    if (activeSection === 'Skills' && normalizedLine.includes(',') && !/^[-•]\s+/.test(line)) {
      normalizedLine
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((skill) => {
          sections[activeSection]?.push(skill);
        });
      return;
    }

    sections[activeSection]?.push(normalizedLine);
  });

  const dedupedSections = Object.fromEntries(
    Object.entries(sections).map(([section, items]) => [section, dedupeCaseInsensitive(items)]),
  );

  return {
    headerLines: dedupeCaseInsensitive(headerLines),
    sections: dedupedSections,
  };
}

function buildItemDecisionKey(sectionTitle: string, index: number, text: string) {
  return `${sectionTitle}::${index}::${text.trim().toLowerCase()}`;
}

function buildSectionOrder(templateOrder: string[], originalSections: Record<string, string[]>, trailerSections: Record<string, string[]>) {
  const extras = new Set<string>();

  Object.keys(originalSections).forEach((section) => {
    if (!templateOrder.includes(section)) {
      extras.add(section);
    }
  });
  Object.keys(trailerSections).forEach((section) => {
    if (!templateOrder.includes(section)) {
      extras.add(section);
    }
  });

  return [...templateOrder, ...Array.from(extras)];
}

function buildComparisonSections(
  orderedSections: string[],
  originalSections: Record<string, string[]>,
  trailerSections: Record<string, string[]>,
): ComparisonSection[] {
  return orderedSections
    .map((sectionTitle) => ({
      sectionTitle,
      originalItems: originalSections[sectionTitle] || [],
      trailerItems: trailerSections[sectionTitle] || [],
    }))
    .filter((section) => section.originalItems.length > 0 || section.trailerItems.length > 0);
}

function buildFinalResumeFromSelections(
  headerLines: string[],
  orderedSections: string[],
  originalSections: Record<string, string[]>,
  acceptedItemsBySection: Record<string, string[]>,
  template: ResumeTemplateDefinition,
) {
  const normalizedHeader = dedupeCaseInsensitive(headerLines).slice(0, 4);
  const lines: string[] = [];

  if (normalizedHeader.length > 0) {
    lines.push(...normalizedHeader, '');
  }

  orderedSections.forEach((section) => {
    const items = dedupeCaseInsensitive([
      ...(originalSections[section] || []),
      ...(acceptedItemsBySection[section] || []),
    ]);
    if (items.length === 0) {
      return;
    }

    lines.push(section);

    if (section === 'Summary' && items.length === 1) {
      lines.push(items[0]);
    } else if (section === 'Skills' && template.skillsInline) {
      lines.push(items.join(', '));
    } else {
      items.forEach((item) => {
        lines.push(`- ${item}`);
      });
    }

    lines.push('');
  });

  return lines
    .map((line) => line.trimEnd())
    .filter((line, index, array) => line || (array[index - 1] && array[index - 1] !== ''))
    .join('\n')
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildResumePreviewHtml(resume: string) {
  const lines = resume.split(/\r?\n/);
  let html = '<div class="resume-html-content">';
  let listOpen = false;

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      return;
    }

    const normalized = line.replace(/:$/, '');
    if (index === 0) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      html += `<h2>${escapeHtml(line)}</h2>`;
      return;
    }

    if (RESUME_SECTIONS.has(normalized)) {
      if (listOpen) {
        html += '</ul>';
        listOpen = false;
      }
      html += `<h3>${escapeHtml(normalized)}</h3>`;
      return;
    }

    if (/^[-•]\s+/.test(line)) {
      if (!listOpen) {
        html += '<ul>';
        listOpen = true;
      }
      html += `<li>${escapeHtml(line.replace(/^[-•]\s+/, ''))}</li>`;
      return;
    }

    if (listOpen) {
      html += '</ul>';
      listOpen = false;
    }
    html += `<p>${escapeHtml(line)}</p>`;
  });

  if (listOpen) {
    html += '</ul>';
  }

  html += '</div>';
  return html;
}

function buildHtmlDocument(contentHtml: string, title: string) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 32px; color: #111827; line-height: 1.5; }
    h1 { font-size: 28px; margin: 0 0 20px; }
    h2 { font-size: 24px; margin: 0 0 14px; }
    h3 { font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    p, li { font-size: 14px; margin: 0 0 8px; }
    ul { margin: 0 0 12px 20px; padding: 0; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${contentHtml}
</body>
</html>`;
}

function buildResumeDocxParagraphs(resume: string) {
  const lines = resume.split(/\r?\n/);
  return lines.map((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      return new Paragraph('');
    }

    const normalized = line.replace(/:$/, '');
    if (index === 0) {
      return new Paragraph({ text: line, heading: HeadingLevel.TITLE });
    }
    if (RESUME_SECTIONS.has(normalized)) {
      return new Paragraph({ text: normalized, heading: HeadingLevel.HEADING_2 });
    }
    if (/^[-•]\s+/.test(line)) {
      return new Paragraph({ text: line.replace(/^[-•]\s+/, ''), bullet: { level: 0 } });
    }
    return new Paragraph(line);
  });
}

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobError, setJobError] = useState('');
  const [searchMessage, setSearchMessage] = useState('');

  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedResult, setParsedResult] = useState<ParseResumeResponse | null>(null);

  const [selectedJobForTailoring, setSelectedJobForTailoring] = useState<Job | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringError, setTailoringError] = useState('');
  const [tailorResult, setTailorResult] = useState<TailorResumeResponse | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [selectedResumeTemplate, setSelectedResumeTemplate] = useState<ResumeTemplateKey>('classic');
  const [acceptedItemsBySection, setAcceptedItemsBySection] = useState<Record<string, string[]>>({});
  const [itemDecisions, setItemDecisions] = useState<Record<string, TrailerDecision>>({});
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const [ragDocId, setRagDocId] = useState('doc-sample-1');
  const [ragDocText, setRagDocText] = useState('');
  const [ragDocMetadata, setRagDocMetadata] = useState('{"kind":"manual_note"}');
  const [ragQuery, setRagQuery] = useState('react node resume tailoring');
  const [ragTopK, setRagTopK] = useState(3);
  const [isRagUpserting, setIsRagUpserting] = useState(false);
  const [isRagRetrieving, setIsRagRetrieving] = useState(false);
  const [isRagRunning, setIsRagRunning] = useState(false);
  const [isRagBenchmarking, setIsRagBenchmarking] = useState(false);
  const [ragStatus, setRagStatus] = useState('');
  const [ragError, setRagError] = useState('');
  const [ragResult, setRagResult] = useState<RagRetrieveResponse | null>(null);
  const [ragBenchmarkRows, setRagBenchmarkRows] = useState<RagBenchmarkRow[]>([]);
  const [ragBenchmarkRunId, setRagBenchmarkRunId] = useState<string | null>(null);

  const resetComparisonState = () => {
    setAcceptedItemsBySection({});
    setItemDecisions({});
  };

  const fetchStoredJobs = async (filters?: Partial<JobFilters>) => {
    setIsLoadingJobs(true);
    setJobError('');

    try {
      const effectiveFilters: JobFilters = {
        query: filters?.query ?? searchQuery,
        location: filters?.location ?? locationFilter,
        employmentType: filters?.employmentType ?? employmentTypeFilter,
      };

      const params = new URLSearchParams({
        limit: '20',
      });

      if (effectiveFilters.query.trim()) {
        params.append('query', effectiveFilters.query.trim());
      }
      if (effectiveFilters.location.trim()) {
        params.append('location', effectiveFilters.location.trim());
      }
      if (effectiveFilters.employmentType.trim()) {
        params.append('employmentType', effectiveFilters.employmentType.trim());
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = (await response.json()) as JobsResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to load jobs');
      }

      setJobs(data.jobs);
      setSearchMessage(`Loaded ${data.count} stored jobs`);
    } catch (error) {
      setJobError(error instanceof Error ? error.message : 'Unexpected error loading jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    void fetchStoredJobs();
  }, []);

  const handleResumeFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name);
    setSelectedFile(file);
    setResumeFileName(file.name);
    setParsedResult(null);
    setParseError('');
    setTailorResult(null);
    setTailoringError('');
    resetComparisonState();

    if (!TEXT_BASED_EXTENSIONS.has(extension)) {
      setResumeText('');
      return;
    }

    try {
      const text = await file.text();
      setResumeText(text);
    } catch {
      setParseError('Unable to read the selected file. Please upload a plain text resume.');
    }
  };

  const handleParseResume = async () => {
    if (!selectedFile) {
      setParseError('Upload a resume file before parsing.');
      return;
    }

    setIsParsing(true);
    setParseError('');
    setParsedResult(null);

    try {
      const formData = new FormData();
      formData.append('resumeFile', selectedFile);
      if (resumeFileName) {
        formData.append('fileName', resumeFileName);
      }

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as ParseResumeResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to parse resume');
      }

      setParsedResult(data);
      setResumeText(buildResumeTextFromParsed(data.parsedData));
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Unexpected error parsing resume');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSearchJobs = async () => {
    setIsLoadingJobs(true);
    setJobError('');

    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location: locationFilter,
          employmentType: employmentTypeFilter,
          limit: 20,
        }),
      });

      const data = (await response.json()) as SearchJobsResponse | { error: string };

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to search jobs');
      }

      setJobs(data.jobs);
      setSearchMessage(
        data.databaseConnected
          ? `Found ${data.count} jobs • persisted ${data.persisted} records`
          : `Found ${data.count} jobs • database not connected, showing non-persisted results`,
      );
    } catch (error) {
      setJobError(error instanceof Error ? error.message : 'Unexpected error searching jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setEmploymentTypeFilter('');
    setSearchMessage('Filters reset');
    void fetchStoredJobs({ query: '', location: '', employmentType: '' });
  };

  const handleSelectJobForTailoring = (job: Job) => {
    setSelectedJobForTailoring(job);
    setTailoringError('');
    setTailorResult(null);
    resetComparisonState();
  };

  const handleTailorResume = async () => {
    if (!selectedJobForTailoring) {
      setTailoringError('Select a job before tailoring resume.');
      return;
    }

    if (!resumeText.trim()) {
      setTailoringError('Upload and parse your resume before tailoring.');
      return;
    }

    setIsTailoring(true);
    setTailoringError('');

    try {
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          resumeTemplate: selectedResumeTemplate,
          job: {
            id: selectedJobForTailoring.id,
            title: selectedJobForTailoring.title,
            company: selectedJobForTailoring.company,
            description: selectedJobForTailoring.description,
          },
        }),
      });

      const data = (await response.json()) as TailorResumeResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to tailor resume');
      }

      setTailorResult(data);
      resetComparisonState();
      if (data.ragDocumentId) {
        setRagDocId(data.ragDocumentId);
      }
    } catch (error) {
      setTailoringError(error instanceof Error ? error.message : 'Unexpected error tailoring resume');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplyToJob = async (
    job: Job,
    options?: { useTailoredResume: boolean; mergeDecision: 'accepted' | 'skipped' },
  ) => {
    setApplyingJobId(job.id);
    setJobError('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            url: job.url,
          },
          tailoredResumeId: options?.useTailoredResume ? (tailorResult?.tailoredId || null) : null,
          notes: options ? `resume-merge-${options.mergeDecision}` : '',
        }),
      });

      const data = (await response.json()) as ApplyResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to create application');
      }

      const suffix = options
        ? ` (${options.mergeDecision === 'accepted' ? 'merged tailored resume' : 'kept original resume'})`
        : '';
      setSearchMessage(`Application created for ${job.title}${suffix}. Track it on Applications page.`);
    } catch (error) {
      setJobError(error instanceof Error ? error.message : 'Unexpected apply error');
    } finally {
      setApplyingJobId(null);
    }
  };

  const templateDefinition = RESUME_TEMPLATES[selectedResumeTemplate];

  const originalStructuredResume = useMemo(
    () => (tailorResult ? parseResumeIntoSections(tailorResult.originalResume) : null),
    [tailorResult],
  );

  const trailerStructuredResume = useMemo(
    () => (tailorResult ? parseResumeIntoSections(tailorResult.tailoredResume) : null),
    [tailorResult],
  );

  const sectionOrder = useMemo(() => {
    if (!originalStructuredResume || !trailerStructuredResume) {
      return templateDefinition.sectionOrder;
    }

    return buildSectionOrder(
      templateDefinition.sectionOrder,
      originalStructuredResume.sections,
      trailerStructuredResume.sections,
    );
  }, [templateDefinition, originalStructuredResume, trailerStructuredResume]);

  const comparisonSections = useMemo(() => {
    if (!originalStructuredResume || !trailerStructuredResume) {
      return [];
    }

    return buildComparisonSections(sectionOrder, originalStructuredResume.sections, trailerStructuredResume.sections);
  }, [sectionOrder, originalStructuredResume, trailerStructuredResume]);

  const trailerItemCount = useMemo(
    () => comparisonSections.reduce((total, section) => total + section.trailerItems.length, 0),
    [comparisonSections],
  );

  const processedTrailerItemCount = useMemo(() => {
    return comparisonSections.reduce((count, section) => {
      return count + section.trailerItems.reduce((sectionCount, item, index) => {
        const key = buildItemDecisionKey(section.sectionTitle, index, item);
        return itemDecisions[key] ? sectionCount + 1 : sectionCount;
      }, 0);
    }, 0);
  }, [comparisonSections, itemDecisions]);

  const acceptedTrailerItemCount = useMemo(
    () => Object.values(acceptedItemsBySection).reduce((total, items) => total + items.length, 0),
    [acceptedItemsBySection],
  );

  const isComparisonComplete = trailerItemCount > 0 && processedTrailerItemCount === trailerItemCount;

  const finalResumeText = useMemo(() => {
    if (!originalStructuredResume) {
      return '';
    }

    return buildFinalResumeFromSelections(
      originalStructuredResume.headerLines,
      sectionOrder,
      originalStructuredResume.sections,
      acceptedItemsBySection,
      templateDefinition,
    );
  }, [originalStructuredResume, sectionOrder, acceptedItemsBySection, templateDefinition]);

  const handleAcceptTrailerItem = (sectionTitle: string, item: string, index: number) => {
    const key = buildItemDecisionKey(sectionTitle, index, item);
    setItemDecisions((previous) => ({ ...previous, [key]: 'accepted' }));

    setAcceptedItemsBySection((previous) => {
      const existing = previous[sectionTitle] || [];
      const existsAlready = existing.some((entry) => entry.trim().toLowerCase() === item.trim().toLowerCase());
      if (existsAlready) {
        return previous;
      }

      return {
        ...previous,
        [sectionTitle]: [...existing, item],
      };
    });

    setTailoringError('');
  };

  const handleSkipTrailerItem = (sectionTitle: string, item: string, index: number) => {
    const key = buildItemDecisionKey(sectionTitle, index, item);
    setItemDecisions((previous) => ({ ...previous, [key]: 'skipped' }));

    setAcceptedItemsBySection((previous) => {
      const existing = previous[sectionTitle] || [];
      return {
        ...previous,
        [sectionTitle]: existing.filter((entry) => entry.trim().toLowerCase() !== item.trim().toLowerCase()),
      };
    });

    setTailoringError('');
  };

  const handleAcceptEntireSection = (sectionTitle: string, sectionItems: string[]) => {
    setAcceptedItemsBySection((previous) => {
      const combined = [...(previous[sectionTitle] || []), ...sectionItems];
      return {
        ...previous,
        [sectionTitle]: dedupeCaseInsensitive(combined),
      };
    });

    setItemDecisions((previous) => {
      const updates: Record<string, TrailerDecision> = { ...previous };
      sectionItems.forEach((item, index) => {
        updates[buildItemDecisionKey(sectionTitle, index, item)] = 'accepted';
      });
      return updates;
    });

    setTailoringError('');
  };

  const handleSkipEntireSection = (sectionTitle: string, sectionItems: string[]) => {
    setAcceptedItemsBySection((previous) => ({
      ...previous,
      [sectionTitle]: [],
    }));

    setItemDecisions((previous) => {
      const updates: Record<string, TrailerDecision> = { ...previous };
      sectionItems.forEach((item, index) => {
        updates[buildItemDecisionKey(sectionTitle, index, item)] = 'skipped';
      });
      return updates;
    });

    setTailoringError('');
  };

  const handleApplyUsingFinalResume = async () => {
    if (!selectedJobForTailoring || !tailorResult || !finalResumeText.trim()) {
      setTailoringError('Generate and review resume comparison before applying.');
      return;
    }

    if (!isComparisonComplete) {
      setTailoringError('Complete all section decisions (Accept/Skip every trailer item) before applying.');
      return;
    }

    setResumeText(finalResumeText);
    await handleApplyToJob(selectedJobForTailoring, {
      useTailoredResume: true,
      mergeDecision: 'accepted',
    });
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const handleDownloadFinalResumeHtml = () => {
    if (!finalResumeText.trim()) {
      setTailoringError('Accept at least one trailer item to create a final resume before downloading.');
      return;
    }

    const fileBase = selectedJobForTailoring?.title?.replace(/\s+/g, '-').toLowerCase() || 'final-resume';
    const html = buildHtmlDocument(buildResumePreviewHtml(finalResumeText), 'Final Resume');
    triggerDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), `${fileBase}.html`);
  };

  const handleDownloadFinalResumeDocx = async () => {
    if (!finalResumeText.trim()) {
      setTailoringError('Accept at least one trailer item to create a final resume before downloading.');
      return;
    }

    setIsExportingDocx(true);
    try {
      const paragraphs = buildResumeDocxParagraphs(finalResumeText);
      const document = new Document({
        sections: [{ children: paragraphs }],
      });
      const blob = await Packer.toBlob(document);
      const fileBase = selectedJobForTailoring?.title?.replace(/\s+/g, '-').toLowerCase() || 'final-resume';
      triggerDownload(blob, `${fileBase}.docx`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const finalResumePreviewHtml = finalResumeText ? buildResumePreviewHtml(finalResumeText) : '';

  const handleRagUpsert = async () => {
    if (!ragDocId.trim()) {
      setRagError('RAG document ID is required.');
      return;
    }

    if (!ragDocText.trim()) {
      setRagError('RAG document text is required.');
      return;
    }

    setIsRagUpserting(true);
    setRagError('');
    setRagStatus('');

    try {
      let metadata: Record<string, unknown> = {};
      if (ragDocMetadata.trim()) {
        const parsed = JSON.parse(ragDocMetadata);
        if (typeof parsed === 'object' && parsed) {
          metadata = parsed as Record<string, unknown>;
        }
      }

      const response = await fetch('/api/rag/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ragDocId.trim(),
          text: ragDocText,
          metadata,
        }),
      });

      const data = (await response.json()) as RagUpsertResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to upsert RAG document');
      }

      setRagStatus(`Upserted ${data.id} via ${data.backend} (${data.embeddingProvider} embeddings)`);
    } catch (error) {
      setRagError(error instanceof Error ? error.message : 'Unexpected RAG upsert error');
    } finally {
      setIsRagUpserting(false);
    }
  };

  const handleRagRetrieve = async () => {
    if (!ragQuery.trim()) {
      setRagError('RAG query is required.');
      return;
    }

    setIsRagRetrieving(true);
    setRagError('');
    setRagStatus('');

    try {
      const response = await fetch('/api/rag/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ragQuery,
          topK: ragTopK,
        }),
      });

      const data = (await response.json()) as RagRetrieveResponse | { error: string };
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Failed to retrieve RAG documents');
      }

      setRagResult(data);
      setRagStatus(`Retrieved ${data.items.length} items via ${data.backend} (${data.embeddingProvider} embeddings)`);
    } catch (error) {
      setRagError(error instanceof Error ? error.message : 'Unexpected RAG retrieval error');
    } finally {
      setIsRagRetrieving(false);
    }
  };

  const runFullRagTest = async () => {
    setIsRagRunning(true);
    setRagError('');
    setRagStatus('Preparing full RAG test...');

    try {
      const seedText = tailorResult?.tailoredResume
        || resumeText
        || (selectedJobForTailoring
          ? [
            selectedJobForTailoring.title,
            selectedJobForTailoring.company,
            selectedJobForTailoring.description,
          ].join('\n')
          : 'React Node TypeScript full stack experience with resume tailoring and job matching.');

      const testId = `full-test-${Date.now()}`;
      const testMetadata = {
        kind: 'full_rag_test',
        source: 'one_click',
        hasTailored: Boolean(tailorResult?.tailoredResume),
        hasResume: Boolean(resumeText.trim()),
        hasSelectedJob: Boolean(selectedJobForTailoring),
      };

      setRagDocId(testId);
      setRagDocText(seedText);
      setRagDocMetadata(JSON.stringify(testMetadata, null, 2));

      const queryText = ragQuery.trim() || 'resume tailoring for react node role';
      setRagQuery(queryText);

      const upsertResponse = await fetch('/api/rag/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: testId,
          text: seedText,
          metadata: testMetadata,
        }),
      });

      const upsertData = (await upsertResponse.json()) as RagUpsertResponse | { error: string };
      if (!upsertResponse.ok || 'error' in upsertData) {
        throw new Error('error' in upsertData ? upsertData.error : 'Failed to upsert test document');
      }

      const retrieveResponse = await fetch('/api/rag/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryText,
          topK: ragTopK,
        }),
      });

      const retrieveData = (await retrieveResponse.json()) as RagRetrieveResponse | { error: string };
      if (!retrieveResponse.ok || 'error' in retrieveData) {
        throw new Error('error' in retrieveData ? retrieveData.error : 'Failed to retrieve test context');
      }

      setRagResult(retrieveData);
      setRagStatus(
        `Full test done • upsert: ${upsertData.backend}/${upsertData.embeddingProvider} • retrieved: ${retrieveData.items.length} items`,
      );
    } catch (error) {
      setRagError(error instanceof Error ? error.message : 'Unexpected full RAG test error');
    } finally {
      setIsRagRunning(false);
    }
  };

  const runRagBenchmark = async () => {
    setIsRagBenchmarking(true);
    setRagError('');
    setRagStatus('Running provider benchmark...');
    setRagBenchmarkRows([]);
    setRagBenchmarkRunId(null);

    const providers: Array<'openai' | 'gemini' | 'fallback'> = ['openai', 'gemini', 'fallback'];
    const rows: RagBenchmarkRow[] = [];

    try {
      const seedText = ragDocText.trim() || tailorResult?.tailoredResume || resumeText || 'React Node TypeScript resume tailoring context';
      const queryText = ragQuery.trim() || 'resume tailoring for react node role';

      for (const provider of providers) {
        const id = `benchmark-${provider}-${Date.now()}`;
        const tokenEstimate = estimateTokens(`${seedText}\n${queryText}`);
        const estCostUsd = estimateEmbeddingCost(provider, tokenEstimate);

        try {
          const upsertStart = performance.now();
          const upsertResponse = await fetch('/api/rag/upsert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id,
              text: seedText,
              metadata: {
                kind: 'benchmark',
                provider,
              },
              embeddingProvider: provider,
            }),
          });
          const upsertMs = Math.round(performance.now() - upsertStart);

          const upsertData = (await upsertResponse.json()) as RagUpsertResponse | { error: string };
          if (!upsertResponse.ok || 'error' in upsertData) {
            throw new Error('error' in upsertData ? upsertData.error : 'Upsert failed');
          }

          const retrieveStart = performance.now();
          const retrieveResponse = await fetch('/api/rag/retrieve', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: queryText,
              topK: ragTopK,
              embeddingProvider: provider,
            }),
          });
          const retrieveMs = Math.round(performance.now() - retrieveStart);

          const retrieveData = (await retrieveResponse.json()) as RagRetrieveResponse | { error: string };
          if (!retrieveResponse.ok || 'error' in retrieveData) {
            throw new Error('error' in retrieveData ? retrieveData.error : 'Retrieve failed');
          }

          const topScore = retrieveData.items.length > 0 ? retrieveData.items[0].score : 0;
          rows.push({
            provider,
            upsertOk: true,
            backend: retrieveData.backend,
            retrievedCount: retrieveData.items.length,
            topScore,
            upsertMs,
            retrieveMs,
            tokenEstimate,
            estCostUsd,
          });
        } catch (error) {
          rows.push({
            provider,
            upsertOk: false,
            backend: 'n/a',
            retrievedCount: 0,
            topScore: 0,
            upsertMs: 0,
            retrieveMs: 0,
            tokenEstimate,
            estCostUsd,
            error: error instanceof Error ? error.message : 'Unknown benchmark error',
          });
        }
      }

      setRagBenchmarkRows(rows);
      const runId = `benchmark-run-${Date.now()}`;
      const saveResponse = await fetch('/api/rag/benchmark-runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          runId,
          query: queryText,
          topK: ragTopK,
          rows,
        }),
      });

      const saveData = (await saveResponse.json()) as RagBenchmarkRunsSaveResponse | { error: string };
      if (saveResponse.ok && !('error' in saveData) && saveData.saved) {
        setRagBenchmarkRunId(saveData.runId || runId);
      }

      setRagStatus('Benchmark completed. Compare rows below.');
    } finally {
      setIsRagBenchmarking(false);
    }
  };

  const useResumePreset = () => {
    if (!resumeText.trim()) {
      setRagError('Paste or parse a resume first to use this preset.');
      return;
    }

    setRagError('');
    setRagDocId(`resume-${Date.now()}`);
    setRagDocText(resumeText);
    setRagDocMetadata(JSON.stringify({ kind: 'resume', source: 'ui_preset' }, null, 2));
  };

  const useSelectedJobPreset = () => {
    if (!selectedJobForTailoring) {
      setRagError('Select a job first to use this preset.');
      return;
    }

    setRagError('');
    setRagDocId(`job-${selectedJobForTailoring.id}-${Date.now()}`);
    setRagDocText([
      selectedJobForTailoring.title,
      selectedJobForTailoring.company,
      selectedJobForTailoring.location,
      selectedJobForTailoring.description,
    ].join('\n'));
    setRagDocMetadata(
      JSON.stringify(
        {
          kind: 'job',
          source: 'ui_preset',
          jobId: selectedJobForTailoring.id,
          employmentType: selectedJobForTailoring.employmentType,
        },
        null,
        2,
      ),
    );
  };

  const useTailoredResumePreset = () => {
    if (!tailorResult?.tailoredResume) {
      setRagError('Generate a tailored resume first to use this preset.');
      return;
    }

    setRagError('');
    setRagDocId(tailorResult.ragDocumentId || `tailored-${Date.now()}`);
    setRagDocText(tailorResult.tailoredResume);
    setRagDocMetadata(
      JSON.stringify(
        {
          kind: 'tailored_resume',
          source: 'ui_preset',
          modelSource: tailorResult.source,
          saved: tailorResult.saved,
        },
        null,
        2,
      ),
    );
  };

  return (
    <div className="job-search-page">
      <div className="job-search-content">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Job Search Dashboard
          </h1>
          <p className="text-gray-600">Track your job applications and opportunities</p>
        </div>

        <div className="panel-card job-carousel-panel">
          <div className="resume-parser-header">
            <h2>Step 1: Upload Resume</h2>
            <p>Upload your resume file, then extract structured profile data for tailoring.</p>
          </div>

          <div className="resume-parser-controls">
            <input
              type="file"
              accept=".txt,.md,.json,.rtf,.pdf,.doc,.docx"
              onChange={handleResumeFileUpload}
            />
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handleParseResume}
              disabled={isParsing}
            >
              {isParsing ? 'Parsing...' : 'Parse Resume'}
            </button>
          </div>

          {resumeFileName && (
            <p className="resume-helper-text">
              Loaded: {resumeFileName}. Click "Parse Resume" to extract and prepare resume content for tailoring.
              Legacy .doc may require converting to .docx.
            </p>
          )}

          {parseError && <p className="resume-error">{parseError}</p>}

          {parsedResult && (
            <div className="resume-results">
              <div className="resume-results-header">
                <h3>Parsed Resume Data</h3>
                <span>Source: {parsedResult.source}</span>
              </div>
              <ul>
                <li><strong>Name:</strong> {parsedResult.parsedData.fullName || 'N/A'}</li>
                <li><strong>Email:</strong> {parsedResult.parsedData.email || 'N/A'}</li>
                <li><strong>Phone:</strong> {parsedResult.parsedData.phone || 'N/A'}</li>
                <li><strong>Summary:</strong> {parsedResult.parsedData.summary || 'N/A'}</li>
                <li>
                  <strong>Skills:</strong>{' '}
                  {parsedResult.parsedData.skills.length > 0
                    ? parsedResult.parsedData.skills.join(', ')
                    : 'N/A'}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="panel-card job-carousel-panel">
          <div className="resume-parser-header">
            <h2>Step 2: Search Jobs</h2>
            <p>Search by title/skills, location, and employment type.</p>
          </div>

          <div className="job-search-grid">
            <div className="job-search-field">
              <label htmlFor="job-query">Search</label>
              <input
                id="job-query"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="e.g. React, Node.js, ML Engineer"
              />
            </div>

            <div className="job-search-field">
              <label htmlFor="job-location">Location</label>
              <input
                id="job-location"
                type="text"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="e.g. Remote, New York"
              />
            </div>

            <div className="job-search-field">
              <label htmlFor="job-type">Employment Type</label>
              <select
                id="job-type"
                value={employmentTypeFilter}
                onChange={(event) => setEmploymentTypeFilter(event.target.value)}
              >
                <option value="">All types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="job-search-actions">
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handleSearchJobs}
              disabled={isLoadingJobs}
            >
              {isLoadingJobs ? 'Searching...' : 'Search Jobs'}
            </button>
            <button type="button" className="resume-action-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          {searchMessage && <p className="resume-helper-text">{searchMessage}</p>}
          {jobError && <p className="resume-error">{jobError}</p>}
        </div>

        <div className="panel-card job-carousel-panel">
          <div className="resume-parser-header">
            <h2>Step 3: Generate Tailored Resume & Compare</h2>
            <p>Select a job in Step 4, generate a tailored resume, then compare before applying.</p>
          </div>

          {selectedJobForTailoring ? (
            <p className="resume-helper-text">
              Selected job: <strong>{selectedJobForTailoring.title}</strong> at {selectedJobForTailoring.company}
            </p>
          ) : (
            <p className="resume-helper-text">No job selected yet. Click “Use for Tailoring” on a role below.</p>
          )}

          {selectedJobForTailoring && (
            <div className="resume-results">
              <div className="resume-results-header">
                <h3>Job Description</h3>
              </div>
              <pre>{selectedJobForTailoring.description}</pre>
            </div>
          )}

          <div className="job-search-actions">
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handleTailorResume}
              disabled={isTailoring}
            >
              {isTailoring ? 'Tailoring...' : 'Generate Tailored Resume'}
            </button>
          </div>

          {tailoringError && <p className="resume-error">{tailoringError}</p>}

          {tailorResult && (
            <div className="tailor-results-grid">
              <div className="tailor-panel full-width">
                <h3>Resume Format & Progress</h3>
                <div className="resume-template-controls">
                  <label htmlFor="resume-template">Resume Template</label>
                  <select
                    id="resume-template"
                    value={selectedResumeTemplate}
                    onChange={(event) => {
                      setSelectedResumeTemplate(event.target.value as ResumeTemplateKey);
                    }}
                  >
                    {Object.entries(RESUME_TEMPLATES).map(([key, definition]) => (
                      <option key={key} value={key}>{definition.label}</option>
                    ))}
                  </select>
                </div>
                <p className="resume-helper-text">
                  Source: {tailorResult.source} • Saved: {tailorResult.saved ? 'Yes' : 'No'} • Processed: {processedTrailerItemCount}/{trailerItemCount}
                  {' '}• Accepted: {acceptedTrailerItemCount}
                </p>
                <p className="resume-helper-text">
                  <span className={`resume-progress-badge ${isComparisonComplete ? 'complete' : 'in-progress'}`}>
                    {isComparisonComplete ? 'Comparison Complete' : 'Comparison In Progress'}
                  </span>
                </p>
              </div>

              <div className="tailor-panel full-width">
                <h3>Side-by-Side Comparison</h3>
                <p className="resume-helper-text">Left = Original Resume • Right = Trailer Resume. Process each point step by step with Accept/Skip. Final resume keeps original sections and adds accepted trailer improvements.</p>

                {comparisonSections.length === 0 && (
                  <p className="resume-helper-text">No structured sections found for comparison.</p>
                )}

                {comparisonSections.map((section) => {
                  const maxItems = Math.max(section.originalItems.length, section.trailerItems.length);
                  const decidedInSection = section.trailerItems.reduce((count, item, index) => {
                    const key = buildItemDecisionKey(section.sectionTitle, index, item);
                    return itemDecisions[key] ? count + 1 : count;
                  }, 0);
                  const acceptedInSection = section.trailerItems.reduce((count, item, index) => {
                    const key = buildItemDecisionKey(section.sectionTitle, index, item);
                    return itemDecisions[key] === 'accepted' ? count + 1 : count;
                  }, 0);
                  const sectionComplete = section.trailerItems.length > 0 && decidedInSection === section.trailerItems.length;

                  return (
                    <div key={section.sectionTitle} className="resume-compare-section">
                      <div className="resume-compare-section-header">
                        <div className="resume-section-status">
                          <h4>{section.sectionTitle}</h4>
                          <span className={`resume-progress-badge ${sectionComplete ? 'complete' : 'in-progress'}`}>
                            {decidedInSection}/{section.trailerItems.length} decided • {acceptedInSection} accepted
                          </span>
                        </div>
                        <div className="job-search-actions">
                          <button
                            type="button"
                            className="resume-action-btn"
                            onClick={() => handleAcceptEntireSection(section.sectionTitle, section.trailerItems)}
                            disabled={section.trailerItems.length === 0}
                          >
                            Accept Section
                          </button>
                          <button
                            type="button"
                            className="resume-action-btn"
                            onClick={() => handleSkipEntireSection(section.sectionTitle, section.trailerItems)}
                            disabled={section.trailerItems.length === 0}
                          >
                            Skip Section
                          </button>
                        </div>
                      </div>

                      <div className="resume-compare-grid">
                        <div className="resume-compare-column-title">Original Resume</div>
                        <div className="resume-compare-column-title">Trailer Resume</div>

                        {Array.from({ length: maxItems }).map((_, index) => {
                          const originalItem = section.originalItems[index] || '';
                          const trailerItem = section.trailerItems[index] || '';
                          const decisionKey = trailerItem ? buildItemDecisionKey(section.sectionTitle, index, trailerItem) : '';
                          const decision = decisionKey ? itemDecisions[decisionKey] : null;

                          return (
                            <React.Fragment key={`${section.sectionTitle}-${index}`}>
                              <div className="resume-compare-cell">{originalItem || '—'}</div>
                              <div className="resume-compare-cell trailer">
                                <div>{trailerItem || '—'}</div>
                                {trailerItem && (
                                  <div className="resume-compare-actions">
                                    <button
                                      type="button"
                                      className="resume-action-btn primary"
                                      onClick={() => handleAcceptTrailerItem(section.sectionTitle, trailerItem, index)}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="resume-action-btn"
                                      onClick={() => handleSkipTrailerItem(section.sectionTitle, trailerItem, index)}
                                    >
                                      Skip
                                    </button>
                                    {decision && (
                                      <span className={`resume-item-decision ${decision}`}>
                                        {decision === 'accepted' ? 'Accepted' : 'Skipped'}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="tailor-panel full-width">
                <h3>Tailoring Insights</h3>
                <ul className="tailor-highlight-list">
                  {tailorResult.changeHighlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="resume-helper-text">{tailorResult.jobAnalysis}</p>
              </div>

              <div className="tailor-panel full-width">
                <h3>Final Resume (HTML Preview)</h3>
                {!finalResumeText && (
                  <p className="resume-helper-text">Your original resume is the base. Accept trailer items above to apply section-by-section improvements.</p>
                )}
                {finalResumeText && (
                  <>
                    <div
                      className="final-resume-preview"
                      dangerouslySetInnerHTML={{ __html: finalResumePreviewHtml }}
                    />
                    <div className="job-search-actions">
                      <button
                        type="button"
                        className="resume-action-btn"
                        onClick={handleDownloadFinalResumeHtml}
                      >
                        Download HTML
                      </button>
                      <button
                        type="button"
                        className="resume-action-btn"
                        onClick={() => {
                          void handleDownloadFinalResumeDocx();
                        }}
                        disabled={isExportingDocx}
                      >
                        {isExportingDocx ? 'Creating DOCX...' : 'Download DOCX'}
                      </button>
                      <button
                        type="button"
                        className="resume-action-btn primary"
                        onClick={() => {
                          void handleApplyUsingFinalResume();
                        }}
                        disabled={applyingJobId === selectedJobForTailoring?.id || !isComparisonComplete}
                      >
                        {applyingJobId === selectedJobForTailoring?.id ? 'Applying...' : 'Apply Using Final Resume'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {false && (
          <div className="panel-card job-carousel-panel">
          <div className="resume-parser-header">
            <h2>RAG Playground</h2>
            <p>Manually upsert vectors and retrieve context to compare providers/backends.</p>
          </div>

          <div className="rag-preset-actions">
            <button type="button" className="resume-action-btn" onClick={useResumePreset}>
              Use Current Resume
            </button>
            <button type="button" className="resume-action-btn" onClick={useSelectedJobPreset}>
              Use Selected Job
            </button>
            <button type="button" className="resume-action-btn" onClick={useTailoredResumePreset}>
              Use Tailored Resume
            </button>
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={runFullRagTest}
              disabled={isRagRunning}
            >
              {isRagRunning ? 'Running Full Test...' : 'Run Full RAG Test'}
            </button>
            <button
              type="button"
              className="resume-action-btn"
              onClick={runRagBenchmark}
              disabled={isRagBenchmarking}
            >
              {isRagBenchmarking ? 'Benchmarking...' : 'Run Provider Benchmark'}
            </button>
          </div>

          <div className="rag-grid">
            <div className="job-search-field">
              <label htmlFor="rag-doc-id">Document ID</label>
              <input
                id="rag-doc-id"
                type="text"
                value={ragDocId}
                onChange={(event) => setRagDocId(event.target.value)}
                placeholder="doc-123"
              />
            </div>

            <div className="job-search-field">
              <label htmlFor="rag-topk">Top K</label>
              <input
                id="rag-topk"
                type="number"
                min={1}
                max={20}
                value={ragTopK}
                onChange={(event) => setRagTopK(parseInt(event.target.value || '3', 10))}
              />
            </div>
          </div>

          <div className="job-search-field rag-field">
            <label htmlFor="rag-doc-text">Document Text (for upsert)</label>
            <textarea
              id="rag-doc-text"
              className="rag-textarea"
              value={ragDocText}
              onChange={(event) => setRagDocText(event.target.value)}
              placeholder="Paste a tailored resume chunk or notes..."
              rows={4}
            />
          </div>

          <div className="job-search-field rag-field">
            <label htmlFor="rag-doc-metadata">Metadata JSON (optional)</label>
            <textarea
              id="rag-doc-metadata"
              className="rag-textarea"
              value={ragDocMetadata}
              onChange={(event) => setRagDocMetadata(event.target.value)}
              rows={3}
            />
          </div>

          <div className="job-search-field rag-field">
            <label htmlFor="rag-query">Retrieve Query</label>
            <textarea
              id="rag-query"
              className="rag-textarea"
              value={ragQuery}
              onChange={(event) => setRagQuery(event.target.value)}
              rows={2}
            />
          </div>

          <div className="job-search-actions">
            <button
              type="button"
              className="resume-action-btn"
              onClick={handleRagUpsert}
              disabled={isRagUpserting}
            >
              {isRagUpserting ? 'Upserting...' : 'Upsert Vector'}
            </button>
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handleRagRetrieve}
              disabled={isRagRetrieving}
            >
              {isRagRetrieving ? 'Retrieving...' : 'Retrieve Context'}
            </button>
          </div>

          {ragStatus && <p className="resume-helper-text">{ragStatus}</p>}
          {ragError && <p className="resume-error">{ragError}</p>}

          {ragResult && (
            <div className="rag-results">
              <h3>Retrieved Results</h3>
              <ul>
                {ragResult.items.length === 0 && <li>No matches returned.</li>}
                {ragResult.items.map((item) => (
                  <li key={item.id}>
                    <strong>{item.id}</strong> • score: {item.score.toFixed(3)}
                    <p>{item.text.slice(0, 220)}{item.text.length > 220 ? '...' : ''}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ragBenchmarkRows.length > 0 && (
            <div className="rag-results">
              <h3>Provider Benchmark</h3>
              {ragBenchmarkRunId && (
                <p className="resume-helper-text">Saved run: {ragBenchmarkRunId}</p>
              )}
              <table className="rag-benchmark-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Backend</th>
                    <th>Upsert</th>
                    <th>Upsert ms</th>
                    <th>Retrieve ms</th>
                    <th>Retrieved</th>
                    <th>Top Score</th>
                    <th>Tokens (est)</th>
                    <th>Cost USD (est)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ragBenchmarkRows.map((row) => (
                    <tr key={row.provider}>
                      <td>{row.provider}</td>
                      <td>{row.backend}</td>
                      <td>{row.upsertOk ? 'ok' : 'fail'}</td>
                      <td>{row.upsertMs}</td>
                      <td>{row.retrieveMs}</td>
                      <td>{row.retrievedCount}</td>
                      <td>{row.topScore.toFixed(3)}</td>
                      <td>{row.tokenEstimate}</td>
                      <td>{row.estCostUsd.toFixed(6)}</td>
                      <td>{row.error || 'success'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        <div className="panel-card">
          <div className="job-list-header">
            <h2>Step 4: Select Job, Accept/Skip & Apply</h2>
            <span>{isLoadingJobs ? 'Loading...' : `${jobs.length} openings`}</span>
          </div>
          <p className="resume-helper-text">Select a role first, then compare and apply above. Step 5: track all updates on the Applications page.</p>
          <div className="job-list">
            {jobs.length === 0 && !isLoadingJobs && (
              <p className="resume-helper-text">No jobs found. Run a search to fetch opportunities.</p>
            )}

            {jobs.map((job) => (
              <div key={job.id} className="job-list-item">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company} • {job.location}</p>
                </div>
                <div className="job-list-meta">
                  <span className="job-tag">{job.salary}</span>
                  <span className="job-status">{job.employmentType}</span>
                  <button
                    type="button"
                    className="resume-action-btn"
                    onClick={() => handleSelectJobForTailoring(job)}
                  >
                    Select Job
                  </button>
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noreferrer" className="content-panel-link">
                      View
                    </a>
                  )}
                </div>
                {selectedJobForTailoring?.id !== job.id && (
                  <p className="resume-helper-text">Select this job, then generate tailored preview and apply from the comparison panel.</p>
                )}
                {selectedJobForTailoring?.id === job.id && !tailorResult && (
                  <p className="resume-helper-text">This job is selected. Generate tailored preview, then choose Accept or Skip to apply.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
