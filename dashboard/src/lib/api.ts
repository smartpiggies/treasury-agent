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
  executionId: string;
  status: 'pending' | 'awaiting_confirmation';
  message: string;
  route: string;
}> {
  return fetchApi('/swap-executor', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface TreasuryBalance {
  total_usd: number;
  eth_price: number;
  timestamp: string;
  chains: Array<{
    chain: string;
    token: string;
    balance: string;
    balance_usd: number;
  }>;
}

export async function getBalance(): Promise<TreasuryBalance> {
  return fetchApi('/get-balance', { method: 'POST' });
}

export async function confirmSwap(executionId: string, action: 'confirm' | 'cancel' = 'confirm'): Promise<{
  success: boolean;
  executionId: string;
  txHash?: string;
  error?: string;
  mocked?: boolean;
  route?: string;
  status?: string;
}> {
  return fetchApi('/swap-confirm', {
    method: 'POST',
    body: JSON.stringify({
      executionId,
      ...(action === 'cancel' ? { action: 'cancel' } : {}),
    }),
  });
}

// Check if n8n is configured
export function isN8nConfigured(): boolean {
  return Boolean(N8N_BASE);
}
