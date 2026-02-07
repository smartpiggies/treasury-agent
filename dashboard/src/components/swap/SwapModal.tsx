import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestSwap } from '@/lib/api';
import { useAccount } from 'wagmi';
import { useGatewaySwap, type SwapStep } from '@/hooks/useGatewaySwap';
import { USDC_ADDRESSES, WETH_ADDRESSES } from '@/lib/contracts';
import { Loader2, ArrowDown, CheckCircle, XCircle, Wallet, Route } from 'lucide-react';
import type { Chain, Token } from '@/types';

interface SwapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAINS: { value: Chain; label: string; chainId: number }[] = [
  { value: 'ethereum', label: 'Ethereum', chainId: 1 },
  { value: 'arbitrum', label: 'Arbitrum', chainId: 42161 },
  { value: 'base', label: 'Base', chainId: 8453 },
];

const TOKENS: { value: Token; label: string }[] = [
  { value: 'USDC', label: 'USDC' },
  { value: 'ETH', label: 'ETH' },
  { value: 'WETH', label: 'WETH' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

const STEP_LABELS: Record<SwapStep, string> = {
  idle: '',
  signing: 'Signing burn intent...',
  polling: 'Waiting for attestation...',
  executing: 'Executing swap on-chain...',
  success: 'Swap complete!',
  error: 'Swap failed',
};

function getTokenAddress(token: Token, chainId: number): `0x${string}` {
  if (token === 'USDC') {
    return USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] as `0x${string}`;
  }
  // ETH and WETH both map to WETH address for swap purposes
  return WETH_ADDRESSES[chainId] as `0x${string}`;
}

function getExpectedRoute(
  srcChain: Chain,
  destChain: Chain,
  srcToken: Token,
  destToken: Token,
): { route: string; label: string; description: string } {
  const isCrossChain = srcChain !== destChain;
  const isUsdcOnly = srcToken === 'USDC' && destToken === 'USDC';

  if (isCrossChain && isUsdcOnly) {
    return {
      route: 'circle',
      label: 'Circle Gateway',
      description: 'Instant USDC transfer across chains (<500ms)',
    };
  }
  if (isCrossChain) {
    return {
      route: 'lifi',
      label: 'LI.FI',
      description: 'Cross-chain swap with automatic bridge routing',
    };
  }
  return {
    route: 'uniswap',
    label: 'Uniswap',
    description: 'Same-chain swap via Uniswap v3',
  };
}

export function SwapModal({ open, onOpenChange }: SwapModalProps) {
  const { address, isConnected } = useAccount();
  const gatewaySwap = useGatewaySwap();

  const [sourceChain, setSourceChain] = useState<Chain>('arbitrum');
  const [destChain, setDestChain] = useState<Chain>('arbitrum');
  const [sourceToken, setSourceToken] = useState<Token>('USDC');
  const [destToken, setDestToken] = useState<Token>('ETH');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<{ id?: string; message?: string; txHash?: string; route?: string }>({});

  // Determine if on-chain path should be used
  const useOnChain = isConnected && sourceToken === 'USDC';
  const isOnChainBusy = gatewaySwap.step !== 'idle' && gatewaySwap.step !== 'success' && gatewaySwap.step !== 'error';

  const sourceChainId = CHAINS.find(c => c.value === sourceChain)?.chainId || 42161;
  const destChainId = CHAINS.find(c => c.value === destChain)?.chainId || 42161;

  const expectedRoute = getExpectedRoute(sourceChain, destChain, sourceToken, destToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    if (useOnChain) {
      // On-chain path via GatewaySwapReceiver
      const destTokenAddress = getTokenAddress(destToken, destChainId);
      // Use 0.5% slippage → amountOutMin = 0 for now (can add quote later)
      await gatewaySwap.sign({
        sourceChainId,
        destChainId,
        amount,
        destToken: destTokenAddress,
        amountOutMin: 0n,
      });
    } else {
      // n8n webhook path
      setStatus('loading');
      try {
        const response = await requestSwap({
          sourceChain,
          destChain,
          sourceToken,
          destToken,
          amount,
          reason: reason || undefined,
        });
        setResult({ id: response.executionId, message: response.message, route: response.route });
        setStatus('success');
      } catch (err) {
        setResult({ message: err instanceof Error ? err.message : 'Swap request failed' });
        setStatus('error');
      }
    }
  };

  const handleClose = () => {
    if (status !== 'loading' && !isOnChainBusy) {
      onOpenChange(false);
      // Reset after close animation
      setTimeout(() => {
        setStatus('idle');
        setResult({});
        setAmount('');
        setReason('');
        gatewaySwap.reset();
      }, 200);
    }
  };

  // On-chain success/error states
  const isSuccess = useOnChain ? gatewaySwap.step === 'success' : status === 'success';
  const isError = useOnChain ? gatewaySwap.step === 'error' : status === 'error';
  const isLoading = useOnChain ? isOnChainBusy : status === 'loading';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {useOnChain ? 'Swap via Gateway' : 'Request Swap'}
          </DialogTitle>
          <DialogDescription>
            {useOnChain ? (
              <>Wallet connected. Swap executes on-chain via Circle Gateway.</>
            ) : (
              <>Submit a swap request. Large swaps may require approval.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium">
                {useOnChain ? 'Swap Executed' : 'Swap Request Submitted'}
              </p>
              {result.route && (
                <p className="text-xs text-muted-foreground mt-1">
                  via {result.route === 'uniswap' ? 'Uniswap' : result.route === 'lifi' ? 'LI.FI' : result.route === 'gateway' ? 'Circle Gateway' : result.route}
                </p>
              )}
              {useOnChain && gatewaySwap.txHash ? (
                <>
                  <p className="text-xs text-muted-foreground mt-1">via Circle Gateway + Uniswap</p>
                  <p className="mt-2 text-xs font-mono text-muted-foreground break-all">
                    Tx: {gatewaySwap.txHash}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  {result.id && (
                    <p className="mt-2 text-xs font-mono text-muted-foreground">
                      ID: {result.id}
                    </p>
                  )}
                </>
              )}
            </div>
            <Button onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <p className="font-medium">Swap Failed</p>
              <p className="text-sm text-muted-foreground">
                {useOnChain ? gatewaySwap.error : result.message}
              </p>
            </div>
            <Button
              onClick={() => {
                if (useOnChain) gatewaySwap.reset();
                else setStatus('idle');
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* On-chain indicator */}
              {useOnChain && (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-md px-3 py-2">
                  <Wallet className="h-3 w-3" />
                  <span>On-chain execution via {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
              )}

              {/* Amount */}
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* From */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>From Chain</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={sourceChain}
                    onChange={(e) => setSourceChain(e.target.value as Chain)}
                    disabled={isLoading}
                  >
                    {CHAINS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>From Token</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={sourceToken}
                    onChange={(e) => setSourceToken(e.target.value as Token)}
                    disabled={isLoading}
                  >
                    {TOKENS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>To Chain</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={destChain}
                    onChange={(e) => setDestChain(e.target.value as Chain)}
                    disabled={isLoading}
                  >
                    {CHAINS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>To Token</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={destToken}
                    onChange={(e) => setDestToken(e.target.value as Token)}
                    disabled={isLoading}
                  >
                    {TOKENS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Route indicator */}
              <div className="flex items-center gap-2 text-xs rounded-md px-3 py-2 bg-muted/50">
                <Route className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">Route: {expectedRoute.label}</span>
                <span className="text-muted-foreground">&mdash; {expectedRoute.description}</span>
              </div>

              {/* Reason (only for n8n path) */}
              {!useOnChain && (
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Rebalancing portfolio"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* On-chain step progress */}
              {useOnChain && isOnChainBusy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{STEP_LABELS[gatewaySwap.step]}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !amount}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {useOnChain ? 'Swapping...' : 'Submitting...'}
                  </>
                ) : useOnChain ? (
                  'Swap On-Chain'
                ) : (
                  'Submit Swap'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
