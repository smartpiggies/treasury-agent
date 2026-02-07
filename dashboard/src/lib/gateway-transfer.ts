import type { WalletClient } from 'viem';
import {
  GATEWAY_WALLET,
  GATEWAY_EIP712_DOMAIN,
  TRANSFER_SPEC_TYPES,
  CIRCLE_DOMAINS,
  USDC_ADDRESSES,
  addressToBytes32,
  parseUsdcAmount,
} from './contracts';

const CIRCLE_GATEWAY_URL = import.meta.env.VITE_CIRCLE_GATEWAY_URL || 'https://gateway-api.circle.com';

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

  const gatewayBytes32 = addressToBytes32(GATEWAY_WALLET);
  const salt = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;

  return {
    version: 1,
    sourceDomain,
    destinationDomain: destDomain,
    sourceContract: gatewayBytes32,
    destinationContract: gatewayBytes32,
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
): Promise<`0x${string}`> {
  const account = walletClient.account;
  if (!account) throw new Error('No account connected');

  // EIP-712 domain has no chainId per Circle spec
  const signature = await walletClient.signTypedData({
    account,
    domain: GATEWAY_EIP712_DOMAIN,
    types: TRANSFER_SPEC_TYPES,
    primaryType: 'TransferSpec',
    message: transferSpec,
  });

  return signature;
}

/** Submit a signed transfer to Circle Gateway API */
export async function submitTransfer(
  signature: `0x${string}`,
  transferSpec: TransferSpec,
): Promise<{ transferId: string }> {
  const response = await fetch(`${CIRCLE_GATEWAY_URL}/v1/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transferSpec: {
        version: transferSpec.version,
        sourceDomain: transferSpec.sourceDomain,
        destinationDomain: transferSpec.destinationDomain,
        sourceContract: transferSpec.sourceContract,
        destinationContract: transferSpec.destinationContract,
        sourceToken: transferSpec.sourceToken,
        destinationToken: transferSpec.destinationToken,
        sourceDepositor: transferSpec.sourceDepositor,
        destinationRecipient: transferSpec.destinationRecipient,
        sourceSigner: transferSpec.sourceSigner,
        destinationCaller: transferSpec.destinationCaller,
        value: transferSpec.value.toString(),
        salt: transferSpec.salt,
        hookData: transferSpec.hookData,
      },
      signature,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Circle API error ${response.status}: ${body}`);
  }

  return response.json();
}

/** Poll Circle Gateway for attestation until ready */
export async function pollForAttestation(
  transferId: string,
  maxAttempts = 60,
  intervalMs = 2000,
): Promise<{ attestation: `0x${string}`; signature: `0x${string}` }> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${CIRCLE_GATEWAY_URL}/v1/transfer/${transferId}`);

    if (!response.ok) {
      throw new Error(`Circle API error ${response.status}`);
    }

    const data = await response.json();

    if (data.attestation && data.signature) {
      return {
        attestation: data.attestation as `0x${string}`,
        signature: data.signature as `0x${string}`,
      };
    }

    if (data.status === 'failed') {
      throw new Error(`Transfer failed: ${data.error || 'unknown error'}`);
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Attestation polling timed out');
}
