import type { ApiResponse } from '@/types/api';
type QueryValue = string | number | boolean | undefined | null;

type RequestOptions = RequestInit & {
  query?: Record<string, QueryValue>;
};

function buildUrl(url: string, query?: Record<string, QueryValue>) {
  if (!query) return url;

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  if (!queryString) return url;

  return `${url}?${queryString}`;
}

export async function request<T>(url: string, options: RequestOptions = {}) {
  const { query, headers, ...restOptions } = options;
  const response = await fetch(buildUrl(url, query), {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const result = (await response.json()) as ApiResponse<T>;
  if (result.code !== 0) {
    throw new Error(result.message || 'Request failed');
  }
  return result.data;
}
