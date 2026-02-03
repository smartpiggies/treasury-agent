# Appwrite Setup

This documents the Appwrite instance and database setup for Treasury Ops Bot.

## Instance Details

| Setting | Value |
|---------|-------|
| **Endpoint** | https://aw.smartpiggies.cloud/v1 |
| **Project ID** | `treasury-agent-1` |
| **Console URL** | https://aw.smartpiggies.cloud/ |
| **Host** | Hostinger VPS |

## Database Setup - COMPLETED

**Setup Date**: 2026-02-03

The database was created using the CLI script at `scripts/setup-appwrite-db.sh`.

### Database

| Setting | Value |
|---------|-------|
| **Database ID** | `treasury` |
| **Name** | Treasury Database |
| **Type** | tablesdb (new tables-db API) |
| **Created** | 2026-02-03T00:20:46.134+00:00 |

### Tables Summary

| Table | Columns | Indexes | Status |
|-------|---------|---------|--------|
| `price_history` | 5 | 2 | Available |
| `executions` | 20 | 3 | Available |
| `alerts` | 11 | 3 | Available |
| `balances` | 6 | 2 | Available |

**Total**: 4 tables, 42 columns, 10 indexes

### Permissions Applied

**Model**: Read-only dashboard, API key for writes

All tables use the same permission set:
- **Read**: `any` - Dashboard can read all data without authentication
- **Create**: `users` - Requires authentication (blocks unauthenticated access)
- **Update**: `users` - Requires authentication
- **Delete**: `users` - Requires authentication

**How this works**:
| Actor | Read | Create/Update/Delete |
|-------|------|---------------------|
| Dashboard (unauthenticated) | Yes (via `any`) | No (not authenticated) |
| n8n workflows (API key) | Yes | Yes (API keys bypass collection permissions) |
| Logged-in users | Yes | Yes (if they have a session) |

**Security**: Since the dashboard doesn't authenticate users, only API keys (n8n) can write. Regular dashboard visitors can only read.

**Alternative: Team-based permissions** (for production with user accounts):
```
read: any
create: team:operators
update: team:operators
delete: team:admins
```
This requires creating `operators` and `admins` teams in Appwrite Console.

### Important: Default Values Constraint

**The Problem**: Appwrite does not allow setting a default value on a required column. If you try `--required true --xdefault "value"`, it fails with: `Cannot set default value for required column`.

**The Workaround**: Fields that need defaults are created as **optional** (`--required false`) with the default value. Appwrite will automatically use the default when the field is omitted.

**Affected Fields**:

| Table | Column | Default Value | Original Intent |
|-------|--------|---------------|-----------------|
| `price_history` | `chain` | `"ethereum"` | Was optional with default |
| `executions` | `status` | `"pending"` | Was required with default |
| `alerts` | `severity` | `"warning"` | Was required with default |
| `alerts` | `acknowledged` | `false` | Was required with default |
| `balances` | `source` | `"circle"` | Was required with default |

**How to Handle in Application Code**:

1. **Rely on defaults**: Simply omit the field when creating records - Appwrite will use the default value automatically.

2. **Always provide values**: For fields like `status` that are logically required, always explicitly set them in your n8n workflows or API calls:
   ```javascript
   // n8n Code Node example
   const doc = {
     timestamp: new Date().toISOString(),
     type: "swap",
     status: "pending",  // Always set explicitly even though it has a default
     // ... other fields
   };
   ```

3. **Validate on read**: When reading records, check for null values on these fields and treat null as the default value if needed.

---

## Table Schemas

### price_history

Historical price snapshots from monitoring workflows.

| Column | Type | Required | Size | Default |
|--------|------|----------|------|---------|
| timestamp | datetime | Yes | - | - |
| token | string | Yes | 10 | - |
| price_usd | double | Yes | - | - |
| source | string | Yes | 50 | - |
| chain | string | No | 20 | `"ethereum"` |

**Indexes:**
- `idx_token_timestamp`: key on [token ASC, timestamp DESC]
- `idx_timestamp`: key on [timestamp DESC]

### executions

Record of all swap, rebalance, and transfer operations.

| Column | Type | Required | Size/Values | Default |
|--------|------|----------|-------------|---------|
| timestamp | datetime | Yes | - | - |
| type | enum | Yes | swap, rebalance, transfer | - |
| source_chain | string | Yes | 20 | - |
| dest_chain | string | Yes | 20 | - |
| source_token | string | Yes | 10 | - |
| dest_token | string | Yes | 10 | - |
| amount | string | Yes | 50 | - |
| amount_usd | double | No | - | - |
| status | enum | No | pending, awaiting_confirmation, confirmed, executing, completed, failed, cancelled | `"pending"` |
| tx_hash | string | No | 100 | - |
| route | enum | No | uniswap, lifi, circle | - |
| requester | string | No | 100 | - |
| approver | string | No | 100 | - |
| approved_at | datetime | No | - | - |
| completed_at | datetime | No | - | - |
| error | string | No | 500 | - |
| gas_used | string | No | 50 | - |
| gas_price | string | No | 50 | - |
| slippage | double | No | - | - |
| reason | string | No | 200 | - |

**Indexes:**
- `idx_status`: key on [status ASC]
- `idx_timestamp`: key on [timestamp DESC]
- `idx_type_status`: key on [type ASC, status ASC]

### alerts

Alert history for price thresholds and system events.

