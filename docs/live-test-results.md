# Live Swap Test Results

> All three swap execution routes tested with real USDC on mainnet L2s (Arbitrum, Base).
> Tests conducted February 2026.

## Summary

| Route | Type | Chains | Amount | Gas Cost | Output | Status |
|-------|------|--------|--------|----------|--------|--------|
| [Uniswap](#uniswap--same-chain-swap) | Same-chain swap | Arbitrum | 1 USDC → ETH | $0.007 | 0.00048 WETH | Success |
| [LI.FI](#lifi--cross-chain-swap) | Cross-chain swap | Arbitrum → Base | 1 USDC → USDC | $0.02 | 0.9975 USDC | Success |
| [Circle Gateway](#circle-gateway--cross-chain-usdc-transfer) | Cross-chain transfer | Arbitrum → Base | 1 USDC | ~$0 | 1 USDC | Success |

**Total test cost**: ~$3 in tokens + $0.03 in gas fees.

All transactions are verified on-chain via the block explorer links below.

---

## Smart Routing Logic

The agent automatically selects the optimal route based on the request:

```
          User Request
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
Same chain?  Cross chain? USDC-only
    │          │        cross-chain?
    ▼          ▼          ▼
 UNISWAP    LI.FI     CIRCLE
            		   GATEWAY
 Fastest,   Best       Instant,
 cheapest   bridge     <500ms
            routing
```

- **Same-chain swap** (e.g., USDC → ETH on Arbitrum) → **Uniswap**
- **Cross-chain swap** (e.g., USDC on Arbitrum → ETH on Base) → **LI.FI**
- **USDC between chains** (e.g., USDC Arbitrum → USDC Base) → **Circle Gateway**

---

## Uniswap — Same-Chain Swap

**Bounty**: Uniswap v4 Agentic Finance ($5,000)

Uniswap handles same-chain token swaps — the fastest and cheapest option when source and destination are on the same network.

### Transaction

| Field | Value |
|-------|-------|
| TX Hash | [`0x2a5fc9c0c91199209398cfbb4793b9e93085d85ae4dcbebe098ec49142dd713d`](https://arbiscan.io/tx/0x2a5fc9c0c91199209398cfbb4793b9e93085d85ae4dcbebe098ec49142dd713d) |
| Chain | Arbitrum |
| From | `pigaibank.eth` (0xc3c68a5d6607b26D60ADc4925e08788778989314) |
| Router | SwapRouter02 (0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45) |
| Input | 1 USDC |
| Output | 0.000480266576959973 WETH (~$1.08) |
| Gas Used | 153,824 |
| Gas Cost | ~$0.007 |

### Test Command

```bash
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "arbitrum",
    "sourceToken": "USDC",
    "destToken": "ETH",
    "amount": "1"
  }'
```

### How It Works

1. Agent receives swap request and detects same-chain (Arbitrum → Arbitrum)
2. Routes to Uniswap — fetches optimal pool fee tier from The Graph subgraph
3. Approves USDC spend to SwapRouter02 (ERC-20 `approve` with MaxUint256)
4. Calls `exactInputSingle()` on SwapRouter02 with USDC→WETH pool
5. Records execution in Appwrite database
6. Reports result to Discord

### Key Technical Details

- Uses **SwapRouter02** (not Universal Router, which requires Permit2 setup)
- Pool fee tier is **dynamically fetched** from Uniswap v3 subgraph via The Graph decentralized network — not hardcoded
- Price data also comes from The Graph (ETH/USDC pool `sqrtPriceX96`)

---

## LI.FI — Cross-Chain Swap

**Bounty**: Best AI x LI.FI Smart App ($2,000)

LI.FI handles cross-chain swaps by automatically finding the best bridge and route across chains.

### Transaction

| Field | Value |
|-------|-------|
| TX Hash | [`0xc30d44a155374d0545ea882722921fc00c41afdd719bbabc154641b62bad1207`](https://arbiscan.io/tx/0xc30d44a155374d0545ea882722921fc00c41afdd719bbabc154641b62bad1207) |
| Source Chain | Arbitrum |
| Dest Chain | Base |
| From | `pigaibank.eth` (0xc3c68a5d6607b26D60ADc4925e08788778989314) |
| Router | LiFi Diamond (0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE) |
| Input | 1 USDC (Arbitrum) |
| Output | 0.9975 USDC (Base) |
| Bridge | Mayan + Circle CCTP |
| Gas Used | 419,181 |
| Gas Cost | ~$0.02 |

### Test Command

```bash
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "base",
    "sourceToken": "USDC",
    "destToken": "USDC",
    "amount": "1"
  }'
```

### How It Works

1. Agent receives swap request and detects cross-chain (Arbitrum → Base)
2. Routes to LI.FI — requests a quote from the LI.FI API with source/dest chains and tokens
3. LI.FI returns the optimal route (in this case: Mayan bridge + Circle CCTP)
4. Checks ERC-20 allowance for LiFi Diamond contract; approves MaxUint256 if needed
5. Sends the transaction with LI.FI-provided calldata
6. LI.FI handles bridging and delivers tokens on the destination chain
7. Records execution in Appwrite and reports to Discord

### Key Technical Details

- **ERC-20 approval flow**: Checks existing allowance before every swap, approves only if insufficient — this was the root cause of initial failures (missing approval, not calldata issues)
- **Route auto-selection**: LI.FI SDK picks the optimal bridge protocol automatically
- Supports any token pair across any supported chain — not limited to USDC

---

## Circle Gateway — Cross-Chain USDC Transfer

**Bounty**: Circle/Arc Chain Abstracted USDC Apps ($5,000)

Circle Gateway provides instant (<500ms) cross-chain USDC transfers using a burn-and-mint mechanism. This is the fastest option for moving USDC between chains.

### Transaction

| Field | Value |
|-------|-------|
| TX Hash (Mint) | [`0x229536792918033e38818965745029162c91fbb990183f1d86cca5752f9861f7`](https://basescan.org/tx/0x229536792918033e38818965745029162c91fbb990183f1d86cca5752f9861f7) |
| Source Chain | Arbitrum |
| Dest Chain | Base |
| From | `pigaibank.eth` (0xc3c68a5d6607b26D60ADc4925e08788778989314) |
| Contract | GatewayMinter (0x2222222d7164433c4C09B0b0D809a9b52C04C205) |
| Amount | 1 USDC |
| Transfer Time | <500ms |

### Test Command

```bash
curl -X POST https://n8n.smartpiggies.cloud/webhook/swap-executor \
  -H "Content-Type: application/json" \
  -d '{
    "sourceChain": "arbitrum",
    "destChain": "base",
    "sourceToken": "USDC",
    "destToken": "USDC",
    "amount": "1"
  }'
```

### How It Works

1. Agent receives transfer request and detects USDC→USDC cross-chain
2. Routes to Circle Gateway — the fastest option for same-token cross-chain
3. Signs a `BurnIntent` using EIP-712 typed data (burns USDC on source chain)
4. Submits to Circle Gateway API — receives attestation + signature **synchronously** (no polling)
5. Calls `gatewayMinter.gatewayMint(attestation, signature)` on the destination chain
6. USDC is minted on Base — transfer complete in <500ms

### Key Technical Details

- **Chain-abstracted balance**: Circle Gateway provides a unified USDC view across Ethereum, Arbitrum, and Base
- **Instant attestation**: Unlike CCTP (which requires polling), Gateway returns the attestation synchronously
- **EIP-712 signing**: Domain is `{ name: "GatewayWallet", version: "1" }` with no chainId or verifyingContract
- **API format**: POST body is an **array** `[{ burnIntent, signature }]`, not a single object
- **destinationContract** must be GatewayMinter (`0x2222...`), not GatewayWallet (`0x7777...`)

---

## Bounty Mapping

| Bounty | Prize | Route Used | Evidence |
|--------|-------|------------|----------|
| **Circle/Arc** — Chain Abstracted USDC Apps | $5,000 | Circle Gateway | Instant burn+mint USDC transfer Arb→Base |
| **Uniswap** — v4 Agentic Finance | $5,000 | Uniswap | AI agent executes same-chain swap via SwapRouter02 |
| **LI.FI** — Best AI x LI.FI Smart App | $2,000 | LI.FI | Cross-chain swap with auto-routing through LI.FI SDK |

**Total target: $12,000**

All three integrations are demonstrated with real mainnet transactions — no testnet, no mocks.

---

## Infrastructure

All workflows run on **self-hosted n8n** on a single VPS, with a custom Docker image providing `ethers@6` and `node-fetch@2` for on-chain transaction signing and execution. The AI agent handles the full lifecycle: parsing natural language requests, selecting the optimal route, executing on-chain transactions, recording results in Appwrite, and reporting back via Discord.
