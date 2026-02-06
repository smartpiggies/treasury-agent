import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  isAppwriteConfigured,
  databases,
  DATABASE_ID,
  COLLECTIONS,
  Query,
} from '@/lib/appwrite';
import { isN8nConfigured } from '@/lib/api';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
  Bell,
  BellOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';

interface Alert {
  $id: string;
  $createdAt: string;
  timestamp: string;
  type: string;
  severity: string;
  message: string;
  token?: string;
  threshold?: number;
  actual_value?: number;
  acknowledged: boolean;
}

function StatusIndicator({ configured }: { configured: boolean }) {
  return configured ? (
    <span className="flex items-center gap-1 text-green-600">
      <CheckCircle className="h-4 w-4" />
      Connected
    </span>
  ) : (
    <span className="flex items-center gap-1 text-red-600">
      <XCircle className="h-4 w-4" />
      Not configured
    </span>
  );
}

function AlertIcon({ type }: { type: string }) {
  switch (type) {
    case 'price_high':
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    case 'price_low':
      return <TrendingDown className="h-4 w-4 text-blue-500" />;
    case 'execution_failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    critical: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[severity as keyof typeof colors] || colors.info}`}
    >
      {severity}
    </span>
  );
}

export function Settings() {
  const appwriteConfigured = isAppwriteConfigured();
  const n8nConfigured = isN8nConfigured();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!appwriteConfigured) return;

    setIsLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ALERTS,
        [
          Query.equal('acknowledged', false),
          Query.orderDesc('timestamp'),
          Query.limit(50),
        ]
      );
      setAlerts(response.documents as unknown as Alert[]);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [appwriteConfigured]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const acknowledgeAlert = async (alertId: string) => {
    setAcknowledging(alertId);
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ALERTS, alertId, {
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      });
      // Remove from local state
      setAlerts((prev) => prev.filter((a) => a.$id !== alertId));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setAcknowledging(null);
    }
  };

  const acknowledgeAll = async () => {
    setAcknowledging('all');
    try {
      await Promise.all(
        alerts.map((alert) =>
          databases.updateDocument(DATABASE_ID, COLLECTIONS.ALERTS, alert.$id, {
            acknowledged: true,
            acknowledged_at: new Date().toISOString(),
          })
        )
      );
      setAlerts([]);
    } catch (err) {
      console.error('Failed to acknowledge all alerts:', err);
    } finally {
      setAcknowledging(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configuration, alerts, and connection status
        </p>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Unacknowledged alerts from price monitoring and executions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={acknowledgeAll}
                disabled={acknowledging === 'all'}
              >
                {acknowledging === 'all' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4" />
                )}
                Dismiss All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAlerts}
              disabled={isLoading || !appwriteConfigured}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!appwriteConfigured ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <AlertTriangle className="h-4 w-4" />
              Configure Appwrite to view alerts
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
              <p className="font-medium">No active alerts</p>
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.$id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <AlertIcon type={alert.type} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{alert.message}</span>
                        <SeverityBadge severity={alert.severity} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                        {alert.token && <span className="mx-1">•</span>}
                        {alert.token}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.$id)}
                    disabled={acknowledging === alert.$id}
                  >
                    {acknowledging === alert.$id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Service connectivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Appwrite</p>
                <p className="text-sm text-muted-foreground">
                  Database and authentication
                </p>
              </div>
              <StatusIndicator configured={appwriteConfigured} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">n8n</p>
                <p className="text-sm text-muted-foreground">
                  Workflow automation
                </p>
              </div>
              <StatusIndicator configured={n8nConfigured} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Current configuration values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Appwrite Endpoint
              </p>
              <p className="font-mono text-sm truncate">
                {import.meta.env.VITE_APPWRITE_ENDPOINT || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                n8n Webhook Base
              </p>
              <p className="font-mono text-sm truncate">
                {import.meta.env.VITE_N8N_WEBHOOK_BASE || 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Configuration</CardTitle>
          <CardDescription>
            Price monitoring thresholds (configured in n8n)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="font-medium">ETH High Alert</span>
              </div>
              <p className="text-2xl font-bold">$4,000</p>
              <p className="text-sm text-muted-foreground">
                Alert when ETH exceeds this price
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-blue-500" />
                <span className="font-medium">ETH Low Alert</span>
              </div>
              <p className="text-2xl font-bold">$2,500</p>
              <p className="text-sm text-muted-foreground">
                Alert when ETH drops below this price
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            To modify thresholds, update PRICE_ALERT_HIGH and PRICE_ALERT_LOW in the n8n environment.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Admin consoles and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://n8n.smartpiggies.cloud"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                n8n Console
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://aw.smartpiggies.cloud/console"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Appwrite Console
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://developers.circle.com/w3s/cross-chain-transfer-protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Circle Gateway
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://docs.li.fi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                LI.FI Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
