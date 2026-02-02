import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isAppwriteConfigured } from '@/lib/appwrite';
import { isN8nConfigured } from '@/lib/api';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

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

export function Settings() {
  const appwriteConfigured = isAppwriteConfigured();
  const n8nConfigured = isN8nConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configuration and connection status
        </p>
      </div>

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
              <p className="font-mono text-sm">
                {import.meta.env.VITE_APPWRITE_ENDPOINT || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Appwrite Project
              </p>
              <p className="font-mono text-sm">
                {import.meta.env.VITE_APPWRITE_PROJECT_ID || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                n8n Webhook Base
              </p>
              <p className="font-mono text-sm">
                {import.meta.env.VITE_N8N_WEBHOOK_BASE || 'Not set'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
          <CardDescription>
            Configure price monitoring thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                ETH High Alert (USD)
              </label>
              <input
                type="number"
                defaultValue={3500}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">ETH Low Alert (USD)</label>
              <input
                type="number"
                defaultValue={2800}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                disabled
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Threshold configuration is managed in n8n workflow environment
            variables.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>External resources and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://circle.com/developer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Circle Docs
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
            <Button variant="outline" className="justify-start" asChild>
              <a
                href="https://docs.uniswap.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Uniswap Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