| Column | Type | Required | Size/Values | Default |
|--------|------|----------|-------------|---------|
| timestamp | datetime | Yes | - | - |
| type | enum | Yes | price_high, price_low, execution_failed, limit_reached, system_error | - |
| severity | enum | No | info, warning, critical | `"warning"` |
| message | string | Yes | 500 | - |
| token | string | No | 10 | - |
| threshold | double | No | - | - |
| actual_value | double | No | - | - |
| acknowledged | boolean | No | - | `false` |
| acknowledged_by | string | No | 100 | - |
| acknowledged_at | datetime | No | - | - |
| related_execution | string | No | 50 | - |

**Indexes:**
- `idx_acknowledged`: key on [acknowledged ASC]
- `idx_type_timestamp`: key on [type ASC, timestamp DESC]
- `idx_severity`: key on [severity ASC, acknowledged ASC]

### balances

Treasury balance snapshots across chains.

| Column | Type | Required | Size | Default |
|--------|------|----------|------|---------|
| timestamp | datetime | Yes | - | - |
| chain | string | Yes | 20 | - |
| token | string | Yes | 10 | - |
| balance | string | Yes | 50 | - |
| balance_usd | double | No | - | - |
| source | string | No | 50 | `"circle"` |

**Indexes:**
- `idx_chain_token`: key on [chain ASC, token ASC]
- `idx_timestamp`: key on [timestamp DESC]

---

## Site Hosting Setup - COMPLETED

**Setup Date**: 2026-02-02

The Appwrite Sites feature is configured for hosting the dashboard.

### Site Configuration

| Setting | Value |
|---------|-------|
| **Site ID** | `69812d550016fbb0ea95` |
| **Site Name** | `treasury-agent` |
| **Primary URL** | https://treasury-agent.sites.smartpiggies.cloud |
| **Status** | Live, Verified |
| **Framework** | Static (Vite) |
| **Adapter** | static |
| **Fallback File** | `index.html` |

### Build Configuration

| Setting | Value |
|---------|-------|
| **Build Runtime** | node-22 |
| **Install Command** | `pnpm install` |
| **Build Command** | `pnpm run build` |
| **Output Directory** | `./dist` |
| **Root Directory** | `./dashboard` |
| **Specification** | s-1vcpu-512mb |
| **Timeout** | 30s |

### VCS Integration

| Setting | Value |
|---------|-------|
| **Provider** | GitHub |
| **Repository ID** | `1147565106` |
| **Branch** | `main` |
| **Installation ID** | `treasury_c756b9251b052f46` |
| **Auto-Deploy** | Enabled |

### Active Deployment

| Setting | Value |
|---------|-------|
| **Deployment ID** | `698132fac7a6b07c8dc8` |
| **Created** | 2026-02-02T23:27:54.826+00:00 |
| **Status** | ready |

### Available URLs

| URL | Type |
|-----|------|
| https://treasury-agent.sites.smartpiggies.cloud | Primary (manual) |
| https://branch-main-*.sites.smartpiggies.cloud | Branch preview |
| https://commit-*.sites.smartpiggies.cloud | Commit preview |

### Deployment Methods

1. **Git Push** (Recommended): Push to `main` branch triggers auto-deploy
2. **CLI**: `npx appwrite sites create-deployment --site-id 69812d550016fbb0ea95`
3. **Console**: Upload via Appwrite Console UI

---

## API Keys

Create an API key in Appwrite Console with these scopes for n8n workflows:

- `databases.read`
- `databases.write`
- `collections.read`
- `collections.write`
- `documents.read`
- `documents.write`

Add to `.env` as `APPWRITE_API_KEY`.

---

## CLI Commands Reference

```bash
# List databases
npx appwrite tables-db list

# List tables in treasury database
npx appwrite tables-db list-tables --database-id treasury

# List columns for a table
npx appwrite tables-db list-columns --database-id treasury --table-id price_history

# List indexes for a table
npx appwrite tables-db list-indexes --database-id treasury --table-id price_history

# Create a row (example)
npx appwrite tables-db create-row \
    --database-id treasury \
    --table-id price_history \
    --row-id "unique-id" \
    --data '{"timestamp": "2026-02-03T00:00:00Z", "token": "ETH", "price_usd": 3245.50, "source": "uniswap"}'

# List rows
npx appwrite tables-db list-rows --database-id treasury --table-id price_history

# Delete a row
npx appwrite tables-db delete-row --database-id treasury --table-id price_history --row-id "unique-id"
```

---

## Environment Variables

### Root `.env`
```bash
APPWRITE_ENDPOINT=https://aw.smartpiggies.cloud/v1
APPWRITE_PROJECT_ID=treasury-agent-1
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=treasury
APPWRITE_COLLECTION_PRICE_HISTORY=price_history
APPWRITE_COLLECTION_EXECUTIONS=executions
APPWRITE_COLLECTION_ALERTS=alerts
APPWRITE_COLLECTION_BALANCES=balances
```

### Dashboard `.env.local`
```bash
VITE_APPWRITE_ENDPOINT=https://aw.smartpiggies.cloud/v1
VITE_APPWRITE_PROJECT_ID=treasury-agent-1
VITE_APPWRITE_DATABASE_ID=treasury
VITE_APPWRITE_COLLECTION_PRICE_HISTORY=price_history
VITE_APPWRITE_COLLECTION_EXECUTIONS=executions
VITE_APPWRITE_COLLECTION_ALERTS=alerts
VITE_APPWRITE_COLLECTION_BALANCES=balances
VITE_N8N_WEBHOOK_BASE=https://n8n.smartpiggies.cloud/webhook
```

---

## Schema Reference

See `appwrite-schema.json` for the complete schema definition in JSON format.

## Setup Script

The database can be recreated using:
```bash
bash scripts/setup-appwrite-db.sh
```

Note: This will fail if the database already exists. Delete the existing database first if needed.
