import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, shortenTxHash, getExplorerUrl, getChainName } from '@/lib/utils';
import {
  ArrowRightLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import type { ExecutionStatus } from '@/types';

// Placeholder data
const mockExecutions = [
  {
    id: '1',
    timestamp: '2026-01-31T14:30:00Z',
    type: 'swap',
    sourceChain: 'arbitrum',
    destChain: 'base',
    sourceToken: 'USDC',
    destToken: 'ETH',
    amount: '5000',
    status: 'completed' as ExecutionStatus,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    route: 'lifi',
  },
  {
    id: '2',
    timestamp: '2026-01-31T10:15:00Z',
    type: 'swap',
    sourceChain: 'ethereum',
    destChain: 'ethereum',
    sourceToken: 'ETH',
    destToken: 'USDC',
    amount: '2',
    status: 'completed' as ExecutionStatus,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    route: 'uniswap',
  },
  {
    id: '3',
    timestamp: '2026-01-30T16:45:00Z',
    type: 'swap',
    sourceChain: 'base',
    destChain: 'arbitrum',
    sourceToken: 'USDC',
    destToken: 'USDC',
    amount: '10000',
    status: 'failed' as ExecutionStatus,
    error: 'Slippage exceeded maximum',
    route: 'lifi',
  },
  {
    id: '4',
    timestamp: '2026-01-31T15:00:00Z',
    type: 'swap',
    sourceChain: 'arbitrum',
    destChain: 'arbitrum',
    sourceToken: 'USDC',
    destToken: 'ETH',
    amount: '1000',
    status: 'awaiting_confirmation' as ExecutionStatus,
    route: 'uniswap',
  },
];

function StatusBadge({ status }: { status: ExecutionStatus }) {
  const config = {
    pending: { icon: Clock, className: 'text-yellow-600 bg-yellow-100' },
    awaiting_confirmation: {
      icon: Clock,
      className: 'text-orange-600 bg-orange-100',
    },
    confirmed: { icon: Loader2, className: 'text-blue-600 bg-blue-100' },
    executing: { icon: Loader2, className: 'text-blue-600 bg-blue-100' },
    completed: { icon: CheckCircle, className: 'text-green-600 bg-green-100' },
    failed: { icon: XCircle, className: 'text-red-600 bg-red-100' },
    cancelled: { icon: XCircle, className: 'text-gray-600 bg-gray-100' },
  };

  const { icon: Icon, className } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
        className
      )}
    >
      <Icon className={cn('h-3 w-3', status === 'executing' && 'animate-spin')} />
      {status.replace('_', ' ')}
    </span>
  );
}

export function History() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execution History</h1>
          <p className="text-muted-foreground">
            View past swaps and operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            All
          </Button>
          <Button variant="outline" size="sm">
            Completed
          </Button>
          <Button variant="outline" size="sm">
            Pending
          </Button>
          <Button variant="outline" size="sm">
            Failed
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>
            Showing last 50 transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-secondary p-2">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {execution.amount} {execution.sourceToken}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{execution.destToken}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getChainName(execution.sourceChain)}
                      {execution.sourceChain !== execution.destChain && (
                        <> → {getChainName(execution.destChain)}</>
                      )}
                      <span className="mx-2">•</span>
                      via {execution.route}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm">
                      {new Date(execution.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(execution.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <StatusBadge status={execution.status} />

                  {execution.txHash && (
                    <a
                      href={getExplorerUrl(execution.destChain, execution.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {shortenTxHash(execution.txHash)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {execution.status === 'awaiting_confirmation' && (
                    <Button size="sm">Confirm</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
