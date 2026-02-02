# Appwrite Database Setup

This guide walks through setting up the Appwrite database for Treasury Ops Bot.

## Prerequisites

- Appwrite instance running (Hostinger, Cloud, or local)
- Appwrite CLI installed: `npm install -g appwrite-cli`

## Quick Setup via Console

### 1. Create Database

1. Open Appwrite Console
2. Go to **Databases** > **Create Database**
3. Name: `Treasury Database`
4. Database ID: `treasury`

### 2. Create Collections

Create each collection with the settings below:

#### price_history

| Attribute | Type | Required | Size |
|-----------|------|----------|------|
| timestamp | datetime | Yes | - |
| token | string | Yes | 10 |
| price_usd | double | Yes | - |
| source | string | Yes | 50 |
| chain | string | No | 20 |

**Indexes:**
- `idx_token_timestamp`: key on [token ASC, timestamp DESC]
- `idx_timestamp`: key on [timestamp DESC]

#### executions

| Attribute | Type | Required | Size/Values |
|-----------|------|----------|-------------|
| timestamp | datetime | Yes | - |
| type | enum | Yes | swap, rebalance, transfer |
| source_chain | string | Yes | 20 |
| dest_chain | string | Yes | 20 |
| source_token | string | Yes | 10 |
| dest_token | string | Yes | 10 |
| amount | string | Yes | 50 |
| amount_usd | double | No | - |
| status | enum | Yes | pending, awaiting_confirmation, confirmed, executing, completed, failed, cancelled |
| tx_hash | string | No | 100 |
| route | enum | No | uniswap, lifi, circle |
| requester | string | No | 100 |
| approver | string | No | 100 |
| approved_at | datetime | No | - |
| completed_at | datetime | No | - |
| error | string | No | 500 |
| gas_used | string | No | 50 |
| gas_price | string | No | 50 |
| slippage | double | No | - |
| reason | string | No | 200 |

**Indexes:**
- `idx_status`: key on [status ASC]
- `idx_timestamp`: key on [timestamp DESC]
- `idx_type_status`: key on [type ASC, status ASC]

#### alerts

| Attribute | Type | Required | Size/Values |
|-----------|------|----------|-------------|
| timestamp | datetime | Yes | - |
| type | enum | Yes | price_high, price_low, execution_failed, limit_reached, system_error |
| severity | enum | Yes | info, warning, critical |
| message | string | Yes | 500 |
| token | string | No | 10 |
| threshold | double | No | - |
| actual_value | double | No | - |
| acknowledged | boolean | Yes | - |
| acknowledged_by | string | No | 100 |
| acknowledged_at | datetime | No | - |
| related_execution | string | No | 50 |

**Indexes:**
- `idx_acknowledged`: key on [acknowledged ASC]
- `idx_type_timestamp`: key on [type ASC, timestamp DESC]
- `idx_severity`: key on [severity ASC, acknowledged ASC]

#### balances

| Attribute | Type | Required | Size |
|-----------|------|----------|------|
| timestamp | datetime | Yes | - |
| chain | string | Yes | 20 |
| token | string | Yes | 10 |
| balance | string | Yes | 50 |
| balance_usd | double | No | - |
| source | string | Yes | 50 |

**Indexes:**
- `idx_chain_token`: key on [chain ASC, token ASC]
- `idx_timestamp`: key on [timestamp DESC]

## Permissions

For hackathon POC, use simple permissions:

- **Read**: Any (for dashboard access)
- **Create/Update**: Users with `operators` role
- **Delete**: Users with `admins` role

In production, tighten these based on your auth setup.

## API Keys

Create an API key with these scopes:
- `databases.read`
- `databases.write`
- `collections.read`
- `collections.write`
- `documents.read`
- `documents.write`

Add the key to your `.env` as `APPWRITE_API_KEY`.

## Testing the Setup

```bash
# Using curl to test (replace with your values)
curl -X GET "${APPWRITE_ENDPOINT}/databases/treasury/collections" \
  -H "X-Appwrite-Project: ${APPWRITE_PROJECT_ID}" \
  -H "X-Appwrite-Key: ${APPWRITE_API_KEY}"
```

## Schema Reference

See `appwrite-schema.json` for the complete schema definition in JSON format.
