# Discord Bot - Claude Code Context

## Overview

Lightweight Discord.js bot that forwards @mention commands to n8n webhook for processing. This replaces the unreliable n8n community Discord node.

## Architecture

```
Discord Message (@TreasuryAgent balance)
         │
         ▼
┌─────────────────────┐
│   Discord Bot       │  ← This container
│   (discord.js)      │
│                     │
│ 1. Receive message  │
│ 2. Check @mention   │
│ 3. Parse content    │
│ 4. POST to webhook  │
└─────────┬───────────┘
          │ HTTP POST
          ▼
┌─────────────────────┐
│   n8n Webhook       │
│   /discord-cmd      │
│                     │
│ 1. Parse intent     │
│ 2. Route to handler │
│ 3. Execute (Circle, │
│    Uniswap, etc.)   │
│ 4. Send Discord msg │
└─────────────────────┘
```

## Webhook Payload Format

The bot sends this JSON to n8n:

```json
{
  "messageId": "123456789",
  "channelId": "1468977576696611080",
  "channelName": "treasury-bot",
  "guildId": "123456789",
  "guildName": "My Server",
  "author": {
    "id": "987654321",
    "username": "dad",
    "displayName": "Dad",
    "tag": "dad#1234"
  },
  "content": "what's the balance",
  "rawContent": "<@BOT_ID> what's the balance",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Development

```bash
# Install dependencies
npm install

# Run locally (requires .env file)
npm run dev

# Build Docker image
docker build -t treasury-discord-bot .

# Run with Docker
docker run -d \
  -e DISCORD_BOT_TOKEN=your_token \
  -e N8N_WEBHOOK_URL=https://n8n.smartpiggies.cloud/webhook/discord-cmd \
  --name treasury-discord-bot \
  treasury-discord-bot
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_BOT_TOKEN` | Yes | Bot token from Discord Developer Portal |
| `N8N_WEBHOOK_URL` | No | Webhook URL (default: n8n.smartpiggies.cloud) |
| `ALLOWED_CHANNEL_IDS` | No | Comma-separated channel IDs to monitor |

## Deployment on VPS

The bot joins the n8n Docker network so it can reach n8n internally:

```bash
# On VPS
cd /root/discord-bot
docker compose up -d

# View logs
docker logs -f treasury-discord-bot
```

## Response Handling

Two response modes supported:

### Mode 1: Direct Response (Synchronous)
n8n returns JSON with `reply` field:
```json
{"reply": "Your balance is $12,340"}
```
Bot sends this as Discord reply immediately.

### Mode 2: Webhook Response (Asynchronous)
n8n returns empty/acknowledgement, then sends response via Discord webhook later.
Better for long-running operations.

## Troubleshooting

### Bot not receiving messages
1. Check MESSAGE CONTENT INTENT is enabled in Discord Developer Portal
2. Verify bot has permissions in the channel
3. Check `ALLOWED_CHANNEL_IDS` if set

### Webhook errors
1. Verify n8n workflow is active
2. Check webhook path matches
3. View bot logs: `docker logs treasury-discord-bot`
