import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Placeholder chart data
const priceData = [
  { date: '01/25', price: 3100 },
  { date: '01/26', price: 3150 },
  { date: '01/27', price: 3080 },
  { date: '01/28', price: 3200 },
  { date: '01/29', price: 3180 },
  { date: '01/30', price: 3250 },
  { date: '01/31', price: 3220 },
];

const volumeData = [
  { date: '01/25', volume: 12500 },
  { date: '01/26', volume: 8000 },
  { date: '01/27', volume: 15000 },
  { date: '01/28', volume: 5000 },
  { date: '01/29', volume: 22000 },
  { date: '01/30', volume: 18000 },
  { date: '01/31', volume: 9500 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Price trends and execution analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            7D
          </Button>
          <Button variant="outline" size="sm">
            30D
          </Button>
          <Button variant="outline" size="sm">
            90D
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ETH/USD Price</CardTitle>
            <CardDescription>7-day price history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Swap Volume</CardTitle>
            <CardDescription>7-day execution volume (USD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
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
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>Performance metrics for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price High</p>
              <p className="text-2xl font-bold">$3,280</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price Low</p>
              <p className="text-2xl font-bold">$3,050</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">$90,000</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Executions</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
