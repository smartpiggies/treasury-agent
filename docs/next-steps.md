# Next Steps

Last updated: 2026-02-07

## Immediate (Pick up here)

### ~~1. Fix LI.FI Live Mode Transaction Data~~ ✅ Fixed
~~Live mode LI.FI swap sends transaction but reverts.~~ Root cause was missing ERC-20 approval (not empty calldata as originally diagnosed). Fixed in commit `26907bf` — added allowance check + `MaxUint256` approval before swap. Two successful mainnet txs:
- n8n: [`0xc30d44...`](https://arbiscan.io/tx/0xc30d44a155374d0545ea882722921fc00c41afdd719bbabc154641b62bad1207) (Arb→Base)
- Dashboard: [`0xdf0afa...`](https://basescan.org/tx/0xdf0afa3662ef55dcf46ac205750e29ace068e10f971e6a4bee195921c5722a43) (Base→Arb)

### 2. Make ethers Persistent in Task Runner
The ethers module was installed in the n8n task runner via symlink, but this is lost on container recreation (`docker compose up -d`). Need a persistent solution:
- Option A: Add a startup script or Dockerfile that installs ethers in the task runner path
- Option B: Mount a volume with node_modules into the task runner directory
- Current workaround: Manual symlink into `/usr/local/lib/node_modules/n8n/node_modules/.pnpm/@n8n+task-runner@.../node_modules/@n8n/task-runner/node_modules/`

### 3. Test Dashboard History Page
The Appwrite integration is working — execution records are being created, updated, and cancelled correctly. Verify the dashboard at https://treasury-agent.sites.smartpiggies.cloud shows execution history.

- Multiple test records exist in Appwrite (cancelled/failed/completed test data)
- If the History page is still empty, check the dashboard's Appwrite query logic

### 4. Dashboard Improvements
- Test Quick Action buttons
- Verify deposit flow works
- Show per-chain balances (currently shows aggregate only)

## Completed

- ~~Fix `fetch()` in Execute Swap and Validate Request~~ — Whitelisted `node-fetch`, added `require('node-fetch')` to Code nodes (PR #11)
- ~~Fix Uniswap subgraph IDs and pool query~~ — Correct IDs, sorted token addresses for v3 pools (PR #12)
- ~~Fix LI.FI URLSearchParams~~ — Manual query string construction for sandbox (PR #12)
- ~~Fix Gateway/Circle route matching~~ — Handle both `gateway` and `circle` route names (PR #12)
- ~~Fix ENS resolution~~ — Updated subgraph ID in swap-executor and discord-webhook-handler
- ~~Fix Respond Confirm JSON template~~ — Replaced manual string building with `JSON.stringify()`
- ~~Reactivate Price Monitor and Error Handler~~ — Both active on production
- ~~Switch to mock mode~~ — Server running `EXECUTION_MODE=mock`
- ~~Clean up stale workflows~~ — Deleted: CLI Deploy Test, My workflow, Discord Echo Test, Discord Command Handler (superseded)
- ~~Delete `master` branch from GitHub~~ — Remote branch deleted
- ~~Test mock mode end-to-end~~ — All three routes (Uniswap, LI.FI, Gateway) pass in mock mode
- ~~Test ENS resolution~~ — `pigaibank.eth` resolves to `0xc3c68a5d6607b26d60adc4925e08788778989314`
- ~~Test live mode swap~~ — Transaction signing and broadcasting works; LI.FI calldata bug discovered

## Medium Priority

### 5. Clean Up docker-compose.yml
- Remove duplicate `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` line in n8n service
- Delete old merged "Daily Treasury Report" (`S3X87WkOmf9jnmju`) after verifying new workflows work

### 6. Set Up Branch Protection
On GitHub repo settings, add branch protection rules for `main`:
- Require PR reviews before merging
- Require status checks to pass (once CI is set up)

### 7. Remaining Epics
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
| EXECUTION_MODE | `mock` |
| Swap Executor ID | `RpW4tXVpLsanUIuz` |
| Discord Webhook Handler ID | `frQ3SBYKt29guNhe` |

## Known Issues

- **LI.FI live mode**: Transaction reverts due to empty calldata (see #1 above)
- **ethers in task runner**: Installed via symlink, lost on container recreation (see #2 above)
- **n8n workflow IDs change on each reimport** — Always verify current IDs with `docker exec n8n n8n list:workflow`
