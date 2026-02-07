import { useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { getWalletClient } from '@wagmi/core';
import { config } from '@/lib/wagmi';
import {
  GATEWAY_SWAP_RECEIVER,
  GATEWAY_SWAP_RECEIVER_ABI,
  USDC_ADDRESSES,
  WETH_ADDRESSES,
  parseUsdcAmount,
} from '@/lib/contracts';
import {
  buildTransferSpec,
  signBurnIntent,
  submitTransfer,
  pollForAttestation,
} from '@/lib/gateway-transfer';
import { buildSwapCommands, getPoolFee } from '@/lib/uniswap';

export type SwapStep = 'idle' | 'signing' | 'polling' | 'executing' | 'success' | 'error';

interface UseGatewaySwapReturn {
  step: SwapStep;
  error: string | null;
  txHash: `0x${string}` | undefined;
  sign: (params: GatewaySwapParams) => Promise<void>;
  reset: () => void;
}

export interface GatewaySwapParams {
  sourceChainId: number;
  destChainId: number;
  amount: string;
  destToken: `0x${string}`;
  amountOutMin: bigint;
  slippageBps?: number; // basis points, default 50 (0.5%)
}

export function useGatewaySwap(): UseGatewaySwapReturn {
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<SwapStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const sign = useCallback(async (params: GatewaySwapParams) => {
    if (!address || !chainId) {
      setError('Wallet not connected');
      setStep('error');
      return;
    }

    // Fetch wallet client imperatively to avoid stale reactive state
    let walletClient;
    try {
      walletClient = await getWalletClient(config);
    } catch {
      setError('Wallet not connected');
      setStep('error');
      return;
    }

    const receiverAddress = GATEWAY_SWAP_RECEIVER[params.destChainId];
    if (!receiverAddress || receiverAddress === '0x0000000000000000000000000000000000000000') {
      setError('GatewaySwapReceiver not deployed on destination chain');
      setStep('error');
      return;
    }

    try {
      // Step 1: Sign EIP-712 BurnIntent
      setStep('signing');
      setError(null);

      const transferSpec = buildTransferSpec({
        sourceChainId: params.sourceChainId,
        destChainId: params.destChainId,
        amount: params.amount,
        depositorAddress: address,
        destinationRecipient: receiverAddress,
        destinationCaller: receiverAddress,
      });

      const { signature, burnIntent } = await signBurnIntent(walletClient, transferSpec);

      // Step 2: Submit to Circle API and poll for attestation
      setStep('polling');

      const { transferId } = await submitTransfer(signature, burnIntent);
      const attestationResult = await pollForAttestation(transferId);

      // Step 3: Build swap commands and execute on-chain
      setStep('executing');

      const usdcAddress = USDC_ADDRESSES[params.destChainId as keyof typeof USDC_ADDRESSES] as `0x${string}`;
      const fee = getPoolFee(params.destChainId, usdcAddress, params.destToken);
      const amountIn = parseUsdcAmount(params.amount);

      const { commands, inputs } = buildSwapCommands({
        chainId: params.destChainId,
        amountIn,
        amountOutMin: params.amountOutMin,
        tokenIn: usdcAddress,
        tokenOut: params.destToken,
        recipient: address,
        fee,
      });

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 min

      // Determine output token for contract (address(0) for native ETH)
      const weth = WETH_ADDRESSES[params.destChainId];
      const outputToken = params.destToken.toLowerCase() === weth?.toLowerCase()
        ? '0x0000000000000000000000000000000000000000' as `0x${string}`
        : params.destToken;

      const hash = await writeContractAsync({
        address: receiverAddress,
        abi: GATEWAY_SWAP_RECEIVER_ABI,
        functionName: 'executeSwap',
        args: [
          attestationResult.attestation,
          attestationResult.signature,
          commands,
          inputs,
          deadline,
          outputToken,
          address,
        ],
      });

      setTxHash(hash);
      setStep('success');
    } catch (err) {
      console.error('Gateway swap error:', err);
      setError(err instanceof Error ? err.message : 'Swap failed');
      setStep('error');
    }
  }, [address, chainId, writeContractAsync]);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setTxHash(undefined);
  }, []);

  return { step, error, txHash, sign, reset };
}
