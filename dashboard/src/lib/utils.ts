import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function shortenTxHash(hash: string, chars = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function getExplorerUrl(chain: string, txHash: string): string {
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io/tx/',
    arbitrum: 'https://arbiscan.io/tx/',
    base: 'https://basescan.org/tx/',
    polygon: 'https://polygonscan.com/tx/',
    sepolia: 'https://sepolia.etherscan.io/tx/',
    'arbitrum-sepolia': 'https://sepolia.arbiscan.io/tx/',
    'base-sepolia': 'https://sepolia.basescan.org/tx/',
  };
  return `${explorers[chain] || explorers.ethereum}${txHash}`;
}

export function getChainName(chain: string): string {
  const names: Record<string, string> = {
    ethereum: 'Ethereum',
    arbitrum: 'Arbitrum',
    base: 'Base',
    polygon: 'Polygon',
    sepolia: 'Sepolia',
    'arbitrum-sepolia': 'Arbitrum Sepolia',
    'base-sepolia': 'Base Sepolia',
  };
  return names[chain] || chain;
}
