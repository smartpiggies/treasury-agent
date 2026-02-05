# n8n Integration Guide for Treasury Ops Bot

A practical guide for understanding how n8n automates DeFi treasury operations.

## What This Project Does

Treasury Ops Bot is an automated system that:
- **Monitors** ETH prices across multiple chains
- **Reports** daily treasury balances to Discord
- **Executes** token swaps (same-chain and cross-chain)
- **Alerts** when prices cross thresholds
- **Summarizes** weekly performance

All orchestration happens in **n8n**, a visual workflow automation platform.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TREASURY OPS BOT                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   n8n (Workflow Engine)                                             │
│   ├── Daily Report      → Discord + Appwrite                        │
│   ├── Price Monitor     → Alerts when thresholds crossed            │
│   ├── Swap Executor     → LI.FI / Circle Gateway                    │
│   ├── Weekly Summary    → Aggregated stats to Discord               │
│   └── Error Handler     → Catches failures, notifies team           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   External Services                                                 │
│   ├── Circle Gateway    → USDC balances, cross-chain transfers      │
│   ├── The Graph         → On-chain price data (Uniswap pools)       │
│   ├── LI.FI             → Cross-chain swaps, route optimization     │
│   ├── Discord           → Notifications, alerts, reports            │
│   └── Appwrite          → Data persistence (balances, executions)   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The 5 Workflows Explained

### 1. Daily Report (`daily-report.json`)
**Schedule:** Every day at 9 AM

**What it does:**
1. Fetches USDC balances from Circle Gateway (across Ethereum, Base, Arbitrum)
2. Gets current ETH price from The Graph (Uniswap v3 subgraph)
3. Formats a summary report
4. Posts to Discord
5. Saves snapshot to Appwrite

**Key nodes:**
- `Schedule Trigger` → Cron-based timing
- `HTTP Request` → Circle Gateway API call
- `Code` → JavaScript to format the report
- `HTTP Request` → Discord webhook POST

```
[Schedule] → [Fetch Balance] → [Fetch Price] → [Format] → [Discord + Appwrite]
```

---

### 2. Price Monitor (`price-monitor.json`)
**Schedule:** Every 5 minutes

**What it does:**
1. Queries ETH/USDC price from The Graph
2. Compares against thresholds (HIGH: $4000, LOW: $2500)
3. Always saves price to Appwrite (builds history)
4. If threshold crossed → sends Discord alert

**Key nodes:**
- `IF` → Conditional branching based on price
- `Code` → Price comparison logic

```
[Schedule] → [Get Price] → [Check Thresholds] → [Save to Appwrite]
                                    ↓
                            [IF crossed] → [Discord Alert]
```

---

### 3. Swap Executor (`swap-executor.json`)
**Trigger:** Webhook (external API call)

**What it does:**
1. Receives swap request via webhook
2. Validates parameters (chains, tokens, amounts)
3. Gets quote from LI.FI
4. Creates pending execution in Appwrite
5. Waits for confirmation webhook
6. Executes swap (or mocks it in test mode)
7. Updates execution record, notifies Discord

**Execution modes:**
| Mode | Behavior |
|------|----------|
| `mock` | Gets real quotes, simulates execution, returns fake tx hash |
| `live` | Actually executes on mainnet (costs real money) |

**Routing logic:**
```javascript
if (sourceChain === destChain) {
  route = 'uniswap';  // Same-chain swap
} else if (sourceToken === 'USDC' && destToken === 'USDC') {
  route = 'gateway';  // Circle Gateway for USDC transfers
} else {
  route = 'lifi';     // LI.FI for cross-chain swaps
}
```

---

### 4. Weekly Summary (`weekly-summary.json`)
**Schedule:** Monday at 8 AM

**What it does:**
1. Queries Appwrite for last 7 days of price history
2. Queries Appwrite for last 7 days of executions
3. Calculates statistics (high, low, avg, volatility)
4. Posts formatted summary to Discord

**Statistics calculated:**
- Price range (high/low/average)
- Week-over-week change (%)
- Volatility (standard deviation as % of mean)
- Execution counts (completed, failed, cancelled)
- Total volume

