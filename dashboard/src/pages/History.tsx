import { useState, useEffect, useCallback } from 'react';
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
  databases,
  DATABASE_ID,
  COLLECTIONS,
  Query,
  isAppwriteConfigured,
} from '@/lib/appwrite';
import {
  ArrowRightLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Inbox,
} from 'lucide-react';
import type { ExecutionStatus } from '@/types';

type FilterType = 'all' | 'completed' | 'pending' | 'failed';

interface Execution {
  $id: string;
  $createdAt: string;
  timestamp: string;
  type: string;
  source_chain: string;
  dest_chain: string;
  source_token: string;
  dest_token: string;
  amount: string;
  status: ExecutionStatus;
  tx_hash?: string;
  route?: string;
  error?: string;
  reason?: string;
  recipient?: string;
  recipient_ens?: string;
}

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

  const { icon: Icon, className } = config[status] || config.pending;

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
  const appwriteReady = isAppwriteConfigured();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchExecutions = useCallback(async () => {
    if (!appwriteReady) return;

    setIsLoading(true);
    setError(null);

    try {
      // Build queries based on filter
      const queries = [
        Query.orderDesc('timestamp'),
        Query.limit(50),
      ];

      if (filter === 'completed') {
        queries.push(Query.equal('status', 'completed'));
      } else if (filter === 'pending') {
        queries.push(
          Query.equal('status', ['pending', 'awaiting_confirmation', 'executing'])
        );
      } else if (filter === 'failed') {
        queries.push(Query.equal('status', ['failed', 'cancelled']));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.EXECUTIONS,
        queries
      );

      setExecutions(response.documents as unknown as Execution[]);
    } catch (err) {
      console.error('Failed to fetch executions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch executions');
    } finally {
      setIsLoading(false);
    }
  }, [appwriteReady, filter]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

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
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'failed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('failed')}
          >
            Failed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExecutions}
            disabled={isLoading || !appwriteReady}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Configuration warning */}
      {!appwriteReady && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="flex items-center gap-2 pt-4 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            Appwrite is not configured. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in .env.local
          </CardContent>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="flex items-center gap-2 pt-4 text-sm text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4" />
            {error}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>
            {executions.length > 0
              ? `Showing ${executions.length} transaction${executions.length !== 1 ? 's' : ''}`
              : 'No transactions yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : executions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No executions found</p>
              <p className="text-sm">
                {filter !== 'all'
                  ? `No ${filter} transactions. Try a different filter.`
                  : 'Request a swap to see transactions here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div
                  key={execution.$id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-secondary p-2">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {execution.amount} {execution.source_token}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{execution.dest_token}</span>
                        {execution.recipient_ens && (
                          <span className="text-sm text-muted-foreground">
                            to {execution.recipient_ens}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getChainName(execution.source_chain)}
                        {execution.source_chain !== execution.dest_chain && (
                          <> → {getChainName(execution.dest_chain)}</>
                        )}
                        {execution.route && (
                          <>
                            <span className="mx-2">•</span>
                            via {execution.route}
                          </>
                        )}
                        {execution.reason && (
                          <>
                            <span className="mx-2">•</span>
                            {execution.reason}
                          </>
                        )}
                      </div>
                      {execution.error && (
                        <div className="text-sm text-red-600 mt-1">
                          {execution.error}
                        </div>
                      )}
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

                    {execution.tx_hash && (
                      <a
                        href={getExplorerUrl(execution.dest_chain, execution.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {shortenTxHash(execution.tx_hash)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
