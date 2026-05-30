// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
}

interface AuthResponse {
  user: AppUser;
  token: string;
}

export interface SoilAnalysis {
  id: string;
  user_id: string;
  sample_name: string;
  percent_passing_200: number;
  percent_passing_4: number;
  liquid_limit: number | null;
  plastic_limit: number | null;
  plasticity_index: number | null;
  soil_class: string;
  soil_description: string;
  plasticity_level: string;
  confidence: number;
  treatment: string;
  notes: string;
  created_at: string;
}

export interface CreateAnalysisInput {
  sample_name: string;
  percent_passing_200: number;
  percent_passing_4: number;
  liquid_limit?: number | null;
  plastic_limit?: number | null;
  plasticity_index?: number | null;
  soil_class: string;
  soil_description: string;
  plasticity_level: string;
  confidence: number;
  treatment: string;
  notes?: string;
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getStoredToken(): string | null {
  return getAuthToken();
}

export function getStoredUser(): AppUser | null {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
}

export function setStoredAuth(user: AppUser, token: string) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_token', token);
}

export function clearStoredAuth() {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || payload.message || 'API request failed');
  }

  return payload.data as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  return apiCall<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
}

export async function fetchCurrentUser(): Promise<AppUser> {
  return apiCall<AppUser>('/auth/me');
}

type ReportResponse = Partial<SoilAnalysis> & {
  userId?: string;
  sieveNo200?: number;
  sieveNo4?: number;
  liquidLimit?: number | null;
  plasticLimit?: number | null;
  plasticityIndex?: number | null;
  soilClassification?: string;
  treatmentRecommendation?: string;
  createdAt?: string;
};

function normalizeAnalysis(report: ReportResponse): SoilAnalysis {
  const soilClass = report.soil_class ?? report.soilClassification ?? '';

  return {
    id: report.id ?? crypto.randomUUID(),
    user_id: report.user_id ?? report.userId ?? '',
    sample_name: report.sample_name ?? 'Unnamed Sample',
    percent_passing_200: report.percent_passing_200 ?? report.sieveNo200 ?? 0,
    percent_passing_4: report.percent_passing_4 ?? report.sieveNo4 ?? 0,
    liquid_limit: report.liquid_limit ?? report.liquidLimit ?? null,
    plastic_limit: report.plastic_limit ?? report.plasticLimit ?? null,
    plasticity_index: report.plasticity_index ?? report.plasticityIndex ?? null,
    soil_class: soilClass,
    soil_description: report.soil_description ?? soilClass,
    plasticity_level: report.plasticity_level ?? '',
    confidence: report.confidence ?? 0,
    treatment: report.treatment ?? report.treatmentRecommendation ?? '',
    notes: report.notes ?? '',
    created_at: report.created_at ?? report.createdAt ?? new Date().toISOString(),
  };
}

export async function createAnalysis(
  _userId: string,
  input: CreateAnalysisInput
): Promise<SoilAnalysis> {
  const report = await apiCall<ReportResponse>('/reports', {
    method: 'POST',
    body: JSON.stringify({
      sample_name: input.sample_name,
      percent_passing_200: input.percent_passing_200,
      percent_passing_4: input.percent_passing_4,
      liquid_limit: input.liquid_limit ?? null,
      plastic_limit: input.plastic_limit ?? null,
      plasticity_index: input.plasticity_index ?? null,
      soil_class: input.soil_class,
      soil_description: input.soil_description,
      plasticity_level: input.plasticity_level,
      confidence: input.confidence,
      treatment: input.treatment,
      notes: input.notes ?? '',
    }),
  });
  return normalizeAnalysis(report);
}

export async function loadAnalyses(_userId: string): Promise<SoilAnalysis[]> {
  const reports = await apiCall<ReportResponse[]>('/reports');
  return reports.map(normalizeAnalysis);
}

export async function loadRecentAnalyses(
  userId: string,
  limit: number = 5
): Promise<SoilAnalysis[]> {
  const analyses = await loadAnalyses(userId);
  return analyses.slice(0, limit);
}

export async function loadLatestAnalysis(userId: string): Promise<SoilAnalysis | null> {
  const analyses = await loadAnalyses(userId);
  return analyses.length > 0 ? analyses[0] : null;
}

export async function deleteAnalysis(_userId: string, analysisId: string): Promise<void> {
  await apiCall<null>(`/reports/${analysisId}`, {
    method: 'DELETE',
  });
}

export async function getAnalysisById(analysisId: string): Promise<SoilAnalysis> {
  const report = await apiCall<ReportResponse>(`/reports/${analysisId}`);
  return normalizeAnalysis(report);
}

// Helper function to build analysis object
export function buildAnalysis(data: Partial<SoilAnalysis>): SoilAnalysis {
  return {
    id: data.id || crypto.randomUUID(),
    user_id: data.user_id || '',
    sample_name: data.sample_name || 'Unnamed Sample',
    percent_passing_200: data.percent_passing_200 || 0,
    percent_passing_4: data.percent_passing_4 || 0,
    liquid_limit: data.liquid_limit || null,
    plastic_limit: data.plastic_limit || null,
    plasticity_index: data.plasticity_index || null,
    soil_class: data.soil_class || '',
    soil_description: data.soil_description || '',
    plasticity_level: data.plasticity_level || '',
    confidence: data.confidence || 0,
    treatment: data.treatment || '',
    notes: data.notes || '',
    created_at: data.created_at || new Date().toISOString(),
  };
}

// Save analysis to backend
export async function saveAnalysis(
  userId: string,
  analysis: SoilAnalysis
): Promise<SoilAnalysis> {
  const input: CreateAnalysisInput = {
    sample_name: analysis.sample_name,
    percent_passing_200: analysis.percent_passing_200,
    percent_passing_4: analysis.percent_passing_4,
    liquid_limit: analysis.liquid_limit,
    plastic_limit: analysis.plastic_limit,
    plasticity_index: analysis.plasticity_index,
    soil_class: analysis.soil_class,
    soil_description: analysis.soil_description,
    plasticity_level: analysis.plasticity_level,
    confidence: analysis.confidence,
    treatment: analysis.treatment,
    notes: analysis.notes,
  };
  return createAnalysis(userId, input);
}