---

### 5. Error Handler (`error-handler.json`)
**Trigger:** n8n Error Trigger (catches failures from other workflows)

**What it does:**
1. Catches any workflow failure
2. Extracts error details (workflow name, node, message, stack)
3. Determines severity based on workflow type
4. Sends color-coded alert to Discord
5. Saves error to Appwrite alerts collection

**Severity levels:**
| Workflow Type | Severity | Discord Color |
|--------------|----------|---------------|
| Swap/Executor | Critical | Red |
| Price/Monitor | Warning | Yellow |
| Report/Summary | Info | Blue |

---

## Key Integrations

### Circle Gateway API
**Purpose:** Query USDC balances across chains, cross-chain USDC transfers

```javascript
// Balance query
POST https://gateway-api.circle.com/v1/balances
Headers: Content-Type: application/json
Body: {
  "token": "USDC",
  "sources": [
    { "domain": 0, "depositor": "0x..." },  // Ethereum
    { "domain": 3, "depositor": "0x..." },  // Arbitrum
    { "domain": 6, "depositor": "0x..." }   // Base
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

**Domain IDs:**
- 0 = Ethereum
- 3 = Arbitrum
- 6 = Base
- 7 = Optimism

---

### The Graph (Decentralized Network)
**Purpose:** On-chain price data from Uniswap v3 pools

```javascript
// Price query
POST https://gateway.thegraph.com/api/{{API_KEY}}/subgraphs/id/{{SUBGRAPH_ID}}
Body: {
  "query": "{ pools(first: 1, where: { token0_: { symbol: \"WETH\" }, token1_: { symbol: \"USDC\" } }, orderBy: totalValueLockedUSD, orderDirection: desc) { token0Price token1Price } }"
}
```

**Why The Graph?**
- Decentralized, reliable price data
- No rate limits with API key
- Direct access to Uniswap pool state

---

### LI.FI
**Purpose:** Cross-chain swaps with automatic route optimization

```javascript
// Get quote
GET https://li.quest/v1/quote?fromChain=8453&toChain=42161&fromToken=USDC&toToken=ETH&fromAmount=1000000

// Response includes:
// - estimate: expected output amount
// - transactionRequest: ready-to-sign tx data
// - route: which bridges/DEXs will be used
```

**Important:** LI.FI does NOT support testnets. Use `EXECUTION_MODE=mock` for testing.

---

### Appwrite
**Purpose:** Data persistence for balances, executions, alerts, price history

**Collections:**
| Collection | Purpose |
|------------|---------|
| `price_history` | Historical price snapshots |
| `executions` | Swap transaction records |
| `alerts` | Alert history |
| `balances` | Treasury balance snapshots |

```javascript
// Save document
POST {{APPWRITE_ENDPOINT}}/databases/treasury/collections/price_history/documents
Headers:
  X-Appwrite-Project: {{PROJECT_ID}}
  X-Appwrite-Key: {{API_KEY}}
Body: {
  "documentId": "unique()",
  "data": { "timestamp": "...", "price_usd": 3200.50, "token": "ETH" }
}
```

---

## n8n Concepts for Developers

### Node Types Used

| Node | Purpose | Example Use |
|------|---------|-------------|
| `Schedule Trigger` | Run workflow on cron schedule | "Every day at 9 AM" |
| `Webhook` | HTTP endpoint to trigger workflow | Receive swap requests |
| `HTTP Request` | Call external APIs | Circle, Discord, Appwrite |
| `Code` | Custom JavaScript logic | Format reports, calculate stats |
| `IF` | Conditional branching | Check if price crossed threshold |
| `Error Trigger` | Catch workflow failures | Global error handling |

### Data Flow

Data flows through nodes as **items** with this structure:
```javascript
{
  json: {
    // Your actual data
    price: 3200.50,
    token: "ETH"
  }
}
```

**Accessing data in expressions:**
```javascript
// Current node's input
{{$json.price}}

