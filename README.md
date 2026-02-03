# Treasury Ops Bot

> Autonomous DeFi treasury agent powered by n8n, Circle Gateway & LI.FI

**EthGlobal HackMoney 2026**

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
│   └── setup-appwrite-db.sh  # Database setup script
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
| **Weekly Summary** | Cron (Monday 8am) | Performance analytics and trend summary |

## Tech Stack

- **Orchestration**: n8n (self-hosted on Hostinger)
- **Dashboard**: React + Vite + Tailwind + shadcn/ui
- **Auth & Data**: Appwrite (self-hosted on Hostinger)
- **Notifications**: Discord webhooks
- **Hosting**: Hostinger VPS (n8n, Appwrite, dashboard)

## Partner Integrations

| Partner | Integration | Prize Target |
|---------|-------------|--------------|
| **Circle** | Gateway API for unified USDC balance | Chain Abstracted USDC Apps, Treasury Systems |
| **LI.FI** | Cross-chain swaps + Composer | AI × LI.FI Smart App |
| **Uniswap** | v4 subgraph + direct swaps | Agentic Finance |

## Quick Start

### Prerequisites

- Hostinger VPS with Docker
- n8n instance running
- Appwrite instance running
- Discord server with webhook
- API keys: Circle, LI.FI (optional)

### Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in credentials
3. Set up Appwrite database: `bash scripts/setup-appwrite-db.sh`
4. Import n8n workflows from `n8n/workflows/`
5. Deploy dashboard to Appwrite Sites
6. Configure Discord webhooks

See [docs/appwrite-setup.md](docs/appwrite-setup.md) for database details and [docs/proposal.md](docs/proposal.md) for the full architecture.

## Team

Built for EthGlobal HackMoney 2026.

## License

MIT
