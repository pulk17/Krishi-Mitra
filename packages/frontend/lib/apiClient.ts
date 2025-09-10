import { createClient } from '@/lib/supabase/client';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003';

export class ApiClientError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, isMultipart = false): Promise<T> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error('Supabase client not initialized.');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers || {});
  if (!isMultipart) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: 'Failed to parse error response from server.',
    }));
    throw new ApiClientError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Handle cases with no response body (e.g., a 204 No Content response)
  const responseText = await response.text();
  return (responseText ? JSON.parse(responseText) : null) as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  postMultipart: <T>(endpoint: string, body: FormData, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'POST', body }, true),
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};