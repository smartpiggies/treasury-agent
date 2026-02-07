# PigAiBank - Claude Code Context

> **This is a PUBLIC repository.** Never commit secrets, private keys, API keys, passwords, or credentials. All secrets live on the server (see [Self-Hosted Infrastructure](#self-hosted-infrastructure)).

> **Default branch is `main`.** Do NOT use `master`. The `master` branch is a stale artifact from the initial repo setup and does not contain current code. Always branch from and PR into `main`. See `docs/branch-confusion-postmortem.md` for context.

## Epics / TODO

High-level efforts that need human guidance, testing, and decision-making. Remove items when complete.

- [x] **Test Send Funds from Circle Gateway** - Gateway burn+mint working (Arb→Base USDC transfer)
- [ ] **Test Atomic Gateway Mint + Uniswap Swap** - Deploy GatewaySwapReceiver, test USDC→ETH swap on Arbitrum
- [x] **Test Uniswap Integration** - Mock + live mode working via SwapRouter02
- [x] **Test LI.FI Integration** - Mock + live mode working; ERC-20 approval fix deployed
- [x] **Implement & Test ENS** - `pigaibank.eth` resolves correctly in both swap-executor and discord-webhook-handler
- [x] **Document Live Test Results** - All three routes (Uniswap, LI.FI, Gateway) documented with mainnet tx hashes for bounty judges (`docs/live-test-results.md`)
- [ ] **Improve Dashboard App** - UX polish, additional features, mobile responsiveness
  - [ ] Test and fix WalletConnect integration
  - [ ] Test and fix all Quick Action buttons
- [ ] **Show Balances on All Chains** - Display per-chain USDC balances (Ethereum, Arbitrum, Base) on both the dashboard and via Discord bot, not just aggregate total
- [ ] **Fix Deposit-to-Shared-Treasury Flow** - Currently `gateway.deposit()` attributes funds to `msg.sender`, so users can only deposit to their own Gateway balance. Need a mechanism for any address to contribute to the shared treasury (e.g. users send USDC to treasury wallet, then treasury deposits to Gateway; or a proxy contract that deposits on behalf of treasury)
- [ ] **N-of-M Approval Logic & Testing** - Discord reaction-based consensus for large transactions
- [ ] **User/Group Registration** - Onboarding flow for families/teams, permission management
- [ ] **Project Landing Page** - Public-facing page pitching PigAiBank for the hackathon

## Project Overview

**PigAiBank** is a Discord-native AI that manages crypto for families, teams, and small organizations through conversation. Built for EthGlobal HackMoney 2026.

**Core Idea**: "Just chat. The agent handles the complexity."

```
Mom: "@PigAiBank what's our balance?"
Agent: "You have $12,340 total - $8,200 in stablecoins and $4,140 in ETH"

Dad: "@PigAiBank send $100 to alex.eth"
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
- **Discord**: `@PigAiBank deposit $100` (mock mode or treasury wallet)

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

> **Note:** The GitHub repo, Appwrite project ID (`treasury-agent-1`), database ID (`treasury`), and Appwrite Sites URL still reference "treasury-agent" for backwards compatibility with deployed infrastructure. Only user-facing names use "PigAiBank".

## n8n Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Daily Report** | 9 AM daily | Circle balance + ETH price → Discord |
| **Price Monitor** | Every 5 min | ETH price alerts when thresholds crossed |
| **Swap Executor** | Webhook | Validate → Save to Appwrite → Route → Execute → Update status |
| **Discord Handler** | Webhook | Parse intents: balance, price, swap, deposit, help |
| **Weekly Summary** | Monday 8 AM | Aggregate stats → Discord |
| **Error Handler** | Error trigger | Catch failures → Discord alert |

## Current Integration Status

| Service | Status | Notes |
|---------|--------|-------|
| Circle Gateway | ✅ Working | API format fixed, deposits via dashboard |
| Uniswap | ✅ Working | Price data + atomic Gateway mint→swap via GatewaySwapReceiver |
| LI.FI | ✅ Working | Cross-chain quotes + execution |
| ENS | ✅ Working | Resolves .eth names via The Graph |
| Appwrite | ✅ Working | All 4 collections tested, swap-executor writes via HTTP Request nodes |
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

## Self-Hosted Infrastructure

Everything runs on a single Hostinger VPS (`aw.smartpiggies.cloud`). Both Appwrite and n8n are self-hosted via Docker.

**Credentials and secrets are stored on the server**, not in this repo:
- **n8n secrets** → `/root/n8n/docker-compose.yml` (environment variables section)
- **Appwrite config** → Appwrite console or CLI
- **SSH access** → `ssh root@aw.smartpiggies.cloud`

See `n8n/CLAUDE.md` for the full n8n environment variable reference.

### n8n Custom Docker Image

n8n runs a custom Docker image (`n8n-custom:latest`) built from `/root/n8n/Dockerfile`. This is needed because Code nodes require `ethers` and `node-fetch`, which aren't bundled with n8n.

**Key details:**
- Packages installed in `/opt/custom-modules/node_modules/` (not n8n's own module tree, which fails due to pnpm `catalog:` protocol)
- `NODE_PATH` env var set for general module resolution
- **Task runner symlinks required**: `N8N_RUNNERS_DISABLED=true` does NOT actually disable the task runner — Code nodes still execute via the task runner, which has its own module resolution that ignores `NODE_PATH`. The Dockerfile uses `find` to locate the task runner's `node_modules` and symlinks `ethers` + `node-fetch` there.
- To rebuild: `cd /root/n8n && docker compose build --no-cache && docker compose up -d`
- Both `n8n` and `n8n-worker` services use the custom image

### Appwrite CLI Setup

Install the CLI and connect to our self-hosted instance:

```bash
# Install globally
npm install -g appwrite-cli

# Login to our self-hosted Appwrite
appwrite login --endpoint https://aw.smartpiggies.cloud/v1

# Initialize project config in the repo (select the treasury project)
appwrite init project
```

Once connected, useful commands:
```bash
appwrite databases list                    # List databases
appwrite databases listCollections --database-id treasury  # List collections
appwrite functions list                    # List serverless functions
appwrite deploy                            # Deploy functions/sites
```

### Appwrite Sites (Dashboard Hosting)

The dashboard is hosted on Appwrite Sites and auto-deploys when you push to the connected GitHub repo.

- **Console**: https://aw.smartpiggies.cloud/console → Sites section
- **Live URL**: https://treasury-agent.sites.smartpiggies.cloud

```bash
# List all sites
appwrite sites list

# Get site details
appwrite sites get --site-id <SITE_ID>

# List deployments
appwrite sites listDeployments --site-id <SITE_ID>

# Create a new deployment (upload code)
appwrite sites createDeployment --site-id <SITE_ID>

# Trigger a rebuild from VCS (GitHub)
appwrite sites createVcsDeployment --site-id <SITE_ID> --branch main

# Set the active deployment
appwrite sites updateSiteDeployment --site-id <SITE_ID> --deployment-id <DEPLOY_ID>

# Environment variables (VITE_* build-time vars like VITE_WALLETCONNECT_PROJECT_ID)
appwrite sites listVariables --site-id <SITE_ID>
appwrite sites createVariable --site-id <SITE_ID> --key VITE_KEY_NAME --value "value"
appwrite sites updateVariable --site-id <SITE_ID> --variable-id <VAR_ID> --key VITE_KEY_NAME --value "new-value"
appwrite sites deleteVariable --site-id <SITE_ID> --variable-id <VAR_ID>

# View logs
appwrite sites listLogs --site-id <SITE_ID>
```

### n8n CLI (Self-Hosted)

No installation needed - the CLI is built into the Docker image:

```bash
ssh root@aw.smartpiggies.cloud "docker exec n8n n8n <command>"
```

| Command | Description |
|---------|-------------|
| `n8n list:workflow` | List all workflows (ID\|Name) |
| `n8n export:workflow --all` | Export all workflows as JSON |
| `n8n export:workflow --id=<ID>` | Export a specific workflow |
| `n8n import:workflow --input=<file>` | Import workflow from JSON file |
| `n8n export:credentials --all` | Export all credentials (encrypted) |
| `n8n import:credentials --input=<file>` | Import credentials |
| `n8n update:workflow --id=<ID> --active=true` | Activate/deactivate a workflow |
| `n8n execute --id=<ID>` | Execute a workflow directly |

**Examples:**
```bash
# List all workflows
ssh root@aw.smartpiggies.cloud "docker exec n8n n8n list:workflow"

# Export a specific workflow to local machine
ssh root@aw.smartpiggies.cloud "docker exec n8n n8n export:workflow --id=gjZOrYxJ1JiZhA6a" > workflow.json

# Import a workflow (copy file to container first)
scp workflow.json root@aw.smartpiggies.cloud:/tmp/
ssh root@aw.smartpiggies.cloud "docker cp /tmp/workflow.json n8n:/tmp/ && docker exec n8n n8n import:workflow --input=/tmp/workflow.json"
```

**Note:** The n8n container name is `n8n`. For worker operations use `n8n-worker`.

**Important:** The CLI `import:workflow --id=X` does NOT overwrite existing workflows. To update a workflow, you must delete it from Postgres first, then import fresh. See the n8n-mcp note below.

### n8n MCP & Skills

When the **n8n-mcp** MCP server and **n8n-skills** are installed, prefer using them over the CLI for workflow operations — especially for tasks the CLI can't do well:

- **Updating workflows in-place** (the CLI can't overwrite; the MCP/API can)
- **Reading execution results and errors** (CLI has no access to execution details)
- **Validating workflow JSON** before deploying
- **Searching for nodes** and getting node configuration help
- **Creating/editing workflows programmatically** via the n8n REST API

Use `ToolSearch` to check if n8n-mcp tools are available (e.g. `n8n_update_full_workflow`, `n8n_get_workflow`, `n8n_validate_workflow`). Also check for n8n-skills via the Skill tool for Code node authoring help (`n8n-code-javascript`, `n8n-expression-syntax`, `n8n-workflow-patterns`, etc.).

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
- `executions` - Swap/transfer records (see `docs/swap-executor-appwrite-fix.md` for schema)
- `alerts` - Alert history
- `balances` - Treasury balance snapshots

## Files to Never Commit

- `.env` files (use `.env.example`)
- `*credentials*.json`
- `*.pem`, `*.key`
- `.n8n/` (contains credentials)