// From a specific node
{{$node["HTTP Request"].json.data.price}}

// Environment variable
{{$env.DISCORD_WEBHOOK_ALERTS}}
```

### Code Node Patterns

```javascript
// Get all input items
const items = $input.all();

// Process and return
return items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));
```

**Important:** Code nodes must return `[{json: {...}}]` format.

---

## Environment Variables

All secrets are stored as Docker environment variables, not in workflows.

```yaml
# Core settings
EXECUTION_MODE=mock              # 'mock' or 'live'

# APIs
CIRCLE_API_KEY=...
GRAPH_API_KEY=...
LIFI_INTEGRATOR_ID=...
APPWRITE_API_KEY=...

# Discord
DISCORD_WEBHOOK_REPORTS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_ALERTS=https://discord.com/api/webhooks/...

# Wallet (for live mode)
TREASURY_ADDRESS=0x...
TREASURY_PRIVATE_KEY=...         # Use dedicated demo wallet!
```

**n8n settings for Code node env access:**
```yaml
N8N_BLOCK_ENV_ACCESS_IN_NODE=false  # Allow $env in Code nodes
N8N_RUNNERS_DISABLED=true           # Run Code nodes inline
```

---

## Testing Workflows

### Manual Testing in n8n UI
1. Open workflow
2. Click "Test workflow" button
3. Check execution output for each node
4. View errors in execution log

### Testing Swap Executor via curl
```bash
# Create swap request
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "base",
    "destChain": "arbitrum",
    "sourceToken": "USDC",
    "destToken": "ETH",
    "amount": "10"
  }'

# Confirm swap
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-confirm \
  -H "Content-Type: application/json" \
  -d '{"executionId": "<id-from-above>", "action": "confirm"}'
```

---

## Chain Reference

| Chain | Chain ID | Explorer |
|-------|----------|----------|
| Ethereum | 1 | etherscan.io |
| Base | 8453 | basescan.org |
| Arbitrum | 42161 | arbiscan.io |
| Optimism | 10 | optimistic.etherscan.io |

**Testnets (for reference):**
| Chain | Chain ID |
|-------|----------|
| Sepolia | 11155111 |
| Base Sepolia | 84532 |
| Arbitrum Sepolia | 421614 |

---

## Lessons Learned

### 1. LI.FI Doesn't Support Testnets
We use `EXECUTION_MODE=mock` to get real mainnet quotes without executing. This is fine for demos.

### 2. The Graph Hosted Service is Deprecated
Always use the decentralized network: `gateway.thegraph.com/api/{key}/subgraphs/id/{id}`

### 3. n8n Code Nodes Need Special Config
By default, Code nodes can't access `$env`. Set `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`.

### 4. Separate Workflows > Monolithic
We split into 5 focused workflows instead of one big one. Benefits:
- Easier to debug
- Independent schedules
- Error isolation

### 5. Error Handler is Essential
The Error Trigger workflow catches failures across all workflows and alerts the team.

---

## Deployed Workflow IDs

| Workflow | ID | Nodes |
|----------|-----|-------|
| Error Handler | `kZjokECTsoBc4u0K` | 4 |
| Weekly Summary | `GA6J1Rwewnd4ouKR` | 5 |
| Price Monitor | `j4GC43sr9gyIZBzs` | 7 |
| Daily Report | `ug0pkxlD19gLvirK` | 6 |
| Swap Executor | `xSNUGccedYTFUd0D` | 14 |

---

## Next Steps for Development

1. **Activate scheduled workflows** - Currently manual trigger only
2. **Add more tokens** - Monitor more than just ETH
3. **Implement live mode** - Fund a demo wallet for real swaps
4. **Build dashboard** - Visual interface for executions and balances
5. **Add approval flow** - Discord buttons for swap confirmation

---

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Circle Gateway Docs](https://developers.circle.com/w3s/cross-chain-transfer-protocol)
- [LI.FI Documentation](https://docs.li.fi/)
- [The Graph Documentation](https://thegraph.com/docs/)
- [Appwrite Documentation](https://appwrite.io/docs)
