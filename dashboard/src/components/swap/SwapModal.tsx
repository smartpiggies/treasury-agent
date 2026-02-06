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
import { Loader2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import type { Chain, Token } from '@/types';

interface SwapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHAINS: { value: Chain; label: string }[] = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'base', label: 'Base' },
];

const TOKENS: { value: Token; label: string }[] = [
  { value: 'USDC', label: 'USDC' },
  { value: 'ETH', label: 'ETH' },
  { value: 'WETH', label: 'WETH' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export function SwapModal({ open, onOpenChange }: SwapModalProps) {
  const [sourceChain, setSourceChain] = useState<Chain>('arbitrum');
  const [destChain, setDestChain] = useState<Chain>('arbitrum');
  const [sourceToken, setSourceToken] = useState<Token>('USDC');
  const [destToken, setDestToken] = useState<Token>('ETH');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<{ id?: string; message?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

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
      setResult({ id: response.id, message: response.message });
      setStatus('success');
    } catch (err) {
      setResult({ message: err instanceof Error ? err.message : 'Swap request failed' });
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status !== 'loading') {
      onOpenChange(false);
      // Reset after close animation
      setTimeout(() => {
        setStatus('idle');
        setResult({});
        setAmount('');
        setReason('');
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Swap</DialogTitle>
          <DialogDescription>
            Submit a swap request. Large swaps may require approval.
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium">Swap Request Submitted</p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
              {result.id && (
                <p className="mt-2 text-xs font-mono text-muted-foreground">
                  ID: {result.id}
                </p>
              )}
            </div>
            <Button onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <p className="font-medium">Swap Request Failed</p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
            </div>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
                  disabled={status === 'loading'}
                  required
                />
              </div>

              {/* From */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>From Chain</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={sourceChain}
                    onChange={(e) => setSourceChain(e.target.value as Chain)}
                    disabled={status === 'loading'}
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
                    disabled={status === 'loading'}
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
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* To */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>To Chain</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={destChain}
                    onChange={(e) => setDestChain(e.target.value as Chain)}
                    disabled={status === 'loading'}
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
                    disabled={status === 'loading'}
                  >
                    {TOKENS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Rebalancing portfolio"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={status === 'loading'}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={status === 'loading' || !amount}>
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
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
