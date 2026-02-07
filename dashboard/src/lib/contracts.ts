// Circle Gateway Wallet - same address on all chains
export const GATEWAY_WALLET = '0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE' as const;

// Circle Gateway Minter - same address on all chains
export const GATEWAY_MINTER = '0x2222222d7164433c4C09B0b0D809a9b52C04C205' as const;

// Uniswap Universal Router addresses per chain
export const UNIVERSAL_ROUTER: Record<number, `0x${string}`> = {
  42161: '0xa51afafe0263b40edaef0df8781ea9aa03e381a3', // Arbitrum
  8453: '0x6ff5693b99212da76ad316178a184ab56d299b43',  // Base
  1: '0x66a9893cc07d91d95644aedd05d03f95e1dba8af',    // Ethereum
};

// WETH addresses per chain
export const WETH_ADDRESSES: Record<number, `0x${string}`> = {
  42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // Arbitrum
  8453: '0x4200000000000000000000000000000000000006',    // Base
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',     // Ethereum
};

// GatewaySwapReceiver contract - deployed per chain (update after deployment)
export const GATEWAY_SWAP_RECEIVER: Record<number, `0x${string}`> = {
  42161: '0x0000000000000000000000000000000000000000', // Arbitrum - TODO: update after deploy
  8453: '0x0000000000000000000000000000000000000000',  // Base - TODO: update after deploy
};

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

// Circle Gateway Wallet ABI (deposit + balance queries)
export const GATEWAY_WALLET_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'totalBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'depositor', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'availableBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'depositor', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
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

// Gateway Minter ABI (for calling gatewayMint directly)
export const GATEWAY_MINTER_ABI = [
  {
    name: 'gatewayMint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'attestation', type: 'bytes' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

// GatewaySwapReceiver ABI
export const GATEWAY_SWAP_RECEIVER_ABI = [
  {
    name: 'executeSwap',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'attestation', type: 'bytes' },
      { name: 'signature', type: 'bytes' },
      { name: 'commands', type: 'bytes' },
      { name: 'inputs', type: 'bytes[]' },
      { name: 'deadline', type: 'uint256' },
      { name: 'outputToken', type: 'address' },
      { name: 'recipient', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'rescueTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [],
  },
] as const;

// EIP-712 domain for Gateway TransferSpec signing
export const GATEWAY_EIP712_DOMAIN = {
  name: 'GatewayWallet',
  version: '1',
} as const;

// EIP-712 TransferSpec type definition
export const TRANSFER_SPEC_TYPES = {
  TransferSpec: [
    { name: 'version', type: 'uint8' },
    { name: 'sourceDomain', type: 'uint32' },
    { name: 'destinationDomain', type: 'uint32' },
    { name: 'sourceContract', type: 'bytes32' },
    { name: 'destinationContract', type: 'bytes32' },
    { name: 'sourceToken', type: 'bytes32' },
    { name: 'destinationToken', type: 'bytes32' },
    { name: 'sourceDepositor', type: 'bytes32' },
    { name: 'destinationRecipient', type: 'bytes32' },
    { name: 'sourceSigner', type: 'bytes32' },
    { name: 'destinationCaller', type: 'bytes32' },
    { name: 'value', type: 'uint256' },
    { name: 'salt', type: 'bytes32' },
    { name: 'hookData', type: 'bytes' },
  ],
} as const;

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
