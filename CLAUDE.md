# Treasury Ops Bot - Claude Code Context

## Project Overview

This is a **hackathon POC** for an autonomous DeFi treasury management agent. The goal is to learn n8n, Circle Arc, Uniswap, and LI.FI integrations while building a functional proof-of-concept that can later become production-ready.

## Architecture

```
Hostinger VPS
├── n8n (self-hosted) - https://n8n.smartpiggies.cloud
├── Appwrite - https://aw.smartpiggies.cloud
│   ├── Auth + Database
│   └── Dashboard hosting (Sites)
└── Dashboard - https://treasury-agent.sites.smartpiggies.cloud

External Services
├── Circle Arc - Chain-abstracted USDC, cross-chain transfers
├── Uniswap v4 - Same-chain swaps, price data via subgraph
├── LI.FI - Cross-chain swaps, multi-step DeFi via Composer
└── Discord - Notifications + human-in-the-loop confirmations
```

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

## Key Commands

```bash
# Dashboard development
pnpm dashboard:dev      # Start dashboard dev server
pnpm dashboard:build    # Build for production
pnpm dashboard:install  # Install dashboard dependencies

# Workflows
pnpm workflows:export   # Export from n8n UI to n8n/workflows/
pnpm workflows:import   # Import to n8n from n8n/workflows/

# Database setup
bash scripts/setup-appwrite-db.sh  # Create Appwrite database schema
```

## Data Storage

**Primary**: Appwrite Database (hosted on Hostinger)
- Database ID: `treasury`
- `price_history` - Price snapshots from monitoring
- `executions` - Swap/rebalance transaction records
- `alerts` - Alert history and acknowledgments
- `balances` - Treasury balance snapshots across chains

**Setup**: Run `bash scripts/setup-appwrite-db.sh` to create the database schema.
See `docs/appwrite-setup.md` for full documentation.

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

## Code Patterns

- **n8n**: Use environment variables via `{{$env.VAR_NAME}}`
- **Dashboard**: TanStack Query for data fetching, Appwrite SDK for auth
- **Styling**: Tailwind + shadcn/ui components

## Files to Never Commit

The `.gitignore` protects these, but be aware:
- `.env` files (use `.env.example` as template)
- `*credentials*.json`
- `*.pem`, `*.key`
- `.n8n/` (contains credentials)
