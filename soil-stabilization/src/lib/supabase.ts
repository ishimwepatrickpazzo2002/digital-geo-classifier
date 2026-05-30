const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ?? '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error ?? payload.message ?? response.statusText);
  }

  if (payload.data === undefined) {
    throw new Error('Invalid server response');
  }

  return payload.data;
}

export async function getJson<T>(path: string, token?: string) {
  return apiFetch<T>(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function postJson<T>(path: string, body: unknown, token?: string) {
  return apiFetch<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
        };
      };
      soil_analyses: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['soil_analyses']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['soil_analyses']['Insert']>;
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SoilAnalysis = Database['public']['Tables']['soil_analyses']['Row'];
