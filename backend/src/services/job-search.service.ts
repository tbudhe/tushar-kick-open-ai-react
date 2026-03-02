import { isDatabaseConnected } from '../config/database';
import { JobModel } from '../models/job.model';

export interface JobSearchFilters {
  query?: string;
  location?: string;
  employmentType?: string;
  limit?: number;
}

export interface JobResult {
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

const FALLBACK_JOBS: JobResult[] = [
  {
    id: 'fallback-1',
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$150K - $180K',
    description: 'Build modern frontend experiences for enterprise customers.',
    url: '',
    source: 'fallback',
    employmentType: 'Full-time',
    publishedAt: null,
  },
  {
    id: 'fallback-2',
    title: 'Full Stack TypeScript Engineer',
    company: 'StartUp Inc',
    location: 'Remote',
    salary: '$120K - $150K',
    description: 'Develop APIs and React interfaces for a fast-moving startup.',
    url: '',
    source: 'fallback',
    employmentType: 'Full-time',
    publishedAt: null,
  },
  {
    id: 'fallback-3',
    title: 'Frontend Engineer',
    company: 'Design Studios',
    location: 'New York, NY',
    salary: '$130K - $160K',
    description: 'Create accessible UI components and improve design systems.',
    url: '',
    source: 'fallback',
    employmentType: 'Contract',
    publishedAt: null,
  },
];

interface RemotiveResponse {
  jobs?: Array<{
    id?: number;
    title?: string;
    company_name?: string;
    candidate_required_location?: string;
    salary?: string;
    description?: string;
    url?: string;
    job_type?: string;
    publication_date?: string;
  }>;
}

function toSafeLimit(limit: number | undefined) {
  if (!limit || Number.isNaN(limit)) {
    return 20;
  }
  return Math.min(Math.max(limit, 1), 50);
}

function normalizeToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesFilter(value: string, filter: string) {
  return normalizeToken(value).includes(normalizeToken(filter));
}

function applyLocalFilters(jobs: JobResult[], filters: JobSearchFilters) {
  const query = filters.query?.trim();
  const location = filters.location?.trim();
  const employmentType = filters.employmentType?.trim();

  return jobs.filter((job) => {
    const queryPass = !query
      || includesFilter(job.title, query)
      || includesFilter(job.description, query)
      || includesFilter(job.company, query);
    const locationPass = !location || includesFilter(job.location, location);
    const typePass = !employmentType || includesFilter(job.employmentType, employmentType);

    return queryPass && locationPass && typePass;
  });
}

function mapRemotiveJob(job: NonNullable<RemotiveResponse['jobs']>[number]): JobResult {
  return {
    id: `remotive-${String(job.id || Math.random().toString(36).slice(2))}`,
    title: job.title?.trim() || 'Untitled role',
    company: job.company_name?.trim() || 'Unknown Company',
    location: job.candidate_required_location?.trim() || 'Remote',
    salary: job.salary?.trim() || 'Not disclosed',
    description: (job.description || '').replace(/<[^>]+>/g, '').slice(0, 600),
    url: job.url?.trim() || '',
    source: 'remotive',
    employmentType: job.job_type?.trim() || 'Not specified',
    publishedAt: job.publication_date?.trim() || null,
  };
}

export async function fetchJobs(filters: JobSearchFilters): Promise<JobResult[]> {
  const query = filters.query?.trim() || 'software engineer';
  const limit = toSafeLimit(filters.limit);

  try {
    const response = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Remotive API failed with status ${response.status}`);
    }

    const payload = (await response.json()) as RemotiveResponse;
    const remoteJobs = (payload.jobs || []).map(mapRemotiveJob);
    return applyLocalFilters(remoteJobs, filters).slice(0, limit);
  } catch (error) {
    console.error('[JOB_SEARCH] Remote fetch failed, using fallback:', error);
    return applyLocalFilters(FALLBACK_JOBS, filters).slice(0, limit);
  }
}

export async function persistJobs(jobs: JobResult[], searchQuery: string) {
  if (!isDatabaseConnected()) {
    return {
      persisted: 0,
      connected: false,
    };
  }

  const operations = jobs.map((job) => ({
    updateOne: {
      filter: { externalId: job.id },
      update: {
        $set: {
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          url: job.url,
          source: job.source,
          employmentType: job.employmentType,
          publishedAt: job.publishedAt,
          searchQuery,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return {
      persisted: 0,
      connected: true,
    };
  }

  const result = await JobModel.bulkWrite(operations, { ordered: false });
  const persisted = (result.upsertedCount || 0) + (result.modifiedCount || 0);

  return {
    persisted,
    connected: true,
  };
}

export async function listStoredJobs(filters: JobSearchFilters): Promise<JobResult[]> {
  if (!isDatabaseConnected()) {
    return applyLocalFilters(FALLBACK_JOBS, filters).slice(0, toSafeLimit(filters.limit));
  }

  const query: Record<string, unknown> = {};

  if (filters.query?.trim()) {
    query.$or = [
      { title: { $regex: filters.query.trim(), $options: 'i' } },
      { company: { $regex: filters.query.trim(), $options: 'i' } },
      { description: { $regex: filters.query.trim(), $options: 'i' } },
    ];
  }

  if (filters.location?.trim()) {
    query.location = { $regex: filters.location.trim(), $options: 'i' };
  }

  if (filters.employmentType?.trim()) {
    query.employmentType = { $regex: filters.employmentType.trim(), $options: 'i' };
  }

  const docs = await JobModel.find(query)
    .sort({ updatedAt: -1 })
    .limit(toSafeLimit(filters.limit))
    .lean();

  return docs.map((doc) => ({
    id: doc.externalId,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    salary: doc.salary,
    description: doc.description,
    url: doc.url,
    source: doc.source,
    employmentType: doc.employmentType,
    publishedAt: doc.publishedAt,
  }));
}
