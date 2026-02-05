# n8n Workflows - Claude Code Context

## Overview

n8n is the orchestration layer for Treasury Ops Bot. All monitoring, decision-making, and execution flows are implemented as n8n workflows.

## Hosting

Self-hosted on **Hostinger VPS** via Docker.

- **n8n UI:** https://n8n.smartpiggies.cloud
- **Docker Compose:** `/root/n8n/docker-compose.yml` on VPS
- **SSH Access:** `ssh root@aw.smartpiggies.cloud`

### Deployed Workflow IDs

| Workflow | ID | Nodes |
|----------|-----|-------|
| Error Handler | `kZjokECTsoBc4u0K` | 4 |
| Weekly Summary | `GA6J1Rwewnd4ouKR` | 5 |
| Price Monitor | `j4GC43sr9gyIZBzs` | 7 |
| Daily Report | `ug0pkxlD19gLvirK` | 6 |
| Swap Executor | `xSNUGccedYTFUd0D` | 14 |

**Note:** Old merged "Daily Treasury Report" (`S3X87WkOmf9jnmju`, 31 nodes) can be deleted after verifying new workflows work.

## Architecture: 5 Separate Workflows

```
┌─────────────────────────────────────────────────────────────────┐
│                     n8n WORKFLOW ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. daily-report.json        Schedule: 9 AM daily               │
│     └─ Circle Gateway balance + ETH price → Discord + Appwrite  │
│                                                                 │
│  2. price-monitor.json       Schedule: Every 5 minutes          │
│     └─ ETH price check → Alert if threshold crossed             │
│                                                                 │
│  3. swap-executor.json       Trigger: Webhooks                  │
│     └─ Validate → Confirm → Route (Uniswap/LI.FI/Gateway)       │
│     └─ MOCK MODE for testnets (LI.FI doesn't support them)      │
│                                                                 │
│  4. weekly-summary.json      Schedule: Monday 8 AM              │
│     └─ Aggregate price history + executions → Discord           │
│                                                                 │
│  5. error-handler.json       Trigger: Error Trigger             │
│     └─ Catch errors from all workflows → Discord + Appwrite     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Execution Modes

The system supports two execution modes controlled by `EXECUTION_MODE` environment variable:

| Mode | `EXECUTION_MODE` | Behavior | Cost |
|------|------------------|----------|------|
| **Mock** | `mock` | Get real quotes, simulate execution, fake tx hash | $0 |
| **Live** | `live` | Real execution on mainnet L2s | ~$0.01-2 per tx |

**IMPORTANT**: LI.FI does NOT support testnets. Always use `mock` mode for testing.

### Mock Mode (Default)
- Gets real quotes from LI.FI/Uniswap APIs
- Returns simulated transaction hashes (`0xmock_...`)
- Saves execution records with `mocked: true` flag
- Perfect for demos and testing workflows

### Live Mode (Mainnet)
- Requires funded wallet with USDC and ETH for gas
- Executes real transactions on mainnet L2s
- Transaction signing via n8n Code nodes with ethers.js

**Recommended Demo Budget**: $30-50 total (~$10-20 actual spend)

## Environment Variables

### How to Add Environment Variables (Self-Hosted n8n)

For self-hosted n8n on Docker, environment variables are set in `docker-compose.yml`, NOT in the n8n UI.

**Location on Hostinger VPS:** `/root/n8n/docker-compose.yml`

**Step-by-step process:**

```bash
# 1. SSH into the VPS
ssh root@aw.smartpiggies.cloud

# 2. Edit docker-compose.yml
nano /root/n8n/docker-compose.yml

# 3. Find the 'n8n:' service section, locate 'environment:'
# 4. Add your variables in this format:
#      - VARIABLE_NAME=value

# 5. IMPORTANT: Also add the SAME variables to 'n8n-worker:' service
#    (both services need the variables for queue-based execution)

# 6. Save the file (Ctrl+X, Y, Enter in nano)

# 7. Restart n8n to apply changes
cd /root/n8n && docker compose up -d

# 8. Verify the containers restarted
docker ps | grep n8n
```

**Example docker-compose.yml snippet:**

```yaml
services:
  n8n:
    environment:
      # ... existing variables ...
      # Treasury Ops Bot
      - EXECUTION_MODE=mock
      - GRAPH_API_KEY=your_key_here
      - DISCORD_WEBHOOK_ALERTS=https://discord.com/api/webhooks/...

  n8n-worker:
    environment:
      # ... existing variables ...
      # Treasury Ops Bot (SAME variables as n8n service)
      - EXECUTION_MODE=mock
      - GRAPH_API_KEY=your_key_here
      - DISCORD_WEBHOOK_ALERTS=https://discord.com/api/webhooks/...
