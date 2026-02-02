# Treasury Ops Bot - Setup Guide

Complete guide to configure and run the Treasury Ops Bot for the hackathon.

## Prerequisites

- **Hostinger VPS** with Docker installed
- **Node.js 18+** and **pnpm** for dashboard development
- **Discord server** where you have admin access
- Access to create accounts on Circle, Alchemy/Infura

## 1. Required Credentials

### Circle (Required)

Circle provides chain-abstracted USDC balance queries.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `CIRCLE_API_KEY` | [console.circle.com](https://console.circle.com/) | Balance queries, transfers |
| `CIRCLE_TREASURY_ADDRESS` | Your Circle wallet address | Identifying your treasury |

**Steps:**
1. Create account at [console.circle.com](https://console.circle.com/)
2. Create a new project
3. Navigate to API Keys → Create API Key
4. Copy the API key (shown only once)
5. Note your wallet address from the Wallets section

### Discord (Required)

Discord webhooks for notifications and alerts.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `DISCORD_WEBHOOK_REPORTS` | Server Settings → Integrations | Daily/weekly reports |
| `DISCORD_WEBHOOK_ALERTS` | Server Settings → Integrations | Price alerts |

**Steps:**
1. Open Discord server settings
2. Go to Integrations → Webhooks
3. Create two webhooks: "Treasury Reports" and "Treasury Alerts"
4. Copy each webhook URL

### RPC Endpoints (Required)

Blockchain RPC endpoints for transaction submission.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `RPC_ETHEREUM` | Alchemy/Infura/QuickNode | Ethereum mainnet/Sepolia |
| `RPC_ARBITRUM` | Alchemy/Infura | Arbitrum One/Sepolia |
| `RPC_BASE` | Alchemy/Base docs | Base mainnet/Sepolia |
| `RPC_POLYGON` | Alchemy/Infura | Polygon (optional) |

**Steps (Alchemy example):**
1. Create account at [alchemy.com](https://www.alchemy.com/)
2. Create an app for each network you need
3. Copy the HTTPS URL for each app

**For testnet (recommended for hackathon):**
- Use Sepolia endpoints, not mainnet
- Most providers offer free testnet access

### LI.FI (Optional)

LI.FI handles cross-chain swaps.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `LIFI_INTEGRATOR_ID` | [li.fi](https://li.fi/) | Cross-chain swap routing |

**Steps:**
1. The API is public - no key required for basic usage
2. Register at [li.fi](https://li.fi/) for higher rate limits
3. Use `treasury-ops-bot` as your integrator ID

### The Graph (Optional)

For Uniswap price data with higher rate limits.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `GRAPH_API_KEY` | [thegraph.com/studio](https://thegraph.com/studio/) | Uniswap subgraph queries |

**Note:** The public subgraph works for POC. Only needed if you hit rate limits.

### Testnet Wallet (Required for Execution)

EOA wallet for signing transactions.

| Credential | Where to Get | Used For |
|------------|--------------|----------|
| `TREASURY_PRIVATE_KEY` | Generate new wallet | Signing transactions |
| `TREASURY_ADDRESS` | Derived from private key | Treasury address |

**Steps:**
1. Create a **NEW** wallet specifically for testnet
2. **NEVER** use a wallet with real funds
3. Export the private key
4. Fund with testnet ETH from faucets:
   - Sepolia: [sepoliafaucet.com](https://sepoliafaucet.com/)
   - Base Sepolia: [docs.base.org/tools/faucets](https://docs.base.org/tools/faucets/)
   - Arbitrum Sepolia: [faucet.arbitrum.io](https://faucet.arbitrum.io/)

---

## 2. Appwrite Setup

### Create Appwrite Project

1. Access your Appwrite instance on Hostinger
2. Create new project: "Treasury Ops"
3. Note the **Project ID**
4. Go to API Keys → Create API Key with scopes:
   - `databases.read`, `databases.write`
   - `collections.read`, `collections.write`
   - `documents.read`, `documents.write`

### Create Database

1. Go to Databases → Create Database
2. Name: "Treasury Database"
3. Database ID: `treasury`

### Create Collections

Follow `docs/appwrite-setup.md` or use the schema in `docs/appwrite-schema.json`.

Create these collections:
- `price_history`
- `executions`
- `alerts`
- `balances`

### Environment Variables for Appwrite

```bash
APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=treasury
```

---

## 3. n8n Setup

### Deploy n8n on Hostinger

1. SSH into your Hostinger VPS
2. Create directory: `mkdir -p /opt/n8n && cd /opt/n8n`
3. Copy `docker-compose.yml` from this repo
4. Create `.env` file with all credentials
5. Run: `docker-compose up -d`

### Import Workflows

1. Open n8n UI at `https://your-n8n.hostinger.com`
2. Complete initial setup (create admin account)
3. Go to Workflows → Import from File
4. Import each workflow from `n8n/workflows/`:
   - `daily-report.json`
   - `price-monitor.json`
   - `swap-executor.json`
   - `weekly-summary.json`

### Configure n8n Environment Variables

In n8n, go to Settings → Environment Variables, or set in docker-compose:

```bash
# Circle
CIRCLE_API_KEY=your_circle_api_key
CIRCLE_TREASURY_ADDRESS=0x...

# LI.FI
LIFI_INTEGRATOR_ID=treasury-ops-bot

# Appwrite
APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
APPWRITE_PROJECT_ID=treasury-ops
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_DATABASE_ID=treasury

# Discord
DISCORD_WEBHOOK_REPORTS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_ALERTS=https://discord.com/api/webhooks/...

# Wallet (TESTNET ONLY!)
TREASURY_PRIVATE_KEY=0x...
TREASURY_ADDRESS=0x...

# Price Thresholds
PRICE_ALERT_HIGH=3500
PRICE_ALERT_LOW=2800

# RPCs
RPC_ETHEREUM=https://eth-sepolia.g.alchemy.com/v2/...
RPC_ARBITRUM=https://arb-sepolia.g.alchemy.com/v2/...
RPC_BASE=https://base-sepolia.g.alchemy.com/v2/...
```

### Activate Workflows

1. Open each workflow
2. Click the toggle in the top-right to activate
3. For webhook workflows, note the webhook URLs

---

## 4. Dashboard Setup

### Install Dependencies

```bash
cd dashboard
pnpm install
```

### Configure Environment

Create `dashboard/.env.local`:

```bash
VITE_APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
VITE_APPWRITE_PROJECT_ID=treasury-ops
VITE_APPWRITE_DATABASE_ID=treasury
VITE_N8N_WEBHOOK_BASE=https://your-n8n.hostinger.com/webhook
```

### Run Development Server

```bash
pnpm dev
# Opens at http://localhost:5173
```

### Build for Production

```bash
pnpm build
# Output in dist/
```

### Deploy

Deploy the `dist/` folder to:
- Appwrite Hosting (recommended)
- Any static hosting (Vercel, Netlify, nginx)

---

## 5. Testing the Setup

### Test n8n Workflows

```bash
# Test daily report (manual trigger)
curl -X POST https://your-n8n.hostinger.com/webhook/test/daily-report

# Test price monitor
# Wait for scheduled trigger or test manually in n8n UI

# Test swap executor
curl -X POST https://your-n8n.hostinger.com/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "arbitrum",
    "sourceToken": "USDC",
    "destToken": "ETH",
    "amount": "10",
    "reason": "Test swap"
  }'
```

### Check Discord

You should see:
- Test report in your reports channel
- Swap notification with execution ID

### Verify Appwrite

Check the Appwrite console for documents in:
- `price_history` - Should have price entries
- `executions` - Should have your test swap

### Test Dashboard

1. Open http://localhost:5173
2. Check Settings page for connection status
3. Dashboard should show (mock) data

---

## 6. Environment Variable Summary

### Root `.env` (for n8n docker-compose)

```bash
# Circle
CIRCLE_API_KEY=
CIRCLE_TREASURY_ADDRESS=

# LI.FI
LIFI_INTEGRATOR_ID=treasury-ops-bot

# The Graph (optional)
GRAPH_API_KEY=

# Discord
DISCORD_WEBHOOK_REPORTS=
DISCORD_WEBHOOK_ALERTS=

# Appwrite
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=treasury

# Wallet (TESTNET ONLY)
TREASURY_PRIVATE_KEY=
TREASURY_ADDRESS=

# RPCs
RPC_ETHEREUM=
RPC_ARBITRUM=
RPC_BASE=
RPC_POLYGON=

# Thresholds
PRICE_ALERT_HIGH=3500
PRICE_ALERT_LOW=2800

# n8n
N8N_WEBHOOK_BASE_URL=https://your-n8n.hostinger.com/webhook
```

### Dashboard `.env.local`

```bash
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=treasury
VITE_N8N_WEBHOOK_BASE=
```

---

## 7. Troubleshooting

### n8n workflows not triggering
- Check workflow is **Active** (toggle in top-right)
- Check execution logs in n8n
- Verify environment variables are set

### Discord not receiving messages
- Test webhook directly: `curl -X POST YOUR_WEBHOOK -d '{"content":"test"}'`
- Check Discord channel permissions

### Appwrite connection errors
- Verify endpoint URL includes `/v1`
- Check API key has correct scopes
- Ensure collections exist with correct IDs

### Dashboard shows "Not configured"
- Check `.env.local` exists in dashboard folder
- Restart dev server after changing env vars

---

## 8. Security Reminders

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use testnet wallets only** - Never use mainnet private keys
3. **Rotate API keys** after the hackathon
4. **Review webhook URLs** - Keep them private
5. **Limit Appwrite API key scopes** to minimum needed
