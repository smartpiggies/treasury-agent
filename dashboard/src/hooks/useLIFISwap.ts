import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi';
import {
  getQuote,
  getTokenAddress,
  isNativeToken,
  parseTokenAmount,
  type LIFIQuote,
} from '@/lib/lifi';
import { ERC20_ABI } from '@/lib/contracts';
import type { Token } from '@/types';

export type LIFISwapStep = 'idle' | 'quoting' | 'approving' | 'executing' | 'success' | 'error';

export interface LIFISwapParams {
  sourceChainId: number;
  destChainId: number;
  sourceToken: Token;
  destToken: Token;
  amount: string; // human-readable
}

interface UseLIFISwapReturn {
  step: LIFISwapStep;
  error: string | null;
  txHash: `0x${string}` | undefined;
  quote: LIFIQuote | null;
  swap: (params: LIFISwapParams) => Promise<void>;
  reset: () => void;
}

const MAX_UINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export function useLIFISwap(): UseLIFISwapReturn {
  const { address, chainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<LIFISwapStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [quote, setQuote] = useState<LIFIQuote | null>(null);

  const swap = useCallback(async (params: LIFISwapParams) => {
    if (!address || !chainId) {
      setError('Wallet not connected');
      setStep('error');
      return;
    }

    if (chainId !== params.sourceChainId) {
      setError(`Please switch to the source chain (chain ID ${params.sourceChainId}) before swapping`);
      setStep('error');
      return;
    }

    try {
      // Step 1: Get quote
      setStep('quoting');
      setError(null);
      setQuote(null);

      const fromToken = getTokenAddress(params.sourceToken, params.sourceChainId);
      const toToken = getTokenAddress(params.destToken, params.destChainId);
      const fromAmount = parseTokenAmount(params.amount, params.sourceToken);

      const quoteResult = await getQuote({
        fromChain: params.sourceChainId,
        toChain: params.destChainId,
        fromToken,
        toToken,
        fromAmount,
        fromAddress: address,
      });

      setQuote(quoteResult);

      // Step 2: Approve ERC-20 if needed (skip for native ETH)
      if (!isNativeToken(fromToken)) {
        setStep('approving');

        const spender = quoteResult.transactionRequest.to;

        const { readContract } = await import('@wagmi/core');
        const { config } = await import('@/lib/wagmi');

        const currentAllowance = await readContract(config, {
          address: fromToken,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [address, spender],
        }) as bigint;

        if (currentAllowance < BigInt(fromAmount)) {
          await writeContractAsync({
            address: fromToken,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender, MAX_UINT256],
          });
        }
      }

      // Step 3: Execute the swap transaction
      setStep('executing');

      const tx = quoteResult.transactionRequest;
      const hash = await sendTransactionAsync({
        to: tx.to,
        data: tx.data,
        value: BigInt(tx.value || '0'),
        gas: tx.gasLimit ? BigInt(tx.gasLimit) : undefined,
      });

      setTxHash(hash);
      setStep('success');
    } catch (err) {
      console.error('LI.FI swap error:', err);
      setError(err instanceof Error ? err.message : 'Swap failed');
      setStep('error');
    }
  }, [address, chainId, sendTransactionAsync, writeContractAsync]);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setTxHash(undefined);
    setQuote(null);
  }, []);

  return { step, error, txHash, quote, swap, reset };
}