```

**Access in workflows:** `{{$env.VARIABLE_NAME}}`

**Note:** The n8n UI "Variables" feature (Settings > Variables) does NOT exist in all self-hosted versions. Docker environment variables are the reliable method.

---

### Required Variables

```bash
# ===================
# EXECUTION MODE
# ===================
EXECUTION_MODE=mock                         # 'mock' = simulate, 'live' = real mainnet txs

# ===================
# The Graph (Decentralized Network)
# ===================
GRAPH_API_KEY=                              # Required: from thegraph.com/studio

# Mainnet subgraphs (for live mode)
GRAPH_SUBGRAPH_BASE=FQ6JYszEKApsBpAmiHesRsd9Ygc6mzmpNRANeVQFYoVX
GRAPH_SUBGRAPH_ARBITRUM=5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV

# ===================
# Circle Gateway
# ===================
CIRCLE_API_KEY=
CIRCLE_TREASURY_ADDRESS=
CIRCLE_GATEWAY_URL=https://gateway-api.circle.com  # or gateway-api-testnet.circle.com

# ===================
# LI.FI
# ===================
LIFI_INTEGRATOR_ID=treasury-ops-bot

# ===================
# Appwrite (for data storage)
# ===================
APPWRITE_ENDPOINT=https://aw.smartpiggies.cloud/v1
APPWRITE_PROJECT_ID=treasury-agent-1
APPWRITE_API_KEY=
APPWRITE_DATABASE_ID=treasury

# ===================
# Discord
# ===================
DISCORD_WEBHOOK_REPORTS=
DISCORD_WEBHOOK_ALERTS=

# ===================
# Wallet (for live mode)
# ===================
TREASURY_ADDRESS=
TREASURY_PRIVATE_KEY=                       # Use dedicated demo wallet!

# ===================
# RPC Endpoints (for live mode)
# ===================
RPC_BASE=https://mainnet.base.org
RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
RPC_OPTIMISM=https://mainnet.optimism.io

# ===================
# Price Alert Thresholds
# ===================
PRICE_ALERT_HIGH=4000
PRICE_ALERT_LOW=2500
```

### Verifying Variables Are Set

After restarting n8n, verify variables are accessible:

1. Open any workflow in n8n UI
2. Add a Code node with: `return [{ json: { test: $env.EXECUTION_MODE } }]`
3. Execute the node - if it returns the value, variables are working
4. If undefined, check that you added variables to BOTH `n8n` AND `n8n-worker` services

### Troubleshooting

**Variables returning undefined:**
- Ensure variables are in docker-compose.yml under `environment:` (with the `- ` prefix)
- Variables must be in BOTH `n8n:` and `n8n-worker:` services
- Run `docker compose up -d` to restart after changes
- Check for typos in variable names (case-sensitive)

**Workflows not seeing updated variables:**
- n8n caches environment on startup - must restart containers
- Use `docker compose down && docker compose up -d` for a full restart

**Viewing current container environment:**
```bash
docker exec n8n env | grep -E "(EXECUTION|GRAPH|DISCORD|APPWRITE|CIRCLE)"
```

## Integration Patterns

### The Graph (Decentralized Network) - Price Data

**IMPORTANT**: The hosted service (`api.thegraph.com/subgraphs/name/...`) is deprecated. Use the decentralized network:

```javascript
// HTTP Request node configuration
// URL: https://gateway.thegraph.com/api/{{$env.GRAPH_API_KEY}}/subgraphs/id/{{$env.GRAPH_SUBGRAPH_BASE}}
// Method: POST
// Body:
{
  "query": "{ pools(first: 1, where: { token0_: { symbol: \"WETH\" }, token1_: { symbol: \"USDC\" } }, orderBy: totalValueLockedUSD, orderDirection: desc) { token0Price token1Price } }"
}
```

### Circle Gateway - Balance Query

**IMPORTANT**: Use the Gateway API, NOT the legacy Wallet API. The API requires `token` and `depositor` fields.

```javascript
// HTTP Request node configuration
// URL: {{$env.CIRCLE_GATEWAY_URL}}/v1/balances
// Method: POST
// Headers: Content-Type: application/json (NO Authorization header needed)
// Body:
{
  "token": "USDC",
  "sources": [
    { "domain": 0, "depositor": "{{$env.CIRCLE_TREASURY_ADDRESS}}" },  // Ethereum
    { "domain": 3, "depositor": "{{$env.CIRCLE_TREASURY_ADDRESS}}" },  // Arbitrum
    { "domain": 6, "depositor": "{{$env.CIRCLE_TREASURY_ADDRESS}}" }   // Base
  ]
}

