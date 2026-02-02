# n8n Workflows

This directory contains the exported n8n workflow JSON files for Treasury Ops Bot.

## Workflows

| File | Description | Trigger |
|------|-------------|---------|
| `daily-report.json` | Daily treasury balance and price report | Cron: 9:00 AM |
| `price-monitor.json` | Price threshold monitoring and alerts | Interval: 5 min |
| `swap-executor.json` | Execute swaps with Discord confirmation | Webhook |
| `weekly-summary.json` | Weekly performance analytics | Cron: Monday 8:00 AM |

## Import Instructions

### Option 1: Manual Import

1. Open your n8n instance
2. Click **Workflows** → **Import from File**
3. Select the workflow JSON file
4. Configure credentials (see below)
5. Activate the workflow

### Option 2: n8n CLI

```bash
# Install n8n CLI if not already installed
npm install -g n8n

# Import workflow
n8n import:workflow --input=workflows/daily-report.json
```

## Required Credentials

Set up these credentials in n8n before activating workflows:

### 1. Circle API

- **Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `Bearer YOUR_CIRCLE_API_KEY`

### 2. Discord Webhook

- **Type**: Discord Webhook
- **Webhook URL**: Your Discord webhook URL

### 3. Google Sheets

- **Type**: Google Sheets OAuth2 or Service Account
- **Scopes**: `spreadsheets`, `drive.file`

## Environment Variables

Add these to your n8n instance environment:

```bash
# In your n8n docker-compose.yml or .env
CIRCLE_API_KEY=your_circle_api_key
TREASURY_ADDRESS=your_treasury_address
DISCORD_WEBHOOK_REPORTS=your_webhook_url
DISCORD_WEBHOOK_ALERTS=your_webhook_url
GOOGLE_SHEET_ID=your_sheet_id
```

Access in workflows via: `{{$env.CIRCLE_API_KEY}}`

## Workflow Details

### Daily Report

```
Trigger (9am) → Fetch Circle Balance → Fetch Uniswap Price → Format Report → Discord
```

**Outputs**:
- Treasury balance across all chains
- Current ETH/USDC price
- 24h change summary

### Price Monitor

```
Trigger (5min) → Fetch Price → Check Thresholds → [Alert if triggered] → Log to Sheets
```

**Configurable thresholds**:
- `PRICE_ALERT_HIGH`: Alert if price exceeds (default: 3500)
- `PRICE_ALERT_LOW`: Alert if price drops below (default: 2800)

### Swap Executor

```
Webhook → Validate Request → Determine Route → Request Discord Confirmation
    ↓
[User confirms in Discord]
    ↓
Execute Swap (Uniswap or LI.FI) → Notify Result → Log to Sheets
```

**Request format**:
```json
{
  "sourceChain": "arbitrum",
  "destChain": "base",
  "sourceToken": "USDC",
  "destToken": "ETH",
  "amount": "1000",
  "reason": "Rebalancing for gas"
}
```

### Weekly Summary

```
Trigger (Monday 8am) → Read Sheets History → Calculate Stats → Format Report → Discord + Email
```

**Outputs**:
- Weekly high/low/average prices
- Total volume executed
- Alert summary
- Performance vs previous week

## Testing

### Test Daily Report
```bash
# Trigger via n8n UI or:
curl -X POST https://your-n8n/webhook/test/daily-report
```

### Test Swap Executor
```bash
curl -X POST https://your-n8n/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "arbitrum",
    "sourceToken": "USDC",
    "destToken": "ETH",
    "amount": "100",
    "reason": "Test swap"
  }'
```

## Discord Confirmation Flow

The swap executor uses Discord interactive buttons for human-in-the-loop confirmation:

1. Workflow receives swap request
2. Sends embed to Discord with swap details + Confirm/Reject buttons
3. User clicks Confirm or Reject
4. Discord sends interaction back to n8n webhook
5. Workflow proceeds or cancels based on response

**Requires**: Discord bot with `applications.commands` scope for buttons.

## Troubleshooting

### Workflow not triggering
- Check workflow is **Active** (toggle in top-right)
- Verify cron expression in trigger node
- Check n8n logs: `docker logs n8n`

### API calls failing
- Verify credentials are set correctly
- Check API key permissions
- Test endpoints manually with curl

### Discord not receiving messages
- Verify webhook URL is correct
- Check Discord channel permissions
- Test webhook: `curl -X POST YOUR_WEBHOOK -H "Content-Type: application/json" -d '{"content":"test"}'`
