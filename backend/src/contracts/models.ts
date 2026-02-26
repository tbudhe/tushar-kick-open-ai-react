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

export interface ErrorResponse {
  error: string;
}