// Response format:
{
  "balances": [
    { "domain": 0, "balance": "1000.50" },  // balance as formatted string
    { "domain": 3, "balance": "500.25" },
    { "domain": 6, "balance": "250.00" }
  ]
}
```

Domain IDs:
- 0 = Ethereum
- 3 = Arbitrum
- 6 = Base

### LI.FI - Quote and Swap

```javascript
// Get quote (works for same-chain and cross-chain)
const params = new URLSearchParams({
  fromChain: '8453',           // Base chain ID
  toChain: '42161',            // Arbitrum chain ID
  fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  toToken: '0x0000000000000000000000000000000000000000',   // ETH (native)
  fromAmount: '1000000',       // 1 USDC (6 decimals)
  fromAddress: $env.TREASURY_ADDRESS,
  integrator: $env.LIFI_INTEGRATOR_ID,
});

const response = await fetch(`https://li.quest/v1/quote?${params}`);
const quote = await response.json();

// quote.estimate contains: fromAmount, toAmount, toAmountMin, executionDuration
// quote.transactionRequest contains: to, data, value, gasLimit (for live execution)
```

**Note**: LI.FI does NOT support testnet chains. Use mainnet chain IDs only.

### Appwrite - Document Operations

```javascript
// Create document
await fetch(
  `${$env.APPWRITE_ENDPOINT}/databases/${databaseId}/collections/${collectionId}/documents`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': $env.APPWRITE_PROJECT_ID,
      'X-Appwrite-Key': $env.APPWRITE_API_KEY,
    },
    body: JSON.stringify({
      documentId: 'unique()',
      data: { /* document fields */ },
    }),
  }
);

// Query documents
await fetch(
  `${$env.APPWRITE_ENDPOINT}/databases/${databaseId}/collections/${collectionId}/documents?` +
  new URLSearchParams({
    queries: JSON.stringify([
      `greaterThan("timestamp", "${weekAgo.toISOString()}")`,
      'orderDesc("timestamp")',
      'limit(100)',
    ]),
  }),
  {
    headers: {
      'X-Appwrite-Project': $env.APPWRITE_PROJECT_ID,
      'X-Appwrite-Key': $env.APPWRITE_API_KEY,
    },
  }
);
```

## Swap Routing Logic

The swap executor automatically determines the best route:

```javascript
// Routing decision tree
if (sourceChain === destChain) {
  route = 'uniswap';  // Same-chain swap via LI.FI API
} else if (sourceToken === 'USDC' && destToken === 'USDC') {
  route = 'gateway';  // Circle Gateway for USDC-only cross-chain
} else {
  route = 'lifi';     // LI.FI for cross-chain with swap
}
```

## Testing Workflows

### Mock Mode Testing (EXECUTION_MODE=mock)

```bash
# Test swap executor (creates pending execution)
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{"sourceChain":"base","destChain":"arbitrum","sourceToken":"USDC","destToken":"ETH","amount":"10"}'

# Confirm swap (executes in mock mode)
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-confirm \
  -H "Content-Type: application/json" \
  -d '{"executionId":"<id-from-previous-response>"}'

# Cancel swap
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-confirm \
  -H "Content-Type: application/json" \
  -d '{"executionId":"<id>","action":"cancel"}'
```

### Manual Workflow Triggers

In n8n UI:
1. Open workflow
2. Click "Test workflow" or use Manual Trigger
3. Check execution logs for errors

## Error Handling

The `error-handler.json` workflow catches errors from all other workflows:

- Automatically triggered on any workflow failure
- Formats error details (workflow name, node, message, stack trace)
- Sends alert to Discord (color-coded by severity)
- Saves to Appwrite alerts collection

Severity levels:
- **Critical** (red): Swap executor failures
- **Warning** (yellow): Price monitor issues
- **Info** (blue): Report/summary failures

## Workflow Development Tips

- Use **Sticky Notes** to document complex logic
- Test with **Manual Trigger** before switching to Cron
- Always check `EXECUTION_MODE` before running swaps
- Keep credentials in n8n environment, not hardcoded
- Use HTTP Request nodes instead of Code nodes for simple API calls
- Error Trigger workflow must be active to catch errors

## Chain ID Reference

| Chain | ID | Explorer |
|-------|-----|----------|
| Ethereum | 1 | etherscan.io |
| Base | 8453 | basescan.org |
| Arbitrum | 42161 | arbiscan.io |
| Optimism | 10 | optimistic.etherscan.io |
| Polygon | 137 | polygonscan.com |
| Base Sepolia | 84532 | sepolia.basescan.org |
| Arbitrum Sepolia | 421614 | sepolia.arbiscan.io |
| Sepolia | 11155111 | sepolia.etherscan.io |
