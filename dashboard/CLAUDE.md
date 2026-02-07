# Dashboard - Claude Code Context

## Overview

React dashboard for Treasury Ops Bot. Displays treasury analytics, triggers workflows, and shows execution history.

## Tech Stack

- **React 18** + TypeScript
- **Vite** for build/dev
- **Tailwind CSS** + **shadcn/ui** for styling
- **TanStack Query** for server state
- **Appwrite SDK** for auth and database
- **Recharts** for visualizations

## Development

```bash
cd dashboard
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # Output to dist/
pnpm lint         # ESLint check
```

## Environment Variables

Create `.env.local` in this directory:

```bash
VITE_APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
VITE_APPWRITE_PROJECT_ID=treasury-ops
VITE_APPWRITE_DATABASE_ID=treasury
VITE_N8N_WEBHOOK_BASE=https://your-n8n.hostinger.com/webhook
```

## Appwrite Collections

The dashboard reads/writes to these Appwrite collections:

### `price_history`
```typescript
{
  $id: string;
  timestamp: string;      // ISO date
  token: string;          // "ETH", "BTC", etc.
  price_usd: number;
  source: string;         // "uniswap", "coingecko"
}
```

### `executions`
```typescript
{
  $id: string;
  timestamp: string;
  type: "swap" | "rebalance" | "transfer";
  source_chain: string;
  dest_chain: string;
  source_token: string;
  dest_token: string;
  amount: string;
  status: "pending" | "confirmed" | "failed";
  tx_hash?: string;
  error?: string;
}
```

### `alerts`
```typescript
{
  $id: string;
  timestamp: string;
  type: "price_high" | "price_low" | "execution_failed";
  message: string;
  acknowledged: boolean;
}
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, etc.)
│   ├── layout/          # Header, Sidebar, PageWrapper
│   ├── dashboard/       # BalanceCard, PriceChart, AlertFeed
│   └── controls/        # SwapForm, RebalanceButton
├── lib/
│   ├── appwrite.ts      # Appwrite client singleton
│   ├── api.ts           # n8n webhook helpers
│   └── utils.ts         # cn(), formatters
├── hooks/
│   ├── useAuth.ts       # Appwrite auth state
│   ├── useBalance.ts    # Fetch treasury balance
│   └── usePriceHistory.ts
├── pages/
│   ├── Homepage.tsx          # Landing page (hero, how-it-works, features, partner integrations, CTA)
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   ├── History.tsx
│   └── Settings.tsx
├── App.tsx              # Router setup
└── main.tsx             # Entry point
```

## Code Patterns

### Appwrite Client Setup
```typescript
// lib/appwrite.ts
import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
```

### Data Fetching with TanStack Query
```typescript
// hooks/usePriceHistory.ts
import { useQuery } from '@tanstack/react-query';
import { databases } from '@/lib/appwrite';

export function usePriceHistory(token: string, days = 7) {
  return useQuery({
    queryKey: ['priceHistory', token, days],
    queryFn: async () => {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'price_history',
        [
          Query.equal('token', token),
          Query.greaterThan('timestamp', daysAgo(days)),
          Query.orderDesc('timestamp'),
        ]
      );
      return response.documents;
    },
  });
}
```

### Triggering n8n Workflows
```typescript
// lib/api.ts
const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_BASE;

export async function requestSwap(params: SwapRequest) {
  const res = await fetch(`${N8N_BASE}/swap-executor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Swap request failed');
  return res.json();
}
```

## Styling Conventions

- Use `cn()` utility for conditional classes
- Follow shadcn/ui patterns for new components
- Dark mode: use Tailwind's `dark:` variants
- Spacing: prefer Tailwind's spacing scale (4, 8, 12, 16...)

## Deployment

Build outputs to `dist/`. Deploy options:
1. **Appwrite Hosting** (recommended for hackathon)
2. Docker with nginx
3. Any static hosting (Vercel, Netlify)
