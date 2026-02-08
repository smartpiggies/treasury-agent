import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  isAppwriteConfigured,
  databases,
  DATABASE_ID,
  COLLECTIONS,
  Query,
} from '@/lib/appwrite';
import {
  isN8nConfigured,
  getBalance,
  triggerDailyReport,
  type TreasuryBalance,
} from '@/lib/api';
import { DepositModal } from '@/components/deposit/DepositModal';
import { SwapModal } from '@/components/swap/SwapModal';
import { useGatewayBalance } from '@/hooks/useGatewayBalance';
import { useWalletBalances } from '@/hooks/useWalletBalances';
import {
  Wallet,
  TrendingUp,
  Activity,
  AlertTriangle,
  RefreshCw,
  ArrowDownToLine,
  Loader2,
  ArrowLeftRight,
  FileText,
  DollarSign,
  ClipboardList,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type Notification = {
  type: 'success' | 'error';
  message: string;
} | null;

export function Dashboard() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const appwriteReady = isAppwriteConfigured();
  const n8nReady = isN8nConfigured();
  const gateway = useGatewayBalance();
  const [treasuryData, setTreasuryData] = useState<TreasuryBalance | null>(null);
  const walletBalances = useWalletBalances(treasuryData?.eth_price ?? 0);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTreasuryData = useCallback(async () => {
    if (!n8nReady) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBalance();
      setTreasuryData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [n8nReady]);

  const fetchAppwriteCounts = useCallback(async () => {
    if (!appwriteReady) return;

    try {
      // Fetch pending executions and unacknowledged alerts in parallel
      const [executionsResponse, alertsResponse] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.EXECUTIONS, [
          Query.equal('status', ['pending', 'awaiting_confirmation', 'executing']),
          Query.limit(100),
        ]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.ALERTS, [
          Query.equal('acknowledged', false),
          Query.limit(100),
        ]),
      ]);

      setPendingCount(executionsResponse.total);
      setAlertCount(alertsResponse.total);
    } catch (err) {
      console.error('Failed to fetch Appwrite counts:', err);
    }
  }, [appwriteReady]);

  useEffect(() => {
    fetchTreasuryData();
    fetchAppwriteCounts();
  }, [fetchTreasuryData, fetchAppwriteCounts]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleTriggerDailyReport = async () => {
    setActionLoading('daily-report');
    try {
      await triggerDailyReport();
      setNotification({ type: 'success', message: 'Daily report triggered! Check Discord.' });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to trigger report',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckPrices = async () => {
    await fetchTreasuryData();
    if (!error) {
      setNotification({ type: 'success', message: 'Prices refreshed!' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration warnings */}
      {(!appwriteReady || !n8nReady) && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="h-5 w-5" />
              Configuration Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-600 dark:text-yellow-400">
            {!appwriteReady && (
              <p>Appwrite is not configured. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in .env.local</p>
            )}
            {!n8nReady && (
              <p>n8n is not configured. Set VITE_N8N_WEBHOOK_BASE in .env.local</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Treasury overview and quick actions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchTreasuryData();
            fetchAppwriteCounts();
            gateway.refetch();
            walletBalances.refetch();
          }}
          disabled={isLoading && !isConnected}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
        </div>
      </div>

      {/* Notification display */}
      {notification && (
        <Card
          className={
            notification.type === 'success'
              ? 'border-green-500 bg-green-50 dark:bg-green-950'
              : 'border-red-500 bg-red-50 dark:bg-red-950'
          }
        >
          <CardContent className="flex items-center gap-2 pt-4 text-sm">
            {notification.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span
              className={
                notification.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              {notification.message}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Error display */}
      {error && !notification && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4 text-sm text-red-600 dark:text-red-400">
            Failed to load treasury data: {error}
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!isConnected ? (
                '—'
              ) : gateway.isLoading && walletBalances.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatCurrency(gateway.totalUsd + walletBalances.totalUsdc + walletBalances.totalEthValue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Gateway + wallet across all chains' : 'Connect wallet for live balance'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatCurrency(treasuryData?.eth_price ?? 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From Uniswap v3 via The Graph
            </p>
          </CardContent>
        </Card>

        <Card
          className={pendingCount > 0 ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}
          onClick={pendingCount > 0 ? () => navigate('/history?filter=pending') : undefined}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Executions
            </CardTitle>
            <Activity className={`h-4 w-4 ${pendingCount > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingCount > 0 ? 'text-orange-600' : ''}`}>
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card
          className={alertCount > 0 ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}
          onClick={alertCount > 0 ? () => navigate('/history') : undefined}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${alertCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${alertCount > 0 ? 'text-red-600' : ''}`}>
              {alertCount}
            </div>
            <p className="text-xs text-muted-foreground">Unacknowledged</p>
          </CardContent>
        </Card>
      </div>

      {/* Treasury breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Treasury Breakdown</CardTitle>
            <CardDescription>Gateway (unified) + wallet balances per chain</CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Connect your wallet to view treasury breakdown
              </div>
            ) : gateway.isLoading && walletBalances.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Gateway USDC — unified, chain-abstracted */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Circle Gateway</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(gateway.totalUsd)}
                    </span>
                  </div>
                  <p className="pl-3 text-xs text-muted-foreground">
                    Unified USDC — spendable on any chain
                  </p>
                </div>

                <hr className="border-border" />

                {/* Per-chain wallet balances */}
                {(['Arbitrum', 'Base', 'Ethereum'] as const).map((chainName) => {
                  const walletChain = walletBalances.chains.find((c) => c.chain === chainName);
                  const walletUsdc = walletChain?.usdcBalance ?? 0;
                  const walletEth = walletChain?.ethBalance ?? 0;
                  const ethPrice = treasuryData?.eth_price ?? 0;

                  return (
                    <div key={chainName}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{chainName}</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(walletUsdc + walletEth * ethPrice)}
                        </span>
                      </div>
                      <div className="space-y-0.5 pl-3 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>USDC</span>
                          <span>{formatCurrency(walletUsdc)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ETH</span>
                          <span>{walletEth.toFixed(6)} ({formatCurrency(walletEth * ethPrice)})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
            <CardDescription>Common treasury operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="default"
              onClick={() => setDepositModalOpen(true)}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit USDC
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setSwapModalOpen(true)}
              disabled={!n8nReady}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Request Swap
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleTriggerDailyReport}
              disabled={!n8nReady || actionLoading === 'daily-report'}
            >
              {actionLoading === 'daily-report' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Trigger Daily Report
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={handleCheckPrices}
              disabled={!n8nReady || isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="mr-2 h-4 w-4" />
              )}
              Check Current Prices
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/history')}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              View Pending Confirmations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
      <SwapModal open={swapModalOpen} onOpenChange={setSwapModalOpen} />
    </div>
  );
}
