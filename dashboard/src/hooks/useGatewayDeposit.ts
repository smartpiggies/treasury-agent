import { useState, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import {
  GATEWAY_WALLET,
  ERC20_ABI,
  GATEWAY_WALLET_ABI,
  getUsdcAddress,
  getCircleDomain,
  addressToBytes32,
  parseUsdcAmount,
  formatUsdcAmount,
} from '@/lib/contracts';

export type DepositStep = 'idle' | 'approve' | 'approving' | 'deposit' | 'depositing' | 'success' | 'error';

interface UseGatewayDepositReturn {
  // State
  step: DepositStep;
  error: string | null;
  approveTxHash: `0x${string}` | undefined;
  depositTxHash: `0x${string}` | undefined;

  // Data
  usdcBalance: bigint | undefined;
  usdcBalanceFormatted: string;
  allowance: bigint | undefined;
  needsApproval: boolean;

  // Actions
  approve: (amount: string) => Promise<void>;
  deposit: (amount: string, recipientAddress?: string) => Promise<void>;
  reset: () => void;
}

export function useGatewayDeposit(): UseGatewayDepositReturn {
  const { address, chainId } = useAccount();
  const [step, setStep] = useState<DepositStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [depositTxHash, setDepositTxHash] = useState<`0x${string}` | undefined>();
  const [pendingAmount, setPendingAmount] = useState<bigint>(0n);

  const usdcAddress = chainId ? getUsdcAddress(chainId) : undefined;

  // Read USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && usdcAddress),
    },
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, GATEWAY_WALLET] : undefined,
    query: {
      enabled: Boolean(address && usdcAddress),
    },
  });

  // Write contract hooks
  const { writeContractAsync } = useWriteContract();

  // Wait for approval transaction
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  // Wait for deposit transaction
  const { isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  // Check if approval is needed
  const needsApproval = allowance !== undefined && pendingAmount > 0n && allowance < pendingAmount;

  // Format balance for display
  const usdcBalanceFormatted = usdcBalance !== undefined
    ? formatUsdcAmount(usdcBalance)
    : '0.00';

  // Approve function
  const approve = useCallback(async (amount: string) => {
    if (!usdcAddress || !address) {
      setError('Wallet not connected or unsupported chain');
      return;
    }

    try {
      setStep('approve');
      setError(null);
      const amountParsed = parseUsdcAmount(amount);
      setPendingAmount(amountParsed);

      setStep('approving');
      const hash = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [GATEWAY_WALLET, amountParsed],
      });

      setApproveTxHash(hash);
      // Wait for confirmation will update via useWaitForTransactionReceipt
    } catch (err) {
      console.error('Approve error:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve');
      setStep('error');
    }
  }, [usdcAddress, address, writeContractAsync]);

  // Deposit function
  const deposit = useCallback(async (amount: string, recipientAddress?: string) => {
    if (!usdcAddress || !address || !chainId) {
      setError('Wallet not connected or unsupported chain');
      return;
    }

    const domain = getCircleDomain(chainId);
    if (domain === undefined) {
      setError('Unsupported chain for Circle Gateway');
      return;
    }

    try {
      setStep('deposit');
      setError(null);
      const amountParsed = parseUsdcAmount(amount);

      // Use recipient address or default to connected wallet
      const recipient = recipientAddress || address;
      const mintRecipient = addressToBytes32(recipient);

      setStep('depositing');
      const hash = await writeContractAsync({
        address: GATEWAY_WALLET,
        abi: GATEWAY_WALLET_ABI,
        functionName: 'depositForBurn',
        args: [amountParsed, domain, mintRecipient, usdcAddress],
      });

      setDepositTxHash(hash);
      // Wait for confirmation will update via useWaitForTransactionReceipt
    } catch (err) {
      console.error('Deposit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to deposit');
      setStep('error');
    }
  }, [usdcAddress, address, chainId, writeContractAsync]);

  // Reset state
  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setApproveTxHash(undefined);
    setDepositTxHash(undefined);
    setPendingAmount(0n);
    refetchBalance();
    refetchAllowance();
  }, [refetchBalance, refetchAllowance]);

  // Update step based on transaction status
  if (isApproveSuccess && step === 'approving') {
    setStep('deposit');
    refetchAllowance();
  }

  if (isDepositSuccess && step === 'depositing') {
    setStep('success');
    refetchBalance();
  }

  return {
    step,
    error,
    approveTxHash,
    depositTxHash,
    usdcBalance,
    usdcBalanceFormatted,
    allowance,
    needsApproval,
    approve,
    deposit,
    reset,
  };
}
