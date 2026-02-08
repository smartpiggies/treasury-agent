# HackMoney 2026 — Partner Prize Application

**Project:** PigAiBank
**Repo:** https://github.com/smartpiggies/treasury-agent
**Dashboard:** https://treasury-agent.sites.smartpiggies.cloud

> We select up to 3 Partner Prizes. Each partner may have multiple tracks — selecting a partner makes us eligible for all their tracks.

---

## Partner 1: Circle/Arc

### Track A: Best Chain Abstracted USDC Apps ($5,000)

**How we use it:** PigAiBank uses Circle Arc Gateway as the backbone for chain-abstracted USDC treasury management — users see one unified balance across Ethereum, Arbitrum, and Base, and can instantly move USDC cross-chain via Discord commands or the dashboard with EIP-712 BurnIntent signing. We also built a GatewaySwapReceiver smart contract that atomically mints USDC on the destination chain and swaps it via Uniswap in a single transaction.

### Track B: Global Payouts & Treasury Systems ($2,500)

**How we use it:** PigAiBank enables Discord-triggered USDC payouts to any address or ENS name across Ethereum, Arbitrum, and Base — the agent resolves recipients, picks the optimal cross-chain route, and executes settlement, making it a natural fit for family/team treasury disbursements.

**Code link:** https://github.com/smartpiggies/treasury-agent/blob/main/contracts/src/GatewaySwapReceiver.sol

### All code locations

| File | What it does |
|------|-------------|
| `contracts/src/GatewaySwapReceiver.sol` | On-chain atomic Gateway mint → Uniswap swap contract |
| `dashboard/src/lib/contracts.ts` | Gateway Wallet/Minter addresses, ABIs, CCTP domain IDs |
| `dashboard/src/lib/gateway-transfer.ts` | EIP-712 BurnIntent signing, Circle `/v1/transfer` API |
| `dashboard/src/hooks/useGatewayBalance.ts` | Multi-chain unified balance via `/v1/balances` |
| `dashboard/src/hooks/useGatewayDeposit.ts` | ERC-20 approve + `deposit()` flow |
| `dashboard/src/hooks/useGatewaySwap.ts` | BurnIntent + GatewaySwapReceiver atomic mint+swap |
| `n8n/workflows/swap-executor.json` | Gateway routing logic, BurnIntent signing, gatewayMint in n8n Code nodes |

### Ease of use: 6/10

The API itself is clean, but EIP-712 signing for BurnIntent was painful to get right — the domain/types spec isn't well-documented. The REST API auth (`Bearer` header) wasn't obvious at first. The `deposit()` function attributing funds to `msg.sender` rather than supporting a beneficiary parameter created friction for shared treasury deposits. Testnet coverage was limited during our build.

### Feedback

- A beneficiary parameter on `deposit()` would unlock shared treasury use cases (any address depositing on behalf of the treasury).
- EIP-712 domain and BurnIntent type documentation could be more prominent — we had to reverse-engineer it from contract source.
- An SDK or reference implementation for the BurnIntent signing flow would save significant developer time.

---

## Partner 2: Uniswap

### Track: v4 Agentic Finance ($5,000)

**How we use it:** PigAiBank is a Discord-native AI agent that autonomously executes Uniswap swaps based on natural language commands — users say "swap 0.01 ETH to USDC on Arbitrum" and the agent validates, routes, fetches pool data from the Uniswap v3 subgraph via The Graph, builds SwapRouter02 multicalls (exactInputSingle + unwrapWETH9), and executes on-chain with slippage protection. The agent handles the full lifecycle: intent parsing, pool discovery, price estimation, execution, and status tracking.

**Code link:** https://github.com/smartpiggies/treasury-agent/blob/main/dashboard/src/lib/uniswap.ts#L92

### All code locations

| File | What it does |
|------|-------------|
| `dashboard/src/lib/uniswap.ts` | v3 path encoding, SwapRouter02 command building, pool fee selection |
| `n8n/workflows/swap-executor.json` | Subgraph pool queries (4 chains), SwapRouter02 ABI, multicall execution with ethers.js, 0.5% slippage calc |
| `contracts/src/GatewaySwapReceiver.sol` | Atomic Gateway mint → Uniswap swap in one tx |
| `dashboard/src/components/swap/SwapModal.tsx` | Uniswap route detection and UI |

