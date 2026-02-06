import { useState, useEffect, useCallback, useMemo } from 'react';
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
  databases,
  DATABASE_ID,
  COLLECTIONS,
  Query,
  isAppwriteConfigured,
} from '@/lib/appwrite';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Loader2,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D';

interface PriceHistory {
  $id: string;
  timestamp: string;
  token: string;
  price_usd: number;
  source: string;
}

interface Execution {
  $id: string;
  timestamp: string;
  amount: string;
  status: string;
  source_token: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
  timestamp: number;
}

interface VolumeDataPoint {
  date: string;
  volume: number;
}

function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

export function Analytics() {
  const appwriteReady = isAppwriteConfigured();
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysMap: Record<TimeRange, number> = {
    '7D': 7,
    '30D': 30,
    '90D': 90,
  };

  const fetchData = useCallback(async () => {
    if (!appwriteReady) return;

    setIsLoading(true);
    setError(null);

    const days = daysMap[timeRange];
    const startDate = getDaysAgo(days);

    try {
      // Fetch price history and executions in parallel
      const [priceResponse, executionResponse] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.PRICE_HISTORY, [
          Query.greaterThan('timestamp', startDate),
          Query.equal('token', 'ETH'),
          Query.orderAsc('timestamp'),
          Query.limit(500),
        ]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.EXECUTIONS, [
          Query.greaterThan('timestamp', startDate),
          Query.equal('status', 'completed'),
          Query.orderAsc('timestamp'),
          Query.limit(500),
        ]),
      ]);

      setPriceHistory(priceResponse.documents as unknown as PriceHistory[]);
      setExecutions(executionResponse.documents as unknown as Execution[]);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [appwriteReady, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Process price data for chart - aggregate by day
  const priceChartData = useMemo((): ChartDataPoint[] => {
    if (priceHistory.length === 0) return [];

    const dailyPrices: Record<string, { prices: number[]; timestamp: number }> = {};

    priceHistory.forEach((item) => {
      const dateKey = formatDateShort(item.timestamp);
      if (!dailyPrices[dateKey]) {
        dailyPrices[dateKey] = { prices: [], timestamp: new Date(item.timestamp).getTime() };
      }
      dailyPrices[dateKey].prices.push(item.price_usd);
    });

    return Object.entries(dailyPrices)
      .map(([date, data]) => ({
        date,
        price: data.prices.reduce((a, b) => a + b, 0) / data.prices.length,
        timestamp: data.timestamp,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [priceHistory]);

  // Process volume data for chart - aggregate by day
  const volumeChartData = useMemo((): VolumeDataPoint[] => {
    if (executions.length === 0) return [];

    const dailyVolume: Record<string, number> = {};

    executions.forEach((exec) => {
      const dateKey = formatDateShort(exec.timestamp);
      const amount = parseFloat(exec.amount) || 0;
      dailyVolume[dateKey] = (dailyVolume[dateKey] || 0) + amount;
    });

    // Sort by date
    const sortedEntries = Object.entries(dailyVolume).sort((a, b) => {
      const [monthA, dayA] = a[0].split('/').map(Number);
      const [monthB, dayB] = b[0].split('/').map(Number);
      return monthA !== monthB ? monthA - monthB : dayA - dayB;
    });

    return sortedEntries.map(([date, volume]) => ({ date, volume }));
  }, [executions]);

  // Compute summary stats
  const summaryStats = useMemo(() => {
    const prices = priceHistory.map((p) => p.price_usd);
    const priceHigh = prices.length > 0 ? Math.max(...prices) : 0;
    const priceLow = prices.length > 0 ? Math.min(...prices) : 0;

    const totalVolume = executions.reduce((sum, exec) => {
      return sum + (parseFloat(exec.amount) || 0);
    }, 0);

    const executionCount = executions.length;

    // Calculate price change
    const currentPrice = prices[prices.length - 1] || 0;
    const startPrice = prices[0] || 0;
    const priceChange = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0;

    return {
      priceHigh,
      priceLow,
      totalVolume,
      executionCount,
      priceChange,
    };
  }, [priceHistory, executions]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Price trends and execution analytics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['7D', '30D', '90D'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
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
          <CardContent className="pt-4 text-sm text-red-600 dark:text-red-400">
            Failed to load analytics: {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ETH/USD Price</CardTitle>
            <CardDescription>
              {timeRange === '7D' ? '7-day' : timeRange === '30D' ? '30-day' : '90-day'} price history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px] md:h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : priceChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No price data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Swap Volume</CardTitle>
            <CardDescription>
              {timeRange === '7D' ? '7-day' : timeRange === '30D' ? '30-day' : '90-day'} execution volume (USD)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px] md:h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : volumeChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No execution data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Period Summary</CardTitle>
          <CardDescription>
            Performance metrics for the past {daysMap[timeRange]} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price High</p>
                <p className="text-2xl font-bold">
                  {summaryStats.priceHigh > 0
                    ? formatCurrency(summaryStats.priceHigh)
                    : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price Low</p>
                <p className="text-2xl font-bold">
                  {summaryStats.priceLow > 0
                    ? formatCurrency(summaryStats.priceLow)
                    : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price Change</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {summaryStats.priceChange !== 0 ? (
                    <>
                      {summaryStats.priceChange > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span
                        className={
                          summaryStats.priceChange > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {summaryStats.priceChange > 0 ? '+' : ''}
                        {summaryStats.priceChange.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">
                  {summaryStats.totalVolume > 0
                    ? formatCurrency(summaryStats.totalVolume)
                    : '—'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Executions</p>
                <p className="text-2xl font-bold">{summaryStats.executionCount}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
