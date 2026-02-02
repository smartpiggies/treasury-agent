# n8n Workflows - Claude Code Context

## Overview

n8n is the orchestration layer for Treasury Ops Bot. All monitoring, decision-making, and execution flows are implemented as n8n workflows.

## Hosting

Self-hosted on **Hostinger VPS** via Docker.

```bash
# Typical docker-compose setup
docker-compose up -d n8n
```

Access at: `https://your-n8n.hostinger.com`

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `daily-report.json` | Cron 9:00 AM | Balance + price summary to Discord |
| `price-monitor.json` | Interval 5 min | Threshold alerts, log to Appwrite |
| `swap-executor.json` | Webhook | Execute swaps with Discord confirmation |
| `weekly-summary.json` | Cron Mon 8:00 AM | Performance analytics |

## Environment Variables

Configure in n8n instance (docker-compose or UI):

```bash
# Circle
CIRCLE_API_KEY=
CIRCLE_TREASURY_ADDRESS=

# LI.FI
LIFI_INTEGRATOR_ID=treasury-ops-bot

# Appwrite (for data storage)
APPWRITE_ENDPOINT=https://your-appwrite.hostinger.com/v1
APPWRITE_PROJECT_ID=treasury-ops
APPWRITE_API_KEY=

# Discord
DISCORD_WEBHOOK_REPORTS=
DISCORD_WEBHOOK_ALERTS=

# Wallet (TESTNET ONLY)
TREASURY_PRIVATE_KEY=
TREASURY_ADDRESS=

# RPCs
RPC_ETHEREUM=
RPC_ARBITRUM=
RPC_BASE=
```

Access in workflows: `{{$env.CIRCLE_API_KEY}}`

## Credential Types

Set up in n8n Credentials:

### Circle API
- **Type**: Header Auth
- **Header**: `Authorization`
- **Value**: `Bearer {{$env.CIRCLE_API_KEY}}`

### Appwrite
- **Type**: Header Auth
- **Header**: `X-Appwrite-Key`
- **Value**: `{{$env.APPWRITE_API_KEY}}`
- Also set `X-Appwrite-Project`: `{{$env.APPWRITE_PROJECT_ID}}`

### Discord Webhook
- **Type**: Discord Webhook
- **URL**: From environment variable

## Data Storage Pattern

**Using Appwrite instead of Google Sheets** for all data persistence.

### Writing to Appwrite
```javascript
// In n8n Code node - save price to Appwrite
const appwriteEndpoint = $env.APPWRITE_ENDPOINT;
const projectId = $env.APPWRITE_PROJECT_ID;
const apiKey = $env.APPWRITE_API_KEY;
const databaseId = 'treasury';
const collectionId = 'price_history';

const response = await fetch(
  `${appwriteEndpoint}/databases/${databaseId}/collections/${collectionId}/documents`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
    body: JSON.stringify({
      documentId: 'unique()',
      data: {
        timestamp: new Date().toISOString(),
        token: 'ETH',
        price_usd: $input.first().json.price,
        source: 'uniswap',
      },
    }),
  }
);

return [{ json: await response.json() }];
```

### Reading from Appwrite
```javascript
// Query price history for weekly summary
const response = await fetch(
  `${appwriteEndpoint}/databases/${databaseId}/collections/${collectionId}/documents?` +
  new URLSearchParams({
    queries: JSON.stringify([
      `greaterThan("timestamp", "${weekAgo}")`,
      'orderDesc("timestamp")',
    ]),
  }),
  {
    headers: {
      'X-Appwrite-Project': projectId,
      'X-Appwrite-Key': apiKey,
    },
  }
);
```

## Integration Patterns

### Circle Arc - Balance Query
```javascript
// Fetch unified USDC balance
const response = await fetch('https://api.circle.com/v1/w3s/wallets/balances', {
  headers: {
    'Authorization': `Bearer ${$env.CIRCLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});
```

### Uniswap Subgraph - Price Data
```javascript
// GraphQL query for ETH/USDC price
const query = `{
  pool(id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8") {
    token0Price
    token1Price
  }
}`;

const response = await fetch(
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }
);
```

### LI.FI - Cross-Chain Quote
```javascript
// Get quote for cross-chain swap
const params = new URLSearchParams({
  fromChain: 'ARB',
  toChain: 'BAS',
  fromToken: 'USDC',
  toToken: 'ETH',
  fromAmount: '1000000000', // 1000 USDC (6 decimals)
  fromAddress: $env.TREASURY_ADDRESS,
  integrator: $env.LIFI_INTEGRATOR_ID,
});

const response = await fetch(`https://li.quest/v1/quote?${params}`);
```

## Discord Confirmation Flow

For swap executor with human-in-the-loop:

1. **Webhook receives swap request**
2. **Send to Discord** with embed showing swap details
3. **Wait for response** (use n8n Wait node or webhook callback)
4. **Execute or cancel** based on response

For POC, can simplify:
- Just send notification to Discord
- User triggers execution via separate webhook
- Avoids needing Discord bot with button interactions

## Testing Workflows

```bash
# Test daily report
curl -X POST https://your-n8n.hostinger.com/webhook/test/daily-report

# Test swap executor
curl -X POST https://your-n8n.hostinger.com/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "base",
    "sourceToken": "USDC",
    "destToken": "ETH",
    "amount": "100"
  }'
```

## Workflow Development Tips

- Use **Sticky Notes** to document complex logic
- Test with **Manual Trigger** before switching to Cron
- Use **Error Trigger** workflow to catch and log failures
- Keep credentials in n8n, not hardcoded in nodes