**Subgraph IDs used:**
- Base: `43Hwfi3dJSoGpyas9VwNoDAv55yjgGrPpNSmbQZArzMG`
- Arbitrum: `FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM`
- Optimism: `Cghf4LfVqPiFw6fp6Y5X5Ubc8UpmUhSfJL82zwiBFLaj`
- Ethereum: `5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`

### Ease of use: 7/10

SwapRouter02 is well-documented and the multicall pattern (exactInputSingle + unwrapWETH9 + refundETH) works reliably. The v3 subgraph via The Graph decentralized network is solid for pool discovery and pricing. Main friction: figuring out the right ABI encoding for the Universal Router vs SwapRouter02 (we went with SwapRouter02 for simplicity). Pool fee tier selection (500 vs 3000 vs 10000) required some trial and error.

### Feedback

- Clearer guidance on when to use Universal Router vs SwapRouter02 would help — both appear in docs and it's not obvious which is recommended for new projects.
- A "best fee tier" endpoint or recommendation for a given token pair would simplify pool selection.
- The subgraph data is excellent — having pool TVL, volume, and pricing in one query is very useful for agent-driven routing.

---

## Partner 3: LI.FI

### Track A: Best AI x LI.FI Smart App ($2,000)

**How we use it:** PigAiBank's AI agent uses LI.FI as the cross-chain swap route when users request token conversions across chains — the agent's routing logic automatically selects LI.FI for cross-chain swaps with token conversion (vs Uniswap for same-chain, vs Circle for USDC-only), fetches quotes from the LI.FI API, handles ERC-20 approvals for the spender, and executes the transaction, all triggered by a Discord chat message.

### Track B: Best LI.FI-Powered DeFi Integration ($1,500)

**How we use it:** The dashboard's swap modal integrates LI.FI as part of a smart-routing system — it automatically selects LI.FI for cross-chain token conversions, displays the quote estimate, handles approvals, and executes, giving users a seamless one-click cross-chain swap experience.

**Code link:** https://github.com/smartpiggies/treasury-agent/blob/main/dashboard/src/lib/lifi.ts#L56

### All code locations

| File | What it does |
|------|-------------|
| `dashboard/src/lib/lifi.ts` | `/v1/quote` endpoint, integrator ID, token address resolution, native ETH detection |
| `dashboard/src/hooks/useLIFISwap.ts` | Quote fetching, ERC-20 approval, tx execution |
| `n8n/workflows/swap-executor.json` | LI.FI route selection logic, quote fetching, approval + execution in Code node |
| `scripts/test-lifi.js` | Integration test script |
| `dashboard/src/components/swap/SwapModal.tsx` | LI.FI route display and cross-chain swap UI |

### Ease of use: 9/10

LI.FI has the best DX of all the integrations. The `/v1/quote` endpoint returns everything you need in one call — the `transactionRequest` object can be sent directly to the chain. The spender address for approvals is included in the response. Native token address convention (`0xEeee...`) is clear. Documentation is excellent. Only minor issue: needed to handle the ERC-20 approval step separately, but that's standard.

### Feedback

- Best developer experience of any protocol we integrated. The single-call quote → transactionRequest pattern is ideal for agent-driven execution.
- Including the spender address in the quote response is a thoughtful touch that saves an extra API call.
- Would love to see a streaming/webhook option for long-running cross-chain transfers so agents can track status without polling.

---

## Not applying for (and why)

| Partner | Track | Reason |
|---------|-------|--------|
| Circle/Arc | Agentic Commerce with RWAs ($2,500) | We don't use RWA collateral |
| Uniswap | v4 Privacy DeFi ($5,000) | No privacy-enhancing features |
| LI.FI | Best Composer Use in DeFi ($2,500) | We use the REST API, not the Composer SDK |
| ENS | Integrate ENS ($3,500) | Real integration but thinner than our top 3 — backup option |
| ENS | Most Creative DeFi Use ($1,500) | We only use basic name resolution, not text records/content hash |
