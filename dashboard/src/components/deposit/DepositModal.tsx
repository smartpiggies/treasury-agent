import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGatewayDeposit, type DepositStep } from '@/hooks/useGatewayDeposit';
import { CHAIN_NAMES, parseUsdcAmount } from '@/lib/contracts';
import { shortenTxHash } from '@/lib/utils';
import { Check, Loader2, AlertCircle, ExternalLink, Wallet, ArrowRight } from 'lucide-react';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUPPORTED_CHAINS = [42161, 8453, 1]; // Arbitrum, Base, Ethereum

// Explorer URLs by chain ID
const EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  42161: 'https://arbiscan.io',
  8453: 'https://basescan.org',
};

function getExplorerTxUrl(chainId: number, txHash: string): string {
  const baseUrl = EXPLORER_URLS[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const [amount, setAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState<number>(42161); // Default to Arbitrum

  const {
    step,
    error,
    approveTxHash,
    depositTxHash,
    usdcBalanceFormatted,
    usdcBalance,
    allowance,
    approve,
    deposit,
    reset,
  } = useGatewayDeposit();

  // Check if we need to approve
  const amountParsed = amount ? parseUsdcAmount(amount) : 0n;
  const needsApproval = allowance !== undefined && amountParsed > 0n && allowance < amountParsed;
  const hasEnoughBalance = usdcBalance !== undefined && amountParsed > 0n && usdcBalance >= amountParsed;

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setAmount('');
      reset();
    }
  }, [open, reset]);

  // Auto-switch to selected chain if different
  const isCorrectChain = chainId === selectedChain;

  const handleChainSelect = (newChainId: number) => {
    setSelectedChain(newChainId);
    if (isConnected && chainId !== newChainId) {
      switchChain({ chainId: newChainId });
    }
  };

  const handleApprove = async () => {
    if (!amount) return;
    await approve(amount);
  };

  const handleDeposit = async () => {
    if (!amount) return;
    await deposit(amount);
  };

  const handleMaxClick = () => {
    if (usdcBalanceFormatted) {
      setAmount(usdcBalanceFormatted.replace(/,/g, ''));
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Helper to check step types safely
  const isStep = (s: DepositStep, ...targets: DepositStep[]): boolean => targets.includes(s);

  // Render different content based on step
  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Wallet className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Connect your wallet to deposit USDC to Circle Gateway
          </p>
          <Button onClick={openConnectModal}>
            Connect Wallet
          </Button>
        </div>
      );
    }

    if (step === 'success') {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Deposit Successful!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              ${amount} USDC deposited to Circle Gateway
            </p>
          </div>
          {depositTxHash && (
            <a
              href={getExplorerTxUrl(selectedChain, depositTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View transaction {shortenTxHash(depositTxHash)}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Button onClick={handleClose} className="mt-4">
            Done
          </Button>
        </div>
      );
    }

    if (step === 'error') {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Transaction Failed</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {error || 'An error occurred during the transaction'}
            </p>
          </div>
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Chain Selection */}
        <div className="space-y-2">
          <Label>Select Chain</Label>
          <div className="grid grid-cols-3 gap-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <Button
                key={chain}
                variant={selectedChain === chain ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleChainSelect(chain)}
                className="w-full"
              >
                {CHAIN_NAMES[chain]}
              </Button>
            ))}
          </div>
          {!isCorrectChain && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Please switch to {CHAIN_NAMES[selectedChain]} in your wallet
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <span className="text-xs text-muted-foreground">
              Balance: ${usdcBalanceFormatted}
            </span>
          </div>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={!isCorrectChain || step !== 'idle'}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8"
              onClick={handleMaxClick}
              disabled={!isCorrectChain || step !== 'idle'}
            >
              MAX
            </Button>
          </div>
          {amount && !hasEnoughBalance && (
            <p className="text-xs text-red-500">Insufficient USDC balance</p>
          )}
        </div>

        {/* Transaction Steps */}
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 'approving' ? 'bg-primary text-primary-foreground' :
              isStep(step, 'deposit', 'depositing', 'success') || !needsApproval ? 'bg-green-100 dark:bg-green-900' :
              'bg-secondary'
            }`}>
              {step === 'approving' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isStep(step, 'deposit', 'depositing', 'success') || !needsApproval ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                '1'
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Approve USDC</p>
              <p className="text-xs text-muted-foreground">
                {needsApproval ? 'Allow Gateway to spend your USDC' : 'Already approved'}
              </p>
            </div>
            {approveTxHash && (
              <a
                href={getExplorerTxUrl(selectedChain, approveTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View <ExternalLink className="inline h-3 w-3" />
              </a>
            )}
          </div>

          <div className="ml-4 border-l-2 border-dashed h-4" />

          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step === 'depositing' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}>
              {step === 'depositing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '2'
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Deposit to Gateway</p>
              <p className="text-xs text-muted-foreground">
                Send USDC to Circle Gateway
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {needsApproval && step === 'idle' && (
            <Button
              onClick={handleApprove}
              disabled={!amount || !hasEnoughBalance || !isCorrectChain}
              className="flex-1"
            >
              Approve USDC
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {(!needsApproval || step === 'deposit') && !isStep(step, 'approving', 'depositing') && (
            <Button
              onClick={handleDeposit}
              disabled={!amount || !hasEnoughBalance || !isCorrectChain || step === 'approving'}
              className="flex-1"
            >
              {step === 'deposit' ? 'Complete Deposit' : 'Deposit USDC'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {isStep(step, 'approving', 'depositing') && (
            <Button disabled className="flex-1">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {step === 'approving' ? 'Approving...' : 'Depositing...'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit USDC</DialogTitle>
          <DialogDescription>
            Deposit USDC to Circle Gateway for chain-abstracted balance
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
