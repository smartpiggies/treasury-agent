import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { isAppwriteConfigured } from '@/lib/appwrite';
import { isN8nConfigured } from '@/lib/api';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

// Placeholder data for UI development
const mockData = {
  totalBalance: 125000,
  change24h: 2.5,
  ethPrice: 3250.42,
  ethChange: -1.2,
  pendingExecutions: 2,
  activeAlerts: 1,
  chains: [
    { chain: 'Ethereum', balance: 50000, percent: 40 },
    { chain: 'Arbitrum', balance: 35000, percent: 28 },
    { chain: 'Base', balance: 25000, percent: 20 },
    { chain: 'Polygon', balance: 15000, percent: 12 },
  ],
};

export function Dashboard() {
  const appwriteReady = isAppwriteConfigured();
  const n8nReady = isN8nConfigured();

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
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockData.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  mockData.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {formatPercent(mockData.change24h)}
              </span>{' '}
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
            {mockData.ethChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockData.ethPrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  mockData.ethChange >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {formatPercent(mockData.ethChange)}
              </span>{' '}
              24h change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Executions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.pendingExecutions}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Unacknowledged</p>
          </CardContent>
        </Card>
      </div>

      {/* Chain breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Balance by Chain</CardTitle>
            <CardDescription>USDC distribution across chains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.chains.map((chain) => (
                <div key={chain.chain} className="flex items-center">
                  <div className="w-24 text-sm font-medium">{chain.chain}</div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${chain.percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm">
                    {formatCurrency(chain.balance)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common treasury operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Request Swap
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Trigger Daily Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Check Current Prices
            </Button>
            <Button className="w-full justify-start" variant="outline">
              View Pending Confirmations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
