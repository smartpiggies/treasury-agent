// Circle Gateway Wallet - same address on all chains
export const GATEWAY_WALLET = '0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE' as const;

// USDC contract addresses by chain
export const USDC_ADDRESSES = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',     // Ethereum
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // Base
} as const;

// Circle CCTP domain IDs
export const CIRCLE_DOMAINS = {
  1: 0,      // Ethereum
  42161: 3,  // Arbitrum
  8453: 6,   // Base
} as const;

// Chain names for display
export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  8453: 'Base',
};

// ERC20 ABI (minimal for approve and balanceOf)
export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
] as const;

// Circle Gateway Wallet ABI (depositForBurn)
export const GATEWAY_WALLET_ABI = [
  {
    name: 'depositForBurn',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'destinationDomain', type: 'uint32' },
      { name: 'mintRecipient', type: 'bytes32' },
      { name: 'burnToken', type: 'address' },
    ],
    outputs: [{ type: 'uint64' }],
  },
] as const;

// Helper to get USDC address for a chain
export function getUsdcAddress(chainId: number): `0x${string}` | undefined {
  return USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] as `0x${string}` | undefined;
}

// Helper to get Circle domain for a chain
export function getCircleDomain(chainId: number): number | undefined {
  return CIRCLE_DOMAINS[chainId as keyof typeof CIRCLE_DOMAINS];
}

// Convert address to bytes32 (for mintRecipient)
export function addressToBytes32(address: string): `0x${string}` {
  // Remove 0x prefix, pad to 64 characters (32 bytes), add 0x prefix back
  const cleanAddress = address.toLowerCase().replace('0x', '');
  return `0x${cleanAddress.padStart(64, '0')}` as `0x${string}`;
}

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Convert human-readable amount to USDC units (6 decimals)
export function parseUsdcAmount(amount: string | number): bigint {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.floor(num * 10 ** USDC_DECIMALS));
}

// Convert USDC units to human-readable amount
export function formatUsdcAmount(amount: bigint): string {
  const num = Number(amount) / 10 ** USDC_DECIMALS;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
