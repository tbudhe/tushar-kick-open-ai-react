export interface HealthResponse {
  status: 'healthy' | 'degraded';
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export interface HeartbeatResponse {
  status: 'healthy';
  timestamp: string;
  uptime: number;
  port: number;
  database: 'connected' | 'disconnected';
  environment: string;
}

export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

export interface DbStatusResponse {
  connected: boolean;
  database: string;
  collections: string[];
  url: string;
}

export interface ParsedResumeData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  summary: string | null;
  skills: string[];
  experience: string[];
  education: string[];
}

export interface ParseResumeRequest {
  resumeText: string;
  fileName?: string;
}

export interface ParseResumeSuccessResponse {
  success: true;
  source: 'claude' | 'fallback';
  fileName: string;
  parsedData: ParsedResumeData;
}

export interface TailorResumeJob {
  id: string;
  title: string;
  company: string;
  description: string;
}

export interface TailorResumeRequest {
  resumeText: string;
  resumeTemplate?: 'classic' | 'impact' | 'compact';
  job: TailorResumeJob;
}

export interface TailorResumeResponse {
  success: true;
  source: 'openai' | 'claude' | 'fallback';
  originalResume: string;
  tailoredResume: string;
  jobAnalysis: string;
  changeHighlights: string[];
  saved: boolean;
  tailoredId: string | null;
  ragDocumentId: string | null;
}

export interface RagUpsertRequest {
  id: string;
  text: string;
  metadata?: Record<string, unknown>;
  embeddingProvider?: 'openai' | 'gemini' | 'fallback';
}

export interface RagUpsertResponse {
  success: true;
  id: string;
  backend: 'pinecone' | 'mongo' | 'memory';
  embeddingProvider: 'openai' | 'gemini' | 'fallback';
}

export interface RagRetrievedItem {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  score: number;
}

export interface RagRetrieveRequest {
  query: string;
  topK?: number;
  embeddingProvider?: 'openai' | 'gemini' | 'fallback';
}

export interface RagRetrieveResponse {
  success: true;
  backend: 'pinecone' | 'mongo' | 'memory';
  embeddingProvider: 'openai' | 'gemini' | 'fallback';
  items: RagRetrievedItem[];
}

export interface RagBenchmarkRow {
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

export interface RagBenchmarkRunSaveRequest {
  runId: string;
  query: string;
  topK: number;
  rows: RagBenchmarkRow[];
}

export interface RagBenchmarkRunSaveResponse {
  success: true;
  saved: boolean;
  runId?: string;
  reason?: string;
}

export interface RagBenchmarkRunItem {
  runId: string;
  query: string;
  topK: number;
  rows: RagBenchmarkRow[];
  createdAt?: string;
}

export interface RagBenchmarkRunListResponse {
  success: true;
  items: RagBenchmarkRunItem[];
}

export type ApplicationStatus = 'pending' | 'applied' | 'rejected' | 'interview';

export interface ApplyJobInput {
  id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
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

export interface ApplyRequest {
  job: ApplyJobInput;
  tailoredResumeId?: string;
  notes?: string;
}

export interface ApplyResponse {
  success: true;
  databaseConnected: boolean;
  application: ApplicationRecord;
}

export interface ApplicationsListResponse {
  success: true;
  databaseConnected: boolean;
  count: number;
  items: ApplicationRecord[];
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus;
  notes?: string;
}

export interface UpdateApplicationResponse {
  success: true;
  databaseConnected: boolean;
  application: ApplicationRecord;
}

export interface JobRecord {
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

export interface SearchJobsRequest {
  query?: string;
  location?: string;
  employmentType?: string;
  limit?: number;
}

export interface SearchJobsResponse {
  success: boolean;
  query: string;
  location: string;
  employmentType: string;
  count: number;
  persisted: number;
  databaseConnected: boolean;
  jobs: JobRecord[];
}

export interface JobsListResponse {
  success: boolean;
  query: string;
  location: string;
  employmentType: string;
  count: number;
  jobs: JobRecord[];
}

export interface ErrorResponse {
  error: string;
}
