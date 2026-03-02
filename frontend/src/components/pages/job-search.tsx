import React, { useEffect, useState } from 'react';
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
  source: 'claude' | 'fallback';
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

interface DiffLine {
  type: 'added' | 'removed';
  text: string;
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

function buildResumeDiff(originalText: string, tailoredText: string): DiffLine[] {
  const originalLines = originalText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const tailoredLines = tailoredText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const originalSet = new Set(originalLines);
  const tailoredSet = new Set(tailoredLines);

  const removed = originalLines
    .filter((line) => !tailoredSet.has(line))
    .slice(0, 25)
    .map((line) => ({ type: 'removed' as const, text: line }));

  const added = tailoredLines
    .filter((line) => !originalSet.has(line))
    .slice(0, 25)
    .map((line) => ({ type: 'added' as const, text: line }));

  return [...added, ...removed];
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
  const [finalResumeText, setFinalResumeText] = useState('');
  const [finalResumeDecision, setFinalResumeDecision] = useState<'accepted' | 'skipped' | null>(null);
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
    setFinalResumeText('');
    setFinalResumeDecision(null);
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
      setFinalResumeText('');
      setFinalResumeDecision(null);
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

  const handleAcceptMergeAndApply = () => {
    if (!tailorResult) {
      setTailoringError('Generate tailored resume preview first.');
      return;
    }

    setFinalResumeDecision('accepted');
    setFinalResumeText(tailorResult.tailoredResume);
    setTailoringError('');
  };

  const handleSkipMergeAndApply = () => {
    if (!tailorResult) {
      setTailoringError('Generate tailored resume preview first.');
      return;
    }

    setFinalResumeDecision('skipped');
    setFinalResumeText(tailorResult.originalResume);
    setTailoringError('');
  };

  const handleApplyUsingFinalResume = async () => {
    if (!selectedJobForTailoring || !tailorResult || !finalResumeDecision || !finalResumeText.trim()) {
      setTailoringError('Select Accept or Skip to create final resume before applying.');
      return;
    }

    setResumeText(finalResumeText);
    await handleApplyToJob(selectedJobForTailoring, {
      useTailoredResume: finalResumeDecision === 'accepted',
      mergeDecision: finalResumeDecision,
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
      setTailoringError('Create a final resume with Accept or Skip before downloading.');
      return;
    }

    const fileBase = selectedJobForTailoring?.title?.replace(/\s+/g, '-').toLowerCase() || 'final-resume';
    const html = buildHtmlDocument(buildResumePreviewHtml(finalResumeText), 'Final Resume');
    triggerDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), `${fileBase}.html`);
  };

  const handleDownloadFinalResumeDocx = async () => {
    if (!finalResumeText.trim()) {
      setTailoringError('Create a final resume with Accept or Skip before downloading.');
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

  const diffLines = tailorResult
    ? buildResumeDiff(tailorResult.originalResume, tailorResult.tailoredResume)
    : [];

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
              <div className="tailor-panel">
                <h3>Original Resume</h3>
                <pre>{tailorResult.originalResume}</pre>
              </div>
              <div className="tailor-panel">
                <h3>Apply Decision</h3>
                <p className="resume-helper-text">Compare side by side, then choose Accept or Skip to create final resume.</p>
                <div className="job-search-actions">
                  <button
                    type="button"
                    className="resume-action-btn primary"
                    onClick={handleAcceptMergeAndApply}
                  >
                    Accept Tailored Resume
                  </button>
                  <button
                    type="button"
                    className="resume-action-btn"
                    onClick={handleSkipMergeAndApply}
                  >
                    Skip (Keep Original)
                  </button>
                </div>
                <p className="resume-helper-text">
                  {finalResumeDecision === 'accepted' && 'Final resume selected: Tailored Resume'}
                  {finalResumeDecision === 'skipped' && 'Final resume selected: Original Resume'}
                  {!finalResumeDecision && 'No final resume selected yet.'}
                </p>
              </div>
              <div className="tailor-panel">
                <h3>Tailored Resume</h3>
                <pre>{tailorResult.tailoredResume}</pre>
              </div>
              <div className="tailor-panel full-width">
                <h3>Diff View</h3>
                <p className="resume-helper-text">Source: {tailorResult.source} • Saved: {tailorResult.saved ? 'Yes' : 'No'}</p>
                <ul className="tailor-diff-list">
                  {diffLines.length === 0 && <li>No line-level changes detected.</li>}
                  {diffLines.map((line, index) => (
                    <li key={`${line.type}-${index}`} className={`diff-${line.type}`}>
                      {line.type === 'added' ? '+ ' : '- '}
                      {line.text}
                    </li>
                  ))}
                </ul>
                <h4>Change Highlights</h4>
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
                  <p className="resume-helper-text">Choose Accept or Skip above to generate your final resume.</p>
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
                        disabled={applyingJobId === selectedJobForTailoring?.id}
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
