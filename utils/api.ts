/**
 * API Configuration and Utility Functions
 * 
 * This module provides centralized API configuration and helper functions
 * for making requests to the Cloudflare Worker API.
 */

// Get the API base URL from environment variables
// Falls back to localhost for development if not set
const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    console.warn('VITE_API_URL not defined, using default localhost URL');
    return 'http://localhost:8787';
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  EVALUATIONS: {
    LIST: `${API_BASE_URL}/api/evaluations`,
    CREATE: `${API_BASE_URL}/api/evaluations`,
  },
  FILES: {
    LIST: `${API_BASE_URL}/api/files`,
    UPLOAD: `${API_BASE_URL}/api/files`,
    DELETE: (id: string) => `${API_BASE_URL}/api/files/${id}`,
  },
  STATS: `${API_BASE_URL}/api/stats`,
};

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Authentication API functions
 */
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiFetch<{ token: string; user: any }>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  async register(email: string, password: string, name: string) {
    const response = await apiFetch<{ token: string; user: any }>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};

/**
 * Evaluations API functions
 */
export const evaluationsApi = {
  async getAll() {
    return apiFetch<any[]>(API_ENDPOINTS.EVALUATIONS.LIST);
  },

  async create(data: any) {
    return apiFetch<any>(API_ENDPOINTS.EVALUATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Files API functions
 */
export const filesApi = {
  async getAll() {
    return apiFetch<any[]>(API_ENDPOINTS.FILES.LIST);
  },

  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.FILES.UPLOAD, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },

  async delete(id: string) {
    return apiFetch(API_ENDPOINTS.FILES.DELETE(id), {
      method: 'DELETE',
    });
  },
};

/**
 * Stats API functions
 */
export const statsApi = {
  async get() {
    return apiFetch<any>(API_ENDPOINTS.STATS);
  },
};
