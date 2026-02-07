# Swap Executor Appwrite Integration Fix

**Date:** 2026-02-06
**Status:** Deployed and verified

## Problem

The swap-executor n8n workflow had 4 Code nodes that used `fetch()` to interact with the Appwrite REST API. However, n8n Code nodes do not have `fetch()` available in the global scope (it throws "fetch is not defined" at runtime). This caused all Appwrite operations to **silently fail**:

- Execution records were never created (fell back to `local-<timestamp>` IDs)
- Dashboard History page was empty (no records in Appwrite)
- Confirm/Cancel flow could crash (no try/catch around the fetch call in "Get Execution Details")
- Status updates never persisted after swap execution

A secondary issue was that `aw.smartpiggies.cloud` resolved to `127.0.1.1` inside the n8n Docker container, so even HTTP Request nodes couldn't reach Appwrite until the DNS was fixed.

## Root Causes

1. **`fetch()` unavailable in n8n Code nodes** - n8n sandboxes Code node execution; global `fetch()` is not exposed. Only explicitly whitelisted modules (via `NODE_FUNCTION_ALLOW_EXTERNAL`) are available.

2. **Docker DNS resolution** - The server's hostname `aw.smartpiggies.cloud` resolves to `127.0.1.1` (a loopback address from `/etc/hosts` on the host), which is unreachable from inside Docker containers.

3. **Appwrite schema mismatch** - The Code nodes were writing fields that don't exist in the `executions` collection schema (`execution_mode`, `is_testnet`, `mocked`, `recipient`, `recipient_ens`), and using `gateway` as a route value when the enum only accepts `circle`.

## Solution

### Workflow Changes (swap-executor.json)

Replaced all `fetch()` calls in Code nodes with n8n HTTP Request nodes. The pattern used throughout:

```
Code node (prepare data) → HTTP Request node (call API) → Code node (process response)
```

#### Node Changes

| Old Node | New Nodes | Purpose |
|----------|-----------|---------|
| Create Execution Record (Code, `fetch()`) | Prepare Execution Data (Code) → Save to Appwrite (HTTP Request POST) → Extract Execution ID (Code) | Create Appwrite document |
| Get Execution Details (Code, `fetch()`) | Parse Confirm Request (Code) → Fetch Execution from Appwrite (HTTP Request GET) → Merge Confirm Data (Code) | Fetch execution for confirm/cancel |
| Update Execution Status (Code, `fetch()`) | Update Status in Appwrite (HTTP Request PATCH) | Update status after swap |
| Cancel Execution (Code, `fetch()`) | Cancel in Appwrite (HTTP Request PATCH) → Format Cancel Response (Code) | Set status to cancelled |

#### Execute Swap and Validate Request (Preserved)

The Execute Swap and Validate Request Code nodes were **not changed**. They contain `fetch()` calls (for The Graph, LI.FI quotes, Circle API in live mode, and ENS resolution) that are also broken by the same fetch() limitation. However, these are separate concerns:
- Live mode uses `require('ethers')` (whitelisted via `NODE_FUNCTION_ALLOW_EXTERNAL`) for on-chain transactions, and `fetch()` for Circle API and quote APIs
- Fixing these `fetch()` calls requires additional HTTP Request nodes and is tracked as a separate task
- The live-mode code includes GatewaySwapReceiver integration, EIP-712 signing, and attestation polling that must be preserved

#### Other Fixes

- **Respond Confirm boolean rendering**: Changed `{{ $json.success }}` to `{{ $json.success ? 'true' : 'false' }}` (and same for `mocked`) to avoid n8n rendering booleans as empty strings
- **Schema alignment**: Removed fields not in the Appwrite `executions` collection schema
- **Route enum mapping**: Internal `gateway` route is mapped to `circle` before writing to Appwrite

### Docker DNS Fix

Added `extra_hosts` to both `n8n` and `n8n-worker` services in `/root/n8n/docker-compose.yml`:

```yaml
extra_hosts:
  - "aw.smartpiggies.cloud:193.203.164.217"
```

This overrides DNS resolution inside the containers so `aw.smartpiggies.cloud` points to the server's public IPv4 address instead of the unreachable loopback `127.0.1.1`.

## Node Count

- **Before:** 14 nodes
- **After:** 20 nodes
- **Net change:** +6 nodes

