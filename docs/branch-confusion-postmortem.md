# Branch Confusion Postmortem

**Date:** 2026-02-07
**Severity:** High (production regression, corrected same day)
**Status:** Resolved

## What Happened

During the Swap Executor Appwrite integration fix (PR #9), work was accidentally started from the `master` branch instead of `main`. The `master` branch was a stale artifact containing only the initial 2 commits from repo setup — it lacked all production features that had been developed on `main` via feature branches and PRs.

This caused a regression: the Swap Executor workflow was deployed to production with a simplified Execute Swap Code node (~3,300 chars) instead of the full live-mode version (~19,400 chars).

## Timeline

1. **Session started on `master`** — Claude Code auto-detected `master` as the main branch (it was checked out locally). The actual GitHub default branch is `main`.
2. **Appwrite fix implemented** — 4 Code nodes using `fetch()` were correctly replaced with HTTP Request nodes. This part of the work was valid.
3. **Execute Swap simplified** — Because `master` had an old Execute Swap without live-mode code (no GatewaySwapReceiver, no LI.FI transaction signing, no Circle Gateway EIP-712), the rewrite treated all live-mode paths as stubs. This was wrong — `main` had full live-mode code from PR #8.
4. **Deployed to production** — The simplified version was deployed and verified (Appwrite integration worked, but live-mode execution was broken).
5. **Branch confusion discovered** — During code review, comparison against `origin/main` revealed the Execute Swap code was 16,000+ chars shorter than expected.
6. **Fixed** — The jsCode from `main`'s Validate Request and Execute Swap nodes was programmatically restored into the fix branch.
7. **Redeployed** — Corrected workflow deployed to production, verified with webhook tests.

## What Was Affected

### Affected
- **Swap Executor workflow** (`swap-executor.json`) — Execute Swap Code node was temporarily simplified, removing:
  - Uniswap v3 + GatewaySwapReceiver atomic swap (live mode)
  - LI.FI cross-chain transaction signing (live mode)
  - Circle Gateway EIP-712 signing + attestation polling (live mode)
  - Uniswap subgraph pool queries (used by both mock and live)

### NOT Affected
- All other n8n workflows (Daily Report, Price Monitor, Discord Handler, etc.)
- Server infrastructure (docker-compose.yml `extra_hosts` fix was valid and branch-independent)
- Environment variables (no changes were made)
- Appwrite data (3 test execution records created during testing were valid)
- Dashboard application

## Root Cause

1. **Stale `master` branch existed locally** — The repo had both `master` (2 commits) and `main` (18+ commits) branches. `master` was checked out.
2. **No branch protection or CI** — No GitHub Actions workflow existed to catch that `master` was stale or to run tests on PRs.
3. **Tooling auto-detection** — Claude Code detected `master` as the working branch and assumed it was the default.

## What Was Lost and Restored

The Execute Swap Code node contains three execution paths for live mode:

| Route | Feature | Chars | Status |
|-------|---------|-------|--------|
| Uniswap | GatewaySwapReceiver + Universal Router encoding | ~8,000 | Restored |
| LI.FI | `wallet.sendTransaction` with LI.FI quote | ~2,000 | Restored |
| Gateway | EIP-712 TransferSpec signing + attestation polling + gatewayMint | ~6,000 | Restored |

The Validate Request Code node's ENS resolution via The Graph subgraph was also preserved (it uses `fetch()` which is broken in n8n Code nodes, but that's a separate known issue).

## Corrective Actions Taken

1. Rebased fix branch onto `origin/main`
2. Restored Execute Swap and Validate Request jsCode from `main`
3. Deleted local `master` branch
4. Redeployed corrected workflow to production (new ID: `CAZFI4ijkMAPlOgM`)
5. Verified deployment: real Appwrite IDs, cancel flow, full code length

## Prevention

- **Branch policy:** Default branch is `main`. Do not use `master`. This is noted in both `CLAUDE.md` and `n8n/CLAUDE.md`.
- **Always verify branch before starting work:** Run `git branch` and confirm you're on `main` or a feature branch off `main`.
- **Compare against `origin/main` before deploying:** When modifying workflow files, diff key Code nodes against the main branch to catch regressions.

## How to Investigate If This Causes a Future Issue

If a workflow feature that was previously working stops working:

1. **Check the Swap Executor workflow ID** — It changed from `ZR4TxTnvPIDzzpTo` to `CAZFI4ijkMAPlOgM` during this incident. If you see the old ID referenced anywhere, that's stale.

2. **Verify Execute Swap code length on production:**
   ```bash
   ssh root@aw.smartpiggies.cloud "docker exec n8n n8n export:workflow --id=CAZFI4ijkMAPlOgM" | \
     python3 -c "import sys,json; wf=json.load(sys.stdin); wf=wf[0] if isinstance(wf,list) else wf; code=[n for n in wf['nodes'] if n['name']=='Execute Swap'][0]['parameters']['jsCode']; print(len(code),'chars')"
   ```
   Expected: ~19,400 chars. If significantly less, the simplified version may have been redeployed.

3. **Check for GatewaySwapReceiver references:**
   ```bash
   ssh root@aw.smartpiggies.cloud "docker exec n8n n8n export:workflow --id=CAZFI4ijkMAPlOgM" | \
     grep -c "GatewaySwapReceiver"
   ```
   Expected: 1 or more. If 0, live-mode code is missing.

4. **Compare against the repo source of truth:**
   ```bash
   # Export production workflow
   ssh root@aw.smartpiggies.cloud "docker exec n8n n8n export:workflow --id=CAZFI4ijkMAPlOgM" > /tmp/prod.json

   # Compare Execute Swap jsCode with repo
   python3 -c "
   import json
   with open('/tmp/prod.json') as f: prod = json.load(f)
   with open('n8n/workflows/swap-executor.json') as f: repo = json.load(f)
   prod = prod[0] if isinstance(prod, list) else prod
   for name in ['Execute Swap', 'Validate Request']:
       p = [n for n in prod['nodes'] if n['name']==name][0]['parameters']['jsCode']
       r = [n for n in repo['nodes'] if n['name']==name][0]['parameters']['jsCode']
       match = 'MATCH' if p == r else 'MISMATCH'
       print(f'{name}: {match} (prod={len(p)}, repo={len(r)})')
   "
   ```

5. **Check docker-compose.yml backup files** on the server:
   - `/root/n8n/docker-compose.yml.backup` — Original pre-treasury config
   - `/root/n8n/docker-compose.yml.bak` — Pre-extra_hosts config (has all env vars)

## Related Files

- `n8n/workflows/swap-executor.json` — The corrected workflow (20 nodes)
- `docs/swap-executor-appwrite-fix.md` — Details of the Appwrite integration fix
- `n8n/CLAUDE.md` — n8n workflow documentation
- PR #9 — The fix PR that was merged
