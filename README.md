# Treasury Agent

> Autonomous DeFi treasury agent powered by n8n, Circle Gateway & LI.FI

**EthGlobal HackMoney 2026**

**Live Demo:** https://hackmoney2026.smartpiggies.com/

Treasury Ops Bot is an autonomous treasury management agent built on n8n workflow automation. It implements a classic agent loop—Monitor, Decide, Execute, Report—to automate the operational burden of multi-chain DeFi treasury management. The bot monitors positions via Uniswap v4 subgraph data, tracks unified USDC balances across 11 chains using Circle Gateway (<500ms cross-chain transfers), and executes swaps and rebalancing operations through a dual-path architecture: Uniswap for same-chain swaps, LI.FI for cross-chain operations and multi-step DeFi via Composer. Automated reports and alerts are delivered to Discord/Slack, with all activity logged for audit.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TREASURY OPS BOT                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │    n8n      │    │  Dashboard  │    │      Discord        │ │
│  │  Workflows  │◄──►│   (React)   │    │   Confirmations     │ │
│  │             │    │             │    │                     │ │
│  │ • Monitor   │    │ • Analytics │    │ • Tx approval flow  │ │
│  │ • Decide    │    │ • Controls  │    │ • Alerts            │ │
│  │ • Execute   │    │ • Reports   │    │ • Reports           │ │
│  │ • Report    │    │             │    │                     │ │
│  └──────┬──────┘    └──────┬──────┘    └─────────────────────┘ │
│         │                  │                                    │
│         ▼                  ▼                                    │
│  ┌─────────────────────────────────────┐                        │
│  │            Data Layer               │                        │
│  │  • Appwrite (auth + database)       │                        │
│  │    - price_history collection       │                        │
│  │    - executions collection          │                        │
│  │    - alerts collection              │                        │
│  │    - balances collection            │                        │
│  └─────────────────────────────────────┘                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    External APIs                             ││
│  │  • Circle Gateway (chain-abstracted USDC)                    ││
│  │  • LI.FI (cross-chain swaps, Composer)                       ││
│  │  • Uniswap v4 (same-chain swaps, price data)                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Repository Structure

```
treasury-agent/
├── docs/
│   ├── proposal.md           # Full hackathon proposal
│   └── appwrite-setup.md     # Database setup documentation
│
├── n8n/
│   ├── workflows/            # Exported n8n workflow JSON files
│   └── README.md             # n8n setup and import instructions
│
├── dashboard/                # React dashboard app
│   ├── src/
│   └── README.md
│
├── scripts/
│   ├── setup-appwrite-db.sh  # Database setup script
│   ├── test-discord.js       # Discord webhook test
│   ├── test-appwrite.js      # Appwrite CRUD test
│   ├── test-rpc.js           # RPC endpoint test
│   └── test-lifi.js          # LI.FI API test
│
├── functions/                # Appwrite serverless functions (if needed)
│
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| **Daily Report** | Cron (9am) | Aggregates balances, prices, generates report to Discord |
| **Price Monitor** | Interval (5min) | Watches thresholds, alerts on significant moves |
| **Swap Executor** | Webhook + Discord | Executes swaps with human confirmation via Discord |
| **Get Balance** | Webhook | Returns Circle Gateway balance + ETH price for dashboard |
| **Weekly Summary** | Cron (Monday 8am) | Performance analytics and trend summary |
| **Error Handler** | Error trigger | Catches workflow errors, sends alerts to Discord |

## Tech Stack

- **Orchestration**: n8n (self-hosted on Hostinger)
- **Dashboard**: React + Vite + Tailwind + shadcn/ui + RainbowKit
- **Auth & Data**: Appwrite (self-hosted on Hostinger)
- **Notifications**: Discord webhooks
- **Hosting**: Hostinger VPS (n8n, Appwrite, dashboard)

## Dashboard Features

| Feature | Description |
|---------|-------------|
| **Live Balance** | Real-time USDC balance from Circle Gateway across Ethereum, Arbitrum, Base |
| **ETH Price** | Live price from Uniswap v3 via The Graph |
| **Deposit USDC** | Connect wallet with RainbowKit, deposit to Circle Gateway |
| **Request Swap** | Submit swap requests to n8n for execution |
| **Execution History** | View past transactions with status filters |
| **Analytics** | Price charts and volume trends with 7D/30D/90D views |
| **Alert Management** | View and dismiss price/execution alerts |
| **Daily Report** | Trigger on-demand treasury reports to Discord |

## Partner Integrations

| Partner | Integration | Prize Target |
|---------|-------------|--------------|
| **Circle** | Gateway API for unified USDC balance | Chain Abstracted USDC Apps, Treasury Systems |
| **LI.FI** | Cross-chain swaps + Composer | AI × LI.FI Smart App |
| **Uniswap** | v4 subgraph + direct swaps | Agentic Finance |

## Live URLs

| Service | URL |
|---------|-----|
| **Dashboard** | https://hackmoney2026.smartpiggies.com/ |
| **n8n** | https://n8n.smartpiggies.cloud |
| **Appwrite** | https://aw.smartpiggies.cloud |

## Quick Start

### Prerequisites

- Hostinger VPS with Docker
- n8n instance running
- Appwrite instance running
- Discord server with webhook
- API keys: Circle, LI.FI (optional), WalletConnect Project ID

### Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in credentials
3. Install dependencies: `npm install`
4. Verify integrations: `npm run test:all`
5. Set up Appwrite database: `bash scripts/setup-appwrite-db.sh`
6. Import n8n workflows from `n8n/workflows/`
7. Deploy dashboard to Appwrite Sites
8. Configure Discord webhooks

See:
- [docs/appwrite-setup.md](docs/appwrite-setup.md) - Database setup
- [docs/proposal.md](docs/proposal.md) - Full architecture proposal
- [docs/n8n-integration-guide.md](docs/n8n-integration-guide.md) - Workflow configuration
- [docs/dashboard-improvements-session.md](docs/dashboard-improvements-session.md) - Recent dashboard updates

## Team

Built for EthGlobal HackMoney 2026.

## License

MIT
