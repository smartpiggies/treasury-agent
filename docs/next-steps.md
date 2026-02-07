# Next Steps

Last updated: 2026-02-07

## Immediate (Pick up here)

### 1. Test Dashboard History Page
The Appwrite integration is now working — execution records are being created, updated, and cancelled correctly. Verify the dashboard at https://treasury-agent.sites.smartpiggies.cloud shows execution history.

- 4 test records exist in Appwrite (all cancelled/failed, none pending)
- If the History page is still empty, check the dashboard's Appwrite query logic

### 2. Fix `fetch()` in Execute Swap and Validate Request
The Appwrite `fetch()` calls are fixed (replaced with HTTP Request nodes), but the Execute Swap and Validate Request Code nodes still use `fetch()` for:
- **The Graph API** — Uniswap v3 pool queries (used in mock and live mode)
- **LI.FI quote API** — Cross-chain swap quotes
- **Circle Gateway API** — Transfer/attestation calls in live mode
- **ENS resolution** — Resolving .eth names via The Graph

These calls silently fail in n8n Code nodes. Options:
- Convert to HTTP Request nodes (same pattern as Appwrite fix)
- Or whitelist `node-fetch` via `NODE_FUNCTION_ALLOW_EXTERNAL` in docker-compose.yml

**Impact:** Mock mode returns mock tx hashes but skips real quotes. Live mode fails on all routes except the `ethers.js` parts (which work because ethers is whitelisted).

### 3. Reactivate Price Monitor and Error Handler
Both are currently inactive on production:
- **Price Monitor** (`j4GC43sr9gyIZBzs`) — Should run every 5 minutes
- **Error Handler** (`kZjokECTsoBc4u0K`) — Should be active to catch workflow errors

```bash
ssh root@aw.smartpiggies.cloud "docker exec n8n n8n update:workflow --id=j4GC43sr9gyIZBzs --active=true"
ssh root@aw.smartpiggies.cloud "docker exec n8n n8n update:workflow --id=kZjokECTsoBc4u0K --active=true"
cd /root/n8n && docker compose restart n8n n8n-worker
```

### 4. Test End-to-End Swap (Mock Mode)
Set `EXECUTION_MODE=mock` on the server, then test a full create → confirm flow:

```bash
# Create
curl -s -X POST 'https://n8n.smartpiggies.cloud/webhook/swap-executor' \
  -H 'Content-Type: application/json' \
  -d '{"sourceChain":"base","destChain":"base","sourceToken":"USDC","destToken":"ETH","amount":"1"}'

# Confirm (use the executionId from above)
curl -s -X POST 'https://n8n.smartpiggies.cloud/webhook/swap-confirm' \
  -H 'Content-Type: application/json' \
  -d '{"executionId":"<ID>","action":"confirm"}'
```

Expected: `status: completed` with a `0xmock_...` tx hash. Note: this will fail until the `fetch()` issue (#2 above) is fixed, because the Execute Swap Code node uses `fetch()` for Uniswap subgraph queries even in mock mode.

## Medium Priority

### 5. Clean Up docker-compose.yml
- Remove duplicate `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` line in n8n service
- Review and remove stale test workflows from n8n (CLI Deploy Test, My workflow, Discord Echo Test)

### 6. Test Discord Command Flow
Verify the Discord → n8n → swap flow works end-to-end:
- Discord Webhook Handler (`Xm5q2px0HBWYBR5f`) is active
- Discord Command Handler (`6znPOZjgHW5vqSbW`) is inactive — determine if it's needed or superseded

### 7. Dashboard Improvements
- Test WalletConnect integration
- Test Quick Action buttons
- Verify deposit flow works
- Show per-chain balances

## Lower Priority

### 8. Delete `master` Branch on GitHub
The stale `master` branch on GitHub remote should be deleted to prevent future confusion. It only has 2 commits and is not the default branch.

```bash
git push origin --delete master
```

### 9. Set Up Branch Protection
On GitHub repo settings, add branch protection rules for `main`:
- Require PR reviews before merging
- Require status checks to pass (once CI is set up)

### 10. Remaining Epics
See `CLAUDE.md` for the full epics list, including:
- Test Send Funds from Circle Gateway
- Test Atomic Gateway Mint + Uniswap Swap
- N-of-M Approval Logic
- User/Group Registration
- Project Landing Page

## Server Reference

| Item | Value |
|------|-------|
| SSH | `ssh -i ~/.ssh/jagkey2.pem root@aw.smartpiggies.cloud` |
| n8n | https://n8n.smartpiggies.cloud |
| Dashboard | https://treasury-agent.sites.smartpiggies.cloud |
| Appwrite | https://aw.smartpiggies.cloud/console |
| EXECUTION_MODE | `live` (mainnet!) |
| Swap Executor ID | `CAZFI4ijkMAPlOgM` |
| Appwrite executions | 4 records (all cancelled/failed test data) |
