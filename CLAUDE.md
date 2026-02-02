# Treasury Ops Bot - Claude Code Context

## Project Overview

This is a **hackathon POC** for an autonomous DeFi treasury management agent. The goal is to learn n8n, Circle Arc, Uniswap, and LI.FI integrations while building a functional proof-of-concept that can later become production-ready.

## Architecture

```
Hostinger VPS
├── n8n (self-hosted) - Workflow orchestration
├── Appwrite - Auth + Database + Dashboard hosting
└── MCP Server (if needed)

External Services
├── Circle Arc - Chain-abstracted USDC, cross-chain transfers
├── Uniswap v3 - Same-chain swaps, price data via subgraph
├── LI.FI - Cross-chain swaps, multi-step DeFi via Composer
└── Discord - Notifications + human-in-the-loop confirmations
```

## Monorepo Structure

```
treasury-agent/
├── dashboard/              # React + Vite + Tailwind dashboard
│   ├── src/
│   │   ├── components/     # UI components (Button, Card, Layout)
│   │   ├── pages/          # Dashboard, Analytics, History, Settings
│   │   ├── lib/            # Appwrite client, API helpers, utils
│   │   └── types/          # TypeScript interfaces
│   └── package.json
├── n8n/
│   ├── workflows/          # Importable workflow JSON files
│   │   ├── daily-report.json
│   │   ├── price-monitor.json
│   │   ├── swap-executor.json
│   │   └── weekly-summary.json
│   ├── CLAUDE.md
│   └── README.md
├── docs/
│   ├── proposal.md                 # Hackathon proposal
│   ├── threshold-approval-flow.md  # Approval logic decisions
│   ├── appwrite-schema.json        # Database schema definition
│   ├── appwrite-setup.md           # Collection setup guide
│   └── setup-guide.md              # Credentials & configuration
├── functions/              # Appwrite serverless functions (if needed)
├── docker-compose.yml      # Local n8n development
├── .env.example            # Environment variables template
└── CLAUDE.md               # This file
```

## Key Commands

```bash
# Dashboard development
cd dashboard
pnpm install
pnpm dev              # http://localhost:5173
pnpm build            # Output to dist/

# Local n8n (requires Docker)
docker-compose up -d  # Start n8n at http://localhost:5678

# From root
pnpm dashboard:dev    # Shortcut for dashboard dev
```

## Data Storage

**Primary**: Appwrite Database (hosted on Hostinger)

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `price_history` | Price snapshots from monitoring | timestamp, token, price_usd, source |
| `executions` | Swap/rebalance transaction records | type, status, tx_hash, amount, chains |
| `alerts` | Alert history and acknowledgments | type, severity, message, acknowledged |
| `balances` | Treasury balance snapshots | chain, token, balance, balance_usd |

See `docs/appwrite-schema.json` for full schema with indexes.

**No Google Sheets** - All data persisted in Appwrite for easier querying and export.

## Wallet Strategy

**POC uses EOA** for simplicity:
- Single testnet private key in environment
- Signing handled in n8n via ethers.js code nodes
- Future: migrate to Safe multisig for production

## Key Integration Patterns

### Circle Arc
- Use for unified USDC balance queries across chains
- Cross-chain USDC transfers (<500ms)
- API: REST with Bearer token auth

### Uniswap v4
- Same-chain swaps only
- Price data via The Graph subgraph
- Direct contract interaction for swaps

### LI.FI
- Cross-chain swaps
- Multi-step DeFi operations via Composer
- Automatic route optimization

## Discord Setup

**Webhooks** (simple, for POC):
- `DISCORD_WEBHOOK_REPORTS` - Daily/weekly reports
- `DISCORD_WEBHOOK_ALERTS` - Price alerts

**Bot** (optional, for interactive confirmations):
- Only needed if using button-based swap confirmations
- Requires: `applications.commands` scope

## Environment Variables

See `.env.example` for full list. Key groups:
- Circle API credentials
- LI.FI integrator ID
- Appwrite connection details
- Discord webhooks
- RPC endpoints per chain
- Testnet wallet (EOA)

## Testnets

For hackathon demo, focus on:
- Sepolia (Ethereum testnet)
- Base Sepolia
- Arbitrum Sepolia

Use testnet USDC from Circle faucet.

## Implemented Workflows

| Workflow | File | Trigger | What It Does |
|----------|------|---------|--------------|
| Daily Report | `daily-report.json` | Cron 9 AM | Circle balance + Uniswap price → Discord |
| Price Monitor | `price-monitor.json` | Every 5 min | Check thresholds → alert + save to Appwrite |
| Swap Executor | `swap-executor.json` | Webhook | Create pending swap → confirm via `/swap-confirm` |
| Weekly Summary | `weekly-summary.json` | Monday 8 AM | Aggregate stats → Discord summary |

## Dashboard Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Balance overview, chain breakdown, quick actions |
| Analytics | `/analytics` | Price charts, volume charts, weekly stats |
| History | `/history` | Execution log with status badges, tx links |
| Settings | `/settings` | Connection status, config display, quick links |

## Code Patterns

- **n8n**: Use environment variables via `{{$env.VAR_NAME}}`
- **Dashboard**: TanStack Query for data fetching, Appwrite SDK for auth
- **Styling**: Tailwind + shadcn/ui components
- **Types**: Shared interfaces in `dashboard/src/types/index.ts`

## Files to Never Commit

The `.gitignore` protects these, but be aware:
- `.env` files (use `.env.example` as template)
- `*credentials*.json`
- `*.pem`, `*.key`
- `.n8n/` (contains credentials)

## Getting Started

See `docs/setup-guide.md` for complete setup instructions including:
- Required API keys and where to get them
- Appwrite database setup
- n8n workflow import
- Dashboard configuration
