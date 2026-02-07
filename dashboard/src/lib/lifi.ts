import { USDC_ADDRESSES, WETH_ADDRESSES } from './contracts';
import type { Token } from '@/types';

const LIFI_API_BASE = 'https://li.quest/v1';
const INTEGRATOR_ID = import.meta.env.VITE_LIFI_INTEGRATOR_ID || 'treasury-ops-bot';

// Native ETH uses zero address in LI.FI API
const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export interface LIFIQuoteParams {
  fromChain: number;
  toChain: number;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  fromAmount: string; // in wei/smallest unit
  fromAddress: `0x${string}`;
}

export interface LIFITransactionRequest {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string;
  gasLimit: string;
}

export interface LIFIEstimate {
  toAmount: string;
  toAmountMin: string;
  toAmountUSD: string;
  fromAmountUSD: string;
}

export interface LIFIQuote {
  id: string;
  type: string;
  tool: string;
  estimate: LIFIEstimate;
  transactionRequest: LIFITransactionRequest;
}

export function getTokenAddress(token: Token, chainId: number): `0x${string}` {
  if (token === 'USDC') {
    return USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] as `0x${string}`;
  }
  if (token === 'ETH') {
    return NATIVE_ETH_ADDRESS;
  }
  // WETH
  return WETH_ADDRESSES[chainId] as `0x${string}`;
}

export function isNativeToken(tokenAddress: `0x${string}`): boolean {
  return tokenAddress === NATIVE_ETH_ADDRESS;
}

export async function getQuote(params: LIFIQuoteParams): Promise<LIFIQuote> {
  const searchParams = [
    `fromChain=${params.fromChain}`,
    `toChain=${params.toChain}`,
    `fromToken=${params.fromToken}`,
    `toToken=${params.toToken}`,
    `fromAmount=${params.fromAmount}`,
    `fromAddress=${params.fromAddress}`,
    `integrator=${INTEGRATOR_ID}`,
  ].join('&');

  const response = await fetch(`${LIFI_API_BASE}/quote?${searchParams}`);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LI.FI quote failed: ${body}`);
  }

  return response.json();
}

// Get token decimals for amount conversion
export function getTokenDecimals(token: Token): number {
  if (token === 'USDC' || token === 'USDT') return 6;
  return 18; // ETH, WETH, WBTC
}

// Convert human-readable amount to smallest unit
export function parseTokenAmount(amount: string, token: Token): string {
  const decimals = getTokenDecimals(token);
  const num = parseFloat(amount);
  // Use BigInt to avoid floating point issues
  const factor = 10n ** BigInt(decimals);
  // Multiply in two steps to handle decimals properly
  const wholePart = BigInt(Math.floor(num));
  const fracStr = (num % 1).toFixed(decimals).slice(2); // remove "0."
  const fracPart = BigInt(fracStr);
  return (wholePart * factor + fracPart).toString();
}
