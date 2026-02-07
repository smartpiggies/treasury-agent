# Treasury Ops Dashboard

React dashboard for Treasury Ops Bot — analytics, controls, and monitoring.

## Features

- **Treasury Overview**: Unified balance view across all chains
- **Analytics**: Charts for price history, volume, performance
- **Workflow Controls**: Trigger swaps and rebalancing
- **On-Chain Swaps**: Wallet-connected users can execute swaps directly — auto-routed to Uniswap (same-chain), LI.FI (cross-chain), or Circle Gateway (USDC transfers)
- **Execution History**: View past transactions and their status
- **Real-time Alerts**: Live feed of price alerts and notifications
- **Authentication**: Appwrite-powered login

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Auth**: Appwrite SDK
- **State**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Appwrite instance with project configured

### Installation

```bash
cd dashboard
pnpm install
```

### Environment Variables

Create `.env.local`:

```bash
VITE_APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
VITE_APPWRITE_PROJECT_ID=treasury-ops
VITE_APPWRITE_DATABASE_ID=treasury
VITE_N8N_WEBHOOK_BASE=https://your-n8n.hostinger.com/webhook
VITE_WALLETCONNECT_PROJECT_ID=<from cloud.walletconnect.com>
VITE_LIFI_INTEGRATOR_ID=treasury-ops-bot  # optional, has default
```

### Development

```bash
pnpm dev
```

Opens at http://localhost:5173

### Build

```bash
pnpm build
```

Output in `dist/` — deploy to Appwrite hosting.

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Header, Sidebar, etc.
│   │   ├── dashboard/        # Dashboard-specific components
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   ├── AlertFeed.tsx
│   │   │   └── ExecutionHistory.tsx
│   │   ├── controls/         # Workflow trigger components
│   │   │   ├── SwapForm.tsx
│   │   │   └── RebalanceButton.tsx
│   │   ├── swap/
│   │   │   └── SwapModal.tsx        # Smart-routed swap modal
│   │   └── wallet/
│   │       └── ConnectButton.tsx     # RainbowKit wallet connect
│   │
│   ├── lib/
│   │   ├── appwrite.ts       # Appwrite client setup
│   │   ├── api.ts            # n8n webhook calls
│   │   ├── contracts.ts      # Contract addresses and ABIs
│   │   ├── lifi.ts           # LI.FI quote API helpers
│   │   ├── wagmi.ts          # Wagmi/RainbowKit config
│   │   └── utils.ts          # Helpers
│   │
│   ├── hooks/
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useBalance.ts     # Treasury balance data
│   │   ├── useGatewaySwap.ts # Circle Gateway + Uniswap swap hook
│   │   ├── useLIFISwap.ts    # LI.FI cross-chain swap hook
│   │   └── usePriceHistory.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard view
│   │   ├── Analytics.tsx     # Detailed charts
│   │   ├── History.tsx       # Execution history
│   │   └── Settings.tsx      # Configuration
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Pages

### Dashboard (Home)

Main overview with:
- Total treasury value (unified across chains)
- Chain-by-chain breakdown
- Current prices (ETH, BTC, etc.)
- Recent alerts
- Quick action buttons

### Analytics

Detailed charts:
- Price history (7d, 30d, 90d)
- Portfolio composition over time
- Swap volume
- Alert frequency

### History

Execution log:
- All swap/rebalance transactions
- Status (pending, confirmed, failed)
- Transaction hashes with explorer links
- Filters by date, type, status

### Settings

Configuration:
- Alert thresholds
- Notification preferences
- Connected accounts
- API status

## API Integration

### Fetching Balances

The dashboard fetches data from Appwrite (populated by n8n) or directly from n8n webhooks:

```typescript
// Trigger balance refresh via n8n
const refreshBalance = async () => {
  const response = await fetch(`${N8N_WEBHOOK_BASE}/get-balance`, {
    method: 'POST',
  });
  return response.json();
};
```

### Swap Routing

The SwapModal automatically selects the best execution path based on chain/token selections:

| Condition | Route | Execution |
|-----------|-------|-----------|
| Same chain, USDC source | Gateway + Uniswap | On-chain via wallet |
| Cross chain, USDC→USDC | Circle Gateway | On-chain via wallet |
| Cross chain, token swap | LI.FI | On-chain via wallet |
| Wallet not connected | n8n webhook | Server-side via n8n |

When a wallet is connected, swaps execute directly on-chain using `useGatewaySwap` or `useLIFISwap` hooks. Without a wallet, requests fall back to the n8n `/swap-executor` webhook.

### Triggering Workflows

```typescript
// Request a swap (goes to Discord for confirmation)
const requestSwap = async (params: SwapRequest) => {
  const response = await fetch(`${N8N_WEBHOOK_BASE}/swap-executor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};
```

## Deployment

### Appwrite Hosting

1. Build the project: `pnpm build`
2. In Appwrite Console, go to **Hosting**
3. Create new site, upload `dist/` folder
4. Configure domain (optional)

### Alternative: Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
```

## Design

The dashboard follows a clean, professional design with:
- Dark mode support
- Responsive layout (mobile-friendly)
- Consistent color scheme matching shadcn/ui defaults
- Clear data visualization with proper labeling

See Figma/design mockups in `docs/` (if available).
