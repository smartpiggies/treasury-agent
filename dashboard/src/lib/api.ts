import type { SwapRequest } from '@/types';

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_BASE || '';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${N8N_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

// Workflow triggers

export async function triggerDailyReport(): Promise<{ success: boolean }> {
  return fetchApi('/daily-report', { method: 'POST' });
}

export async function triggerPriceCheck(): Promise<{
  token: string;
  price: number;
}> {
  return fetchApi('/price-check', { method: 'POST' });
}

export async function requestSwap(params: SwapRequest): Promise<{
  id: string;
  status: 'pending' | 'awaiting_confirmation';
  message: string;
}> {
  return fetchApi('/swap-executor', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getBalance(): Promise<{
  total_usd: number;
  chains: Array<{
    chain: string;
    token: string;
    balance: string;
    balance_usd: number;
  }>;
}> {
  return fetchApi('/get-balance', { method: 'POST' });
}

// Check if n8n is configured
export function isN8nConfigured(): boolean {
  return Boolean(N8N_BASE);
}
