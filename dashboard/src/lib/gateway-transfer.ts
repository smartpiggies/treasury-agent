import type { WalletClient } from 'viem';
import {
  GATEWAY_WALLET,
  GATEWAY_MINTER,
  GATEWAY_EIP712_DOMAIN,
  BURN_INTENT_TYPES,
  CIRCLE_DOMAINS,
  USDC_ADDRESSES,
  addressToBytes32,
  parseUsdcAmount,
} from './contracts';

const CIRCLE_GATEWAY_URL = import.meta.env.VITE_CIRCLE_GATEWAY_URL || 'https://gateway-api.circle.com';

// Default max fee: $2.01 USDC (6 decimals)
const DEFAULT_MAX_FEE = 2_010000n;

// maxUint256 = no block height expiration
const MAX_UINT256 = 2n ** 256n - 1n;

export interface TransferSpecParams {
  sourceChainId: number;
  destChainId: number;
  amount: string;
  depositorAddress: `0x${string}`;
  destinationRecipient: `0x${string}`;
  destinationCaller: `0x${string}`;
  hookData?: `0x${string}`;
}

export interface TransferSpec {
  version: number;
  sourceDomain: number;
  destinationDomain: number;
  sourceContract: `0x${string}`;
  destinationContract: `0x${string}`;
  sourceToken: `0x${string}`;
  destinationToken: `0x${string}`;
  sourceDepositor: `0x${string}`;
  destinationRecipient: `0x${string}`;
  sourceSigner: `0x${string}`;
  destinationCaller: `0x${string}`;
  value: bigint;
  salt: `0x${string}`;
  hookData: `0x${string}`;
}

export interface BurnIntent {
  maxBlockHeight: bigint;
  maxFee: bigint;
  spec: TransferSpec;
}

/** Build a TransferSpec struct for Circle Gateway EIP-712 signing */
export function buildTransferSpec(params: TransferSpecParams): TransferSpec {
  const sourceDomain = CIRCLE_DOMAINS[params.sourceChainId as keyof typeof CIRCLE_DOMAINS];
  const destDomain = CIRCLE_DOMAINS[params.destChainId as keyof typeof CIRCLE_DOMAINS];

  if (sourceDomain === undefined || destDomain === undefined) {
    throw new Error(`Unsupported chain: source=${params.sourceChainId}, dest=${params.destChainId}`);
  }

  const sourceUsdc = USDC_ADDRESSES[params.sourceChainId as keyof typeof USDC_ADDRESSES];
  const destUsdc = USDC_ADDRESSES[params.destChainId as keyof typeof USDC_ADDRESSES];

  if (!sourceUsdc || !destUsdc) {
    throw new Error(`No USDC address for chain: source=${params.sourceChainId}, dest=${params.destChainId}`);
  }

  const salt = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;

  return {
    version: 1,
    sourceDomain,
    destinationDomain: destDomain,
    sourceContract: addressToBytes32(GATEWAY_WALLET),
    destinationContract: addressToBytes32(GATEWAY_MINTER),
    sourceToken: addressToBytes32(sourceUsdc),
    destinationToken: addressToBytes32(destUsdc),
    sourceDepositor: addressToBytes32(params.depositorAddress),
    destinationRecipient: addressToBytes32(params.destinationRecipient),
    sourceSigner: addressToBytes32(params.depositorAddress),
    destinationCaller: addressToBytes32(params.destinationCaller),
    value: parseUsdcAmount(params.amount),
    salt,
    hookData: params.hookData || '0x',
  };
}

/** Sign a BurnIntent via EIP-712 using the connected wallet */
export async function signBurnIntent(
  walletClient: WalletClient,
  transferSpec: TransferSpec,
  maxBlockHeight: bigint = MAX_UINT256,
  maxFee: bigint = DEFAULT_MAX_FEE,
): Promise<{ signature: `0x${string}`; burnIntent: BurnIntent }> {
  const account = walletClient.account;
  if (!account) throw new Error('No account connected');

  const burnIntent: BurnIntent = {
    maxBlockHeight,
    maxFee,
    spec: transferSpec,
  };

  // EIP-712 domain has no chainId per Circle spec
  const signature = await walletClient.signTypedData({
    account,
    domain: GATEWAY_EIP712_DOMAIN,
    types: BURN_INTENT_TYPES,
    primaryType: 'BurnIntent',
    message: burnIntent,
  });

  return { signature, burnIntent };
}

/** Submit a signed burn intent to Circle Gateway API.
 *  The Gateway returns attestation + signature synchronously (no polling needed). */
export async function submitTransfer(
  signature: `0x${string}`,
  burnIntent: BurnIntent,
): Promise<{ attestation: `0x${string}`; signature: `0x${string}` }> {
  // Circle API expects an array of { burnIntent, signature } objects
  // bigints must be serialized as strings
  const requests = [{ burnIntent, signature }];

  const response = await fetch(`${CIRCLE_GATEWAY_URL}/v1/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requests, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Circle API error ${response.status}: ${body}`);
  }

  const data = await response.json();

  if (!data.attestation || !data.signature) {
    throw new Error(`Circle API did not return attestation: ${JSON.stringify(data)}`);
  }

  return {
    attestation: data.attestation as `0x${string}`,
    signature: data.signature as `0x${string}`,
  };
}