## Workflow Flow (After)

### Create Swap Path
```
Swap Request Webhook
  → Validate Request (Code)
  → Prepare Execution Data (Code)
  → Save to Appwrite (HTTP Request POST)
  → Extract Execution ID (Code)
  → Notify Discord (HTTP Request POST)
  → Respond to Webhook
```

### Confirm/Cancel Path
```
Confirm Swap Webhook
  → Parse Confirm Request (Code)
  → Cancelled? (If node)
    ├─ TRUE → Cancel in Appwrite (HTTP Request PATCH)
    │         → Format Cancel Response (Code)
    │         → Respond Cancel
    └─ FALSE → Fetch Execution from Appwrite (HTTP Request GET)
              → Merge Confirm Data (Code)
              → Execute Swap (Code)
              → Update Status in Appwrite (HTTP Request PATCH)
              → Passthrough Status (Code)
              → Discord Result (HTTP Request POST) + Respond Confirm
```

## Appwrite `executions` Collection Schema

Valid attributes (for reference when writing to this collection):

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| timestamp | datetime | yes | ISO 8601 |
| type | enum | yes | `swap`, `rebalance`, `transfer` |
| source_chain | string(20) | yes | |
| dest_chain | string(20) | yes | |
| source_token | string(10) | yes | |
| dest_token | string(10) | yes | |
| amount | string(50) | yes | |
| status | enum | no (default: pending) | `pending`, `awaiting_confirmation`, `confirmed`, `executing`, `completed`, `failed`, `cancelled` |
| tx_hash | string(100) | no | |
| route | enum | no | `uniswap`, `lifi`, `circle` (NOT `gateway`) |
| requester | string(100) | no | |
| approver | string(100) | no | |
| approved_at | datetime | no | |
| completed_at | datetime | no | |
| error | string(500) | no | |
| gas_used | string(50) | no | |
| gas_price | string(50) | no | |
| slippage | double | no | |
| reason | string(200) | no | |
| amount_usd | double | no | |

**Fields NOT in schema** (do not write these): `execution_mode`, `is_testnet`, `mocked`, `recipient`, `recipient_ens`

## Verification

Tested on production (2026-02-06):

```bash
# 1. Create swap → returns real Appwrite ID
curl -s -X POST "https://n8n.smartpiggies.cloud/webhook/swap-executor" \
  -H "Content-Type: application/json" \
  -d '{"sourceChain":"base","destChain":"arbitrum","sourceToken":"USDC","destToken":"ETH","amount":"1"}'
# Result: {"executionId":"698694987f61f38a59c0",...} (real Appwrite ID, not "local-...")

# 2. Cancel swap → status persisted in Appwrite
curl -s -X POST "https://n8n.smartpiggies.cloud/webhook/swap-confirm" \
  -H "Content-Type: application/json" \
  -d '{"executionId":"698694987f61f38a59c0","action":"cancel"}'
# Result: {"success":true,"status":"cancelled"}
# Appwrite document: status="cancelled", completed_at set

# 3. Confirm swap → execution attempted, status updated
curl -s -X POST "https://n8n.smartpiggies.cloud/webhook/swap-confirm" \
  -H "Content-Type: application/json" \
  -d '{"executionId":"698694a1700bf1f02d7e","action":"confirm"}'
# Result: status="failed" (expected in live mode), error persisted in Appwrite
```

## Lessons Learned

1. **Always use HTTP Request nodes for API calls in n8n** - Code nodes cannot use `fetch()`, `axios`, or other HTTP libraries (unless explicitly whitelisted via `NODE_FUNCTION_ALLOW_EXTERNAL`).

2. **Docker DNS is unreliable for self-referencing hostnames** - When services on the same host need to reach each other via public hostnames, use `extra_hosts` in docker-compose to bypass DNS.

3. **Validate against Appwrite schema before writing** - Appwrite returns 400 for unknown attributes. Always check the collection schema and only send valid fields.

4. **n8n HTTP Request `neverError` + `onError: continueRegularOutput`** - These settings prevent workflow crashes on API errors but mean you must check the response for `$id` or error fields in downstream nodes.

5. **Route enum mapping** - Internal routing logic uses `gateway` but Appwrite's route enum expects `circle`. Always map at the boundary.
