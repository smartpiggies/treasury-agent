# Treasury Agent - Claude Code Context

## Project Overview

**Treasury Agent** is a Discord-native AI that manages crypto for families, teams, and small organizations through conversation. Built for EthGlobal HackMoney 2026.

**Core Idea**: "Just chat. The agent handles the complexity."

```
Mom: "@TreasuryAgent what's our balance?"
Agent: "You have $12,340 total - $8,200 in stablecoins and $4,140 in ETH"

Dad: "@TreasuryAgent send $100 to alex.eth"
Agent: "Got it! Resolved alex.eth → 0x742d... Sending now."
```

## Target Bounties (Top 3)

| Partner | Prize | Amount | Integration |
|---------|-------|--------|-------------|
| **Circle/Arc** | Chain Abstracted USDC Apps | $5,000 | Gateway for unified USDC balance + instant transfers |
| **Uniswap** | v4 Agentic Finance | $5,000 | Direct same-chain swaps + price data via subgraph |
| **LI.FI** | Best AI × LI.FI Smart App | $2,000 | Cross-chain swap execution |

**Total Target: $12,000**

## Architecture

```
Hostinger VPS
├── n8n (self-hosted) - https://n8n.smartpiggies.cloud
├── Appwrite - https://aw.smartpiggies.cloud
│   ├── Auth + Database
│   └── Dashboard hosting (Sites)
└── Dashboard - https://treasury-agent.sites.smartpiggies.cloud

External Services
├── Circle Gateway - Chain-abstracted USDC, instant cross-chain (<500ms)
├── Uniswap v4 - Same-chain swaps (fastest, cheapest)
├── LI.FI - Cross-chain swaps with token conversion
├── ENS - Human-readable addresses (vitalik.eth → 0x...)
└── Discord - Notifications + human-in-the-loop confirmations
```

## Smart Routing Logic

The agent automatically picks the best execution path:

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION ROUTING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER REQUEST: "Swap ETH to USDC" or "Send to alex.eth"         │
│                                                                 │
│              ┌────────────────────────────────┐                 │
│              │         ROUTING LOGIC          │                 │
│              └────────────────────────────────┘                 │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                   │
│         ▼                 ▼                 ▼                   │
│   Same Chain?       Cross Chain?      USDC Only?                │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│    ┌────────┐        ┌────────┐        ┌────────┐               │
│    │UNISWAP │        │ LI.FI  │        │ CIRCLE │               │
│    │  v4    │        │        │        │GATEWAY │               │
│    └────────┘        └────────┘        └────────┘               │
│    Fastest,          Best bridge,      Instant,                 │
│    cheapest          auto-routing      <500ms                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Decision Logic:**
- Same chain swap → **Uniswap v4** (fastest, cheapest, direct)
- Cross chain swap → **LI.FI** (finds best bridge + route)
- USDC between chains → **Circle Gateway** (instant, <500ms)

## Key Features

### 1. ENS Name Resolution
Send to human-readable addresses: `"Send $100 to dad.eth"`

### 2. Chain-Abstracted Balance
Circle Gateway provides unified USDC view across Ethereum, Arbitrum, Base.

### 3. Price Monitoring
ETH price from Uniswap v3 subgraph via The Graph (decentralized network).

### 4. N-of-M Approvals
Family consensus for large transactions via Discord reactions.

### 5. Deposit USDC (NEW)
Two ways to deposit USDC to Circle Gateway:
- **Dashboard**: Connect wallet with RainbowKit, approve + deposit
- **Discord**: `@TreasuryAgent deposit $100` (mock mode or treasury wallet)

## Monorepo Structure

```
treasury-agent/
├── n8n/           # Workflow JSON exports and n8n documentation
├── dashboard/     # React + Vite + Tailwind dashboard
├── scripts/       # Setup and utility scripts
├── functions/     # Appwrite serverless functions (if needed)
├── docs/          # Detailed documentation and proposals
└── .env.example   # Environment variables template
```

## n8n Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Daily Report** | 9 AM daily | Circle balance + ETH price → Discord |
| **Price Monitor** | Every 5 min | ETH price alerts when thresholds crossed |
| **Swap Executor** | Webhook | Validate → Route → Execute → Report |
| **Discord Handler** | Webhook | Parse intents: balance, price, swap, deposit, help |
| **Weekly Summary** | Monday 8 AM | Aggregate stats → Discord |
| **Error Handler** | Error trigger | Catch failures → Discord alert |

## Current Integration Status

| Service | Status | Notes |
|---------|--------|-------|
| Circle Gateway | ✅ Working | API format fixed, deposits via dashboard |
| Uniswap | ⚠️ In Progress | Price data working, adding direct swaps |
| LI.FI | ✅ Working | Cross-chain quotes + execution |
| ENS | ✅ Working | Resolves .eth names via The Graph |
| Appwrite | ✅ Working | All 4 collections tested |
| Discord | ✅ Working | Both webhooks + command handler |
| Dashboard | ✅ Working | Wallet connect + deposit flow |
| n8n | ✅ Running | https://n8n.smartpiggies.cloud |

## Key Commands

```bash
# Dashboard
npm run dashboard:dev      # Start dev server
npm run dashboard:build    # Build for production

# Workflows
npm run workflows:export   # Export from n8n UI
npm run workflows:import   # Import to n8n

# Tests
npm run test:all           # Run all integration tests
```

## Environment Variables

See `.env.example` for full list. Key groups:
- `CIRCLE_*` - Gateway API (no auth header needed)
- `GRAPH_API_KEY` - The Graph decentralized network
- `LIFI_INTEGRATOR_ID` - LI.FI integration
- `DISCORD_WEBHOOK_*` - Reports and alerts
- `APPWRITE_*` - Database connection
- `TREASURY_*` - Wallet address and private key

## Live URLs

- **n8n**: https://n8n.smartpiggies.cloud
- **Appwrite Console**: https://aw.smartpiggies.cloud/console
- **Dashboard**: https://treasury-agent.sites.smartpiggies.cloud

## Data Storage

**Appwrite Database** (ID: `treasury`):
- `price_history` - Price snapshots from monitoring
- `executions` - Swap/transfer records with ENS info
- `alerts` - Alert history
- `balances` - Treasury balance snapshots

## Files to Never Commit

- `.env` files (use `.env.example`)
- `*credentials*.json`
- `*.pem`, `*.key`
- `.n8n/` (contains credentials)
