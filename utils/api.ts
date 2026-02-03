/**
 * API Configuration and Utility Functions
 * 
 * This module provides centralized API configuration and helper functions
 * for making requests to the Cloudflare Worker API.
 */

// Get the API base URL based on environment
const getApiBaseUrl = (): string => {
  // Always use localhost for development (localhost or 127.0.0.1 or local IPs)
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('172.')
  );
  
  if (isLocalhost) {
    // Use localhost:8787 for local development
    console.warn('Using localhost:8787 for API (local development)');
    return 'http://localhost:8787';
  }
  
  // Check if we're in production (cema.piwisuite.cl or pages.dev)
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname === 'cema.piwisuite.cl' || 
     window.location.hostname.endsWith('.pages.dev'));
  
  if (isProduction) {
    // In production, use relative URLs (same domain)
    return '';
  }
  
  // Check for environment variable (useful for staging/custom deployments)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Default fallback
  console.warn('Unknown environment, using localhost:8787');
  return 'http://localhost:8787';
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
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/evaluations/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/evaluations/${id}`,
  },
  FILES: {
    LIST: `${API_BASE_URL}/api/files`,
    UPLOAD: `${API_BASE_URL}/api/files`,
    DELETE: (id: string) => `${API_BASE_URL}/api/files/${id}`,
  },
  STATS: `${API_BASE_URL}/api/stats`,
  USERS: {
    LIST: `${API_BASE_URL}/api/users`,
    CREATE: `${API_BASE_URL}/api/users`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  },
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
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText || 'Request failed' };
    }
    
    // Handle 401 Unauthorized with user-friendly message
    if (response.status === 401) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    
    // Show full error message including server details
    const errorMsg = errorData?.message || errorText || `HTTP error! status: ${response.status}`;
    console.error('API Error:', response.status, 'Raw:', errorText);
    throw new Error(errorMsg);
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

  async getById(id: string) {
    return apiFetch<any>(API_ENDPOINTS.EVALUATIONS.GET_BY_ID(id));
  },

  async create(data: any) {
    return apiFetch<any>(API_ENDPOINTS.EVALUATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteById(id: string) {
    return apiFetch<{ success: boolean }>(API_ENDPOINTS.EVALUATIONS.DELETE(id), {
      method: 'DELETE',
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

/**
 * Users API functions
 */
export const usersApi = {
  async getAll() {
    return apiFetch<any[]>(API_ENDPOINTS.USERS.LIST);
  },

  async getById(id: string) {
    return apiFetch<any>(API_ENDPOINTS.USERS.GET_BY_ID(id));
  },

  async create(data: any) {
    return apiFetch<any>(API_ENDPOINTS.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any) {
    return apiFetch<any>(API_ENDPOINTS.USERS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiFetch<{ success: boolean }>(API_ENDPOINTS.USERS.DELETE(id), {
      method: 'DELETE',
    });
  },
};
