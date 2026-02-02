# Treasury Ops Bot: A Learning-Focused Hackathon Project

**EthGlobal HackMoney 2026 — Team Learning Project**

---

## Project Philosophy

> **"Learn the tools, not win the hackathon."**

This project is designed to give our team hands-on experience with n8n workflow automation, Uniswap v4, Circle/Arc infrastructure, and LI.FI cross-chain aggregation. The goal is practical skill-building, not prize optimization.

---

## Table of Contents

1. [Overview](#overview)
2. [Partner Prize Strategy](#partner-prize-strategy)
3. [Learning Objectives](#learning-objectives)
4. [Project Scope](#project-scope)
5. [Workflow Details](#workflow-details)
6. [Technology Deep Dives](#technology-deep-dives)
7. [Execution Layer Design Decision](#execution-layer-design-decision)
8. [72-Hour Learning Plan](#72-hour-learning-plan)
9. [Team Roles](#team-roles)
10. [Success Metrics](#success-metrics)
11. [Starter Resources](#starter-resources)
12. [Appendix: Code Snippets](#appendix-code-snippets)

---

## Overview

### What We're Building

A simple n8n-orchestrated treasury management system that:

- Monitors DeFi positions on Uniswap
- Tracks USDC balances via Circle/Arc
- Generates automated reports
- Executes basic treasury operations
- Sends notifications to Discord/Slack

### Why These Technologies?

| Technology | Industry Relevance | Why Learn It |
|------------|-------------------|--------------|
| **n8n** | Workflow automation is everywhere; DeFi ops teams use it daily | Visual, low-code, transferable skills |
| **Uniswap** | Largest DEX, v4 Hooks are the future of DeFi customization | Industry standard, well-documented |
| **Circle/Arc** | USDC is the dominant stablecoin; Circle is infrastructure backbone | Enterprise-grade APIs, real-world patterns |
| **LI.FI** | Leading bridge aggregator, powers cross-chain in 100+ apps | Cross-chain is essential; single API for all bridges |

### What We're NOT Doing

- Chasing novel/innovative ideas
- Optimizing for maximum prize money
- Building production-ready infrastructure
- Competing with existing solutions

---

## Partner Prize Strategy

> **For Application Reference**: This section documents which partner prizes we're targeting and how our project aligns with their requirements.

We are applying for **three partner prizes** that align naturally with our treasury management use case:

### Target Prizes Overview

| Partner | Prize Category | Amount | Our Fit |
|---------|---------------|--------|---------|
| **Circle** | Global Payouts & Treasury Systems | $2,500 | ⭐ Primary — exact match |
| **Circle** | Best Chain Abstracted USDC Apps | $5,000 | ⭐ Strong — using Gateway |
| **LI.FI** | Best AI × LI.FI Smart App | $2,000 | ⭐ Strong — agent architecture |
| **Uniswap** | Uniswap v4 Agentic Finance | $5,000 | ✓ Good — agent + v4 data |

---

### Circle: Global Payouts & Treasury Systems ($2,500)

**Prize Description**: "Automated multi-recipient settlement with USDC on Arc"

**Why We Qualify**:

| Requirement | How We Meet It |
|-------------|----------------|
| Automated settlement | n8n workflows execute treasury operations automatically |
| Multi-recipient | Workflow supports batch transfers to multiple addresses |
| USDC on Arc | Circle Gateway integration with Arc as supported chain |
| Treasury focus | Core project purpose is treasury management |

**Key Features to Highlight**:
- Automated daily treasury reporting with balance aggregation
- Scheduled rebalancing operations across wallets
- Multi-recipient payout workflow for contributor payments
- Integration with Circle Gateway for <500ms settlement

**Application Talking Points**:
> "Treasury Ops Bot automates the operational burden of multi-chain treasury management. Using Circle Gateway, we provide unified USDC visibility across 11 chains and execute automated settlements to multiple recipients—exactly the infrastructure DAOs and protocols need for contributor payouts and operational expenses."

---

### Circle: Best Chain Abstracted USDC Apps Using Arc ($5,000)

**Prize Description**: "Build apps treating multiple chains as unified liquidity; crosschain payments/credit systems"

**Why We Qualify**:

| Requirement | How We Meet It |
|-------------|----------------|
| Chain abstraction | Circle Gateway provides unified USDC balance |
| Multiple chains as one | Single balance view across 11 EVM chains |
| Crosschain payments | Gateway enables <500ms cross-chain transfers |
| Arc integration | Arc is a Gateway-supported destination chain |

**Key Features to Highlight**:
- **Unified Balance Dashboard**: Single view of USDC across Ethereum, Arbitrum, Base, Polygon, etc.
- **Chain-Agnostic Operations**: Workflows don't care which chain holds the USDC
- **Instant Rebalancing**: Move USDC between chains in <500ms via Gateway
- **No Pre-Positioned Liquidity**: Gateway eliminates need to park capital on each chain

**Technical Integration**:
```
┌─────────────────────────────────────────────────────────────────┐
│              CIRCLE GATEWAY CHAIN ABSTRACTION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│   │Ethereum │ │Arbitrum │ │  Base   │ │   Arc   │  ...more     │
│   │  USDC   │ │  USDC   │ │  USDC   │ │  USDC   │              │
│   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘              │
│        │           │           │           │                    │
│        └───────────┴─────┬─────┴───────────┘                    │
│                          │                                      │
│                          ▼                                      │
│               ┌─────────────────────┐                           │
│               │   CIRCLE GATEWAY    │                           │
│               │  Unified Balance:   │                           │
│               │    $1,247,500       │                           │
│               └──────────┬──────────┘                           │
│                          │                                      │
│                          ▼                                      │
│               ┌─────────────────────┐                           │
│               │  TREASURY OPS BOT   │                           │
│               │  Single API call    │                           │
│               │  sees total across  │                           │
│               │  all chains         │                           │
│               └─────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Application Talking Points**:
> "Our Treasury Ops Bot treats USDC as a single, chain-agnostic asset. Through Circle Gateway integration, treasury managers see one unified balance regardless of which chains hold the actual tokens. When funds are needed on a specific chain, Gateway moves them in under 500 milliseconds—no bridging UX, no pre-positioned liquidity, no fragmented capital."

---

### LI.FI: Best AI × LI.FI Smart App ($2,000)

**Prize Description**: "For innovative AI-powered agents or smart apps using LI.FI as cross-chain execution layer. Examples: position management agents, rebalancing bots, arbitrage routing agents."

**Why We Qualify**:

| Requirement | How We Meet It |
|-------------|----------------|
| Agent/smart app | n8n-orchestrated autonomous treasury agent |
| Cross-chain execution | LI.FI handles all cross-chain swaps and bridges |
| Position management | Monitors and rebalances treasury positions |
| Clear strategy loop | Monitor → Decide → Execute → Report cycle |

**Our Agent Architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│              TREASURY AGENT LOOP (Agentic Architecture)          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      MONITOR                              │  │
│  │  • Query Uniswap pools for price data                     │  │
│  │  • Query Circle Gateway for unified USDC balance          │  │
│  │  • Track position values across chains                    │  │
│  │  Workflows: 1 (Daily Report), 2 (Price Monitor)           │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      DECIDE                               │  │
│  │  • Compare prices against configured thresholds           │  │
│  │  • Evaluate rebalancing conditions                        │  │
│  │  • Determine optimal execution path                       │  │
│  │  Logic: IF nodes, threshold comparisons, route selection  │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      EXECUTE                              │  │
│  │  • Same-chain swaps → Uniswap v4 direct                   │  │
│  │  • Cross-chain operations → LI.FI aggregator              │  │
│  │  • Multi-step DeFi → LI.FI Composer                       │  │
│  │  • USDC transfers → Circle Gateway (<500ms)               │  │
│  │  Workflow: 3 (Swap Executor)                              │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      REPORT                               │  │
│  │  • Send execution confirmations to Discord/Slack          │  │
│  │  • Log all actions to Google Sheets for audit             │  │
│  │  • Generate weekly performance summaries                  │  │
│  │  Workflows: 1, 4 (Reports), all workflows (notifications) │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   LI.FI AS EXECUTION LAYER                │  │
│  │                                                           │  │
│  │  • Aggregates 20+ bridges for optimal routing             │  │
│  │  • Composer enables multi-step DeFi in single tx          │  │
│  │  • Agent doesn't need to know bridge details              │  │
│  │  • Automatic fallback if primary bridge fails             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**LI.FI Integration Points**:

1. **Cross-Chain Swaps**: Any swap where source ≠ destination chain routes through LI.FI
2. **Bridge Aggregation**: LI.FI selects optimal bridge based on speed/cost/security
3. **Composer Workflows**: Multi-step operations (swap + bridge + deposit) in single transaction
4. **Fallback Handling**: If one bridge fails, LI.FI automatically routes through alternatives

**Application Talking Points**:
> "Treasury Ops Bot is an autonomous treasury agent built on n8n workflow automation. It implements the classic agent loop—Monitor, Decide, Execute, Report—with LI.FI serving as the cross-chain execution layer. The agent monitors positions via Uniswap data, makes decisions based on configurable thresholds, and executes through LI.FI which abstracts away bridge complexity. LI.FI Composer enables sophisticated multi-step rebalancing operations in single atomic transactions."

---

### Uniswap: v4 Agentic Finance ($5,000)

**Prize Description**: "Agent-driven financial systems using Uniswap v4 pools for liquidity management and trade execution"

**Why We Qualify**:

| Requirement | How We Meet It |
|-------------|----------------|
| Agent-driven | Autonomous n8n workflows with decision logic |
| Uniswap v4 | v4 subgraph queries, v4 pool interactions |
| Liquidity management | Price monitoring, swap execution |
| Trade execution | Direct Uniswap swaps for same-chain operations |

**Uniswap v4 Integration**:

1. **Price Data**: Query v4 pools via subgraph for real-time pricing
2. **Same-Chain Swaps**: Execute directly through Uniswap v4 router
3. **Pool Monitoring**: Track liquidity depth and volume for treasury pairs
4. **Optional Enhancement**: TWAMM hook for large treasury conversions

**v4-Specific Features**:
```
┌─────────────────────────────────────────────────────────────────┐
│                 UNISWAP V4 INTEGRATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DATA LAYER (Subgraph)                                          │
│  ─────────────────────                                          │
│  • Pool prices (token0Price, token1Price)                       │
│  • Liquidity depth for slippage estimation                      │
│  • 24h volume for activity monitoring                           │
│  • Historical data for trend analysis                           │
│                                                                 │
│  EXECUTION LAYER (Direct)                                       │
│  ─────────────────────────                                      │
│  • Same-chain swaps via Universal Router                        │
│  • Optimal routing through v4 singleton                         │
│  • Gas-efficient execution (99% cheaper pool creation)          │
│                                                                 │
│  OPTIONAL: TWAMM HOOK                                           │
│  ─────────────────────────                                      │
│  • Time-weighted execution for large treasury swaps             │
│  • Reduces price impact on conversions >$10k                    │
│  • Spreads execution over configurable time period              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Application Talking Points**:
> "Treasury Ops Bot uses Uniswap v4 as its primary on-chain data source and same-chain execution venue. Our agent queries v4 pools for real-time pricing, monitors liquidity conditions, and executes treasury swaps directly through Uniswap when operating within a single chain. The agent-driven architecture—automated monitoring, threshold-based decisions, and programmatic execution—exemplifies the 'agentic finance' paradigm that v4's flexible architecture enables."

---

### Prize Requirements Checklist

**All Prizes Require**:
```
☑ Functional code with transaction IDs (testnet acceptable)
☑ GitHub repository with README
☑ Demo video (3 minutes)
☑ Architecture diagram
```

**Circle-Specific**:
```
☑ Circle Gateway integration (not just basic Wallet API)
☑ USDC operations
☑ Clear product documentation
```

**LI.FI-Specific**:
```
☑ LI.FI SDK or API for cross-chain actions
☑ Support minimum 2 EVM chains
☑ Working frontend (our n8n dashboard qualifies)
☑ For AI track: clear strategy loop documentation
```

**Uniswap-Specific**:
```
☑ Uniswap v4 integration (subgraph + execution)
☑ Functional demo with transaction IDs
☑ Agent-driven architecture
```

---

## Learning Objectives

### n8n Mastery Goals

By the end of this hackathon, every team member should be able to:

```
□ Create a workflow from scratch
□ Use cron triggers for scheduled tasks
□ Use webhook triggers for on-demand execution
□ Make authenticated HTTP requests to external APIs
□ Transform and manipulate data between nodes
□ Implement conditional logic (IF/Switch nodes)
□ Connect to notification services (Discord, Slack, Email)
□ Handle errors gracefully with retry logic
□ Debug workflows using execution history
□ Export and share workflows with others
```

### Uniswap Knowledge Goals

```
□ Understand how AMM pools work conceptually
□ Read pool state (price, liquidity, tick)
□ Query historical data via subgraph (GraphQL)
□ Understand the difference between v3 and v4
□ Know what Hooks are and why they matter
□ Build a swap transaction (even if not executed)
□ Understand concentrated liquidity basics
```

### Circle Gateway & Arc Competency Goals

```
□ Set up a Circle developer account and get API credentials
□ Understand chain abstraction concept and why it matters
□ Deposit USDC to Gateway Wallet contract
□ Query unified balance across all supported chains (single API call)
□ Construct and sign burn intents (EIP-712)
□ Request attestations from Gateway API
□ Execute cross-chain transfer in <500ms
□ Understand Gateway vs basic Wallet API tradeoffs
□ Know what Arc is and its role as USDC-native settlement layer
```

### LI.FI Cross-Chain Goals

```
□ Understand bridge aggregation vs direct bridges
□ Make authenticated LI.FI API calls
□ Request and compare quotes across bridges
□ Execute a cross-chain swap via LI.FI
□ Poll transaction status across chains
□ Understand speed vs cost vs security tradeoffs
□ Know when to use LI.FI vs direct Uniswap vs Circle Gateway
□ Understand Composer for multi-step DeFi operations
□ Build a Composer workflow (swap + bridge + deposit)
```

---

## Project Scope

### Four Workflows

```
┌─────────────────────────────────────────────────────────────────┐
│                    TREASURY OPS BOT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  WORKFLOW 1: Daily Treasury Report                        │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Trigger: Cron (9:00 AM daily)                            │ │
│  │                                                           │ │
│  │  What it does:                                            │ │
│  │  • Query USDC balance from Circle wallet                  │ │
│  │  • Query ETH/USDC price from Uniswap pool                 │ │
│  │  • Calculate total portfolio value                        │ │
│  │  • Format a nice report                                   │ │
│  │  • Send to Discord channel                                │ │
│  │                                                           │ │
│  │  n8n skills: Cron, HTTP Request, Set, Code, Discord       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  WORKFLOW 2: Price Alert Monitor                          │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Trigger: Interval (every 5 minutes)                      │ │
│  │                                                           │ │
│  │  What it does:                                            │ │
│  │  • Fetch current ETH/USDC price from Uniswap              │ │
│  │  • Compare to configured thresholds                       │ │
│  │  • If price crosses threshold, send alert                 │ │
│  │  • Log all prices to Google Sheet for history             │ │
│  │                                                           │ │
│  │  n8n skills: Interval, IF node, Google Sheets, Alerts     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  WORKFLOW 3: Manual Swap Executor                         │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Trigger: Webhook (called manually or via button)         │ │
│  │                                                           │ │
│  │  What it does:                                            │ │
│  │  • Receive swap parameters (token, amount, direction)     │ │
│  │  • Get quote from Uniswap                                 │ │
│  │  • Build transaction calldata                             │ │
│  │  • Execute via Circle wallet (testnet)                    │ │
│  │  • Wait for confirmation                                  │ │
│  │  • Send success/failure notification                      │ │
│  │                                                           │ │
│  │  n8n skills: Webhook, sequential HTTP, Wait, Response     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  WORKFLOW 4: Weekly Performance Summary                   │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  Trigger: Cron (Monday 8:00 AM)                           │ │
│  │                                                           │ │
│  │  What it does:                                            │ │
│  │  • Read price history from Google Sheet                   │ │
│  │  • Calculate weekly high, low, average                    │ │
│  │  • Compare to previous week                               │ │
│  │  • Generate summary statistics                            │ │
│  │  • Send formatted report via email                        │ │
│  │                                                           │ │
│  │  n8n skills: Date handling, aggregation, Email node       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Workflow Details

### Workflow 1: Daily Treasury Report

**Purpose**: Learn scheduled triggers, API calls, data formatting, and notifications.

#### n8n Node Configuration

```
[Cron Trigger] → [HTTP: Circle Balance] → [HTTP: Uniswap Price] 
       ↓
[Merge Data] → [Code: Format Report] → [Discord: Send Message]
```

#### Node-by-Node Breakdown

**1. Cron Trigger**
```
Settings:
  Mode: Every Day
  Hour: 9
  Minute: 0
  Timezone: America/Los_Angeles (or your timezone)
```

**2. HTTP Request: Circle Balance**
```
Settings:
  Method: GET
  URL: https://api.circle.com/v1/wallets/{{walletId}}/balances
  Authentication: Header Auth
  Header Name: Authorization
  Header Value: Bearer {{circleApiKey}}
```

**3. HTTP Request: Uniswap Price**
```
Settings:
  Method: POST
  URL: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
  Body (JSON):
  {
    "query": "{ pool(id: \"0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8\") { token0Price token1Price } }"
  }
```

**4. Code Node: Format Report**
```javascript
const circleBalance = $('HTTP: Circle Balance').first().json;
const uniswapData = $('HTTP: Uniswap Price').first().json;

const usdcBalance = circleBalance.data.balances.find(b => b.currency === 'USD')?.amount || '0';
const ethPrice = uniswapData.data.pool.token0Price;

const report = `
📊 **Daily Treasury Report**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 USDC Balance: $${parseFloat(usdcBalance).toLocaleString()}
📈 ETH Price: $${parseFloat(ethPrice).toFixed(2)}
⏰ Generated: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

return { report, usdcBalance, ethPrice };
```

**5. Discord Node**
```
Settings:
  Resource: Message
  Operation: Send
  Webhook URL: {{discordWebhookUrl}}
  Text: ={{$json.report}}
```

---

### Workflow 2: Price Alert Monitor

**Purpose**: Learn polling, conditional logic, and data logging.

#### n8n Node Configuration

```
[Interval Trigger] → [HTTP: Get Price] → [IF: Above Threshold?]
                                               ↓ Yes
                                         [Discord: Alert]
                                               ↓
                                    [Google Sheets: Log]
```

#### Node-by-Node Breakdown

**1. Interval Trigger**
```
Settings:
  Interval: 5
  Unit: Minutes
```

**2. IF Node: Check Threshold**
```
Settings:
  Conditions:
    - Value 1: ={{$json.price}}
    - Operation: Larger
    - Value 2: 3500
  
  (Also add a second IF for "lower than" threshold)
```

**3. Google Sheets: Log Price**
```
Settings:
  Operation: Append Row
  Document: Treasury Price Log
  Sheet: Prices
  Columns:
    - Timestamp: ={{$now.toISOString()}}
    - Price: ={{$json.price}}
    - Alert Triggered: ={{$json.alertTriggered}}
```

---

### Workflow 3: Manual Swap Executor

**Purpose**: Learn webhooks, transaction building, and async confirmation.

#### n8n Node Configuration

```
[Webhook Trigger] → [HTTP: Get Quote] → [Code: Build Tx] 
        ↓
[HTTP: Submit Tx] → [Wait: 30 sec] → [HTTP: Check Status]
        ↓
[IF: Success?] → [Discord: Notify]
```

#### Webhook Input Schema

```json
{
  "tokenIn": "USDC",
  "tokenOut": "ETH",
  "amountIn": "1000",
  "maxSlippage": "0.5"
}
```

#### Response Schema

```json
{
  "success": true,
  "transactionHash": "0x...",
  "amountOut": "0.285",
  "executedPrice": "3508.77"
}
```

---

### Workflow 4: Weekly Performance Summary

**Purpose**: Learn date manipulation, aggregation, and email formatting.

#### n8n Node Configuration

```
[Cron: Monday 8am] → [Google Sheets: Read Week] → [Code: Aggregate]
        ↓
[Code: Format Email] → [Email: Send Summary]
```

#### Aggregation Code

```javascript
const prices = $input.all().map(item => parseFloat(item.json.Price));

const stats = {
  high: Math.max(...prices),
  low: Math.min(...prices),
  average: prices.reduce((a, b) => a + b, 0) / prices.length,
  volatility: ((Math.max(...prices) - Math.min(...prices)) / prices[0] * 100).toFixed(2),
  dataPoints: prices.length
};

return stats;
```

---

## Technology Deep Dives

### n8n Fundamentals

#### Core Concepts

```
┌─────────────────────────────────────────────────────────────────┐
│                    n8n MENTAL MODEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRIGGERS (Start a workflow)                                    │
│  ├── Cron: Run on schedule                                      │
│  ├── Webhook: Run when called via HTTP                          │
│  ├── Interval: Run every N minutes                              │
│  └── Manual: Run when you click "Execute"                       │
│                                                                 │
│  ACTION NODES (Do something)                                    │
│  ├── HTTP Request: Call external APIs                           │
│  ├── Code/Function: Write custom JavaScript                     │
│  ├── Set: Transform/rename data fields                          │
│  └── Service nodes: Discord, Slack, Email, Google Sheets, etc.  │
│                                                                 │
│  FLOW CONTROL (Make decisions)                                  │
│  ├── IF: Branch based on condition                              │
│  ├── Switch: Multiple branches based on value                   │
│  ├── Merge: Combine data from multiple branches                 │
│  └── Wait: Pause execution for time or webhook                  │
│                                                                 │
│  DATA FLOW                                                      │
│  ├── Each node outputs JSON                                     │
│  ├── Next node receives previous node's output                  │
│  ├── Use expressions: ={{$json.fieldName}}                      │
│  └── Access other nodes: ={{$('Node Name').first().json}}       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Common Patterns

**Pattern 1: API Call + Transform + Notify**
```
[Trigger] → [HTTP Request] → [Code: Transform] → [Notification]
```

**Pattern 2: Conditional Alerting**
```
[Trigger] → [HTTP Request] → [IF: Condition?] 
                                   ├── Yes → [Alert]
                                   └── No → [Log Only]
```

**Pattern 3: Sequential API Calls**
```
[Trigger] → [HTTP: Step 1] → [HTTP: Step 2] → [HTTP: Step 3] → [Done]
```

**Pattern 4: Parallel Fetching + Merge**
```
[Trigger] ─┬─► [HTTP: API 1] ──┐
           │                   ├──► [Merge] → [Process]
           └─► [HTTP: API 2] ──┘
```

---

### Uniswap v4 Basics

#### How Uniswap Works (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNISWAP POOL                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  A pool holds two tokens (e.g., ETH and USDC)                   │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │      ETH        │     │      USDC       │                   │
│  │    500 ETH      │     │  1,500,000 USDC │                   │
│  └─────────────────┘     └─────────────────┘                   │
│                                                                 │
│  Price is determined by the ratio:                              │
│  1,500,000 / 500 = $3,000 per ETH                               │
│                                                                 │
│  When someone swaps:                                            │
│  • Buy 1 ETH → Pay USDC → ETH decreases, USDC increases         │
│  • Sell 1 ETH → Receive USDC → ETH increases, USDC decreases    │
│  • Price automatically adjusts based on new ratio               │
│                                                                 │
│  Liquidity Providers (LPs):                                     │
│  • Deposit both tokens into the pool                            │
│  • Earn fees from every swap (typically 0.3%)                   │
│  • Can withdraw their share anytime                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Data We'll Query

```
Pool Data:
├── token0Price: Price of token0 in terms of token1
├── token1Price: Price of token1 in terms of token0
├── liquidity: Total liquidity in the pool
├── tick: Current price tick (technical detail)
└── volumeUSD: Trading volume in USD

Position Data (if we have LP positions):
├── liquidity: How much liquidity we provided
├── tokensOwed0: Fees earned in token0
├── tokensOwed1: Fees earned in token1
└── tickLower/tickUpper: Our price range (v3/v4)
```

#### Subgraph Query Examples

```graphql
# Get current pool state
{
  pool(id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8") {
    token0 { symbol }
    token1 { symbol }
    token0Price
    token1Price
    liquidity
    volumeUSD
  }
}

# Get recent swaps
{
  swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
    amount0
    amount1
    amountUSD
    timestamp
  }
}
```

---

### Circle/Arc Fundamentals

#### Circle Gateway (Primary Integration)

Circle Gateway is our primary Circle integration—it provides **chain-abstracted USDC** with instant cross-chain transfers.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CIRCLE GATEWAY OVERVIEW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHAT IT DOES                                                   │
│  ─────────────────                                              │
│  • Unified USDC balance across 11 chains                        │
│  • Cross-chain transfers in <500 milliseconds                   │
│  • No pre-positioned liquidity required                         │
│  • Single API for all chain interactions                        │
│                                                                 │
│  SUPPORTED CHAINS                                               │
│  ─────────────────                                              │
│  Ethereum, Arbitrum, Base, Polygon, OP Mainnet, Avalanche,      │
│  ZKsync, Blast, Zora, World Chain, Unichain, + Arc (coming)     │
│                                                                 │
│  WHY GATEWAY OVER BASIC WALLET API                              │
│  ─────────────────────────────────                              │
│  Basic API: Query balance per chain, transfer takes minutes     │
│  Gateway:   Single unified balance, transfer in <500ms          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Gateway API Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                    GATEWAY API STRUCTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BASE URL                                                       │
│  ─────────────────                                              │
│  Testnet: https://gateway-api-testnet.circle.com/v1             │
│  Mainnet: https://gateway-api.circle.com/v1                     │
│                                                                 │
│  CORE ENDPOINTS                                                 │
│  ─────────────────                                              │
│                                                                 │
│  GET  /info                    Supported chains & contracts     │
│  POST /balances                Get unified balance (all chains) │
│  POST /transfer                Submit burn intent, get attestation│
│                                                                 │
│  TRANSFER FLOW (< 500ms total)                                  │
│  ─────────────────────────────                                  │
│  1. Deposit USDC to Gateway Wallet contract (one-time setup)    │
│  2. POST /transfer with signed burn intent                      │
│  3. Receive attestation instantly                               │
│  4. Call gatewayMint() on destination chain                     │
│  5. USDC available on destination in <500ms                     │
│                                                                 │
│  FEES                                                           │
│  ─────────────────                                              │
│  • 0.5 basis points (0.005%) during early access                │
│  • Base fee covers source chain gas                             │
│  • Early access period ends June 30, 2026                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Gateway Integration Code

```javascript
// n8n Code Node: Get Unified USDC Balance

const response = await fetch('https://gateway-api.circle.com/v1/balances', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${$env.CIRCLE_API_KEY}`
  },
  body: JSON.stringify({
    address: $env.TREASURY_ADDRESS
  })
});

const data = await response.json();

// Returns unified balance across ALL chains
return {
  unifiedBalance: data.balance,
  chains: data.chainBreakdown,  // Optional: per-chain details
  timestamp: new Date().toISOString()
};
```

```javascript
// n8n Code Node: Cross-Chain Transfer via Gateway

const burnIntent = {
  sourceDomain: 0,           // Ethereum
  destinationDomain: 6,      // Base
  amount: 1000000000,        // 1000 USDC (6 decimals)
  recipient: $env.RECIPIENT_ADDRESS,
  salt: crypto.randomBytes(32).toString('hex'),
  maxFee: 2010000            // 2.01 USDC max fee
};

// Sign the burn intent (EIP-712)
const signature = await signTypedData(burnIntent);

// Request attestation from Gateway
const response = await fetch('https://gateway-api.circle.com/v1/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${$env.CIRCLE_API_KEY}`
  },
  body: JSON.stringify({
    burnIntent,
    signature
  })
});

const { attestationPayload, attestationSignature } = await response.json();

// Execute mint on destination chain
// (This would be a separate HTTP call to your execution service)
return {
  attestationPayload,
  attestationSignature,
  destinationChain: 'Base',
  status: 'ready_to_mint'
};
```

#### Arc's Role

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARC BLOCKCHAIN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Arc is Circle's purpose-built L1 blockchain:                   │
│                                                                 │
│  • Native USDC: USDC is the native gas token (predictable fees) │
│  • Sub-second finality: ~780ms transaction confirmation         │
│  • Gateway integration: Supported as destination chain          │
│  • StableFX: Built-in institutional FX engine                   │
│                                                                 │
│  STATUS: Public testnet (mainnet expected 2026)                 │
│                                                                 │
│  FOR THIS PROJECT                                               │
│  ─────────────────                                              │
│  • Use Arc testnet as one of our multi-chain destinations       │
│  • Demonstrate Gateway transfers to/from Arc                    │
│  • Learn Circle's newest infrastructure                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Legacy Wallet API (Reference Only)

For operations not covered by Gateway, the basic Wallet API remains available:

```
GET  /v1/wallets                    List all wallets
GET  /v1/wallets/{id}/balances      Get wallet balances (per-chain)
POST /v1/transfers                  Create transfer (slower, 1-5 min)
```

---

### LI.FI Composer

LI.FI Composer enables **multi-step DeFi operations in a single transaction**. This is key for sophisticated treasury operations.

#### What Composer Does

```
┌─────────────────────────────────────────────────────────────────┐
│                    LI.FI COMPOSER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WITHOUT COMPOSER (Multiple Transactions)                       │
│  ─────────────────────────────────────────                      │
│  1. Approve token spend          → Sign & pay gas               │
│  2. Swap USDC → ETH              → Sign & pay gas               │
│  3. Approve bridge               → Sign & pay gas               │
│  4. Bridge to destination        → Sign & pay gas               │
│  5. Approve vault                → Sign & pay gas               │
│  6. Deposit into vault           → Sign & pay gas               │
│  Total: 6 transactions, 6 signatures, high gas cost             │
│                                                                 │
│  WITH COMPOSER (Single Transaction)                             │
│  ─────────────────────────────────                              │
│  1. Call Composer with full intent                              │
│  Total: 1 transaction, 1 signature, optimized gas               │
│                                                                 │
│  SUPPORTED ACTIONS                                              │
│  ─────────────────                                              │
│  • Token swaps (via any DEX)                                    │
│  • Bridge transfers (via any bridge)                            │
│  • Vault deposits (Morpho, Aave, Lido, etc.)                    │
│  • Staking (LSTs, restaking protocols)                          │
│  • Any combination of the above                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Composer API Usage

```javascript
// n8n Code Node: Multi-Step Treasury Rebalance via Composer

// Example: Swap excess ETH on Arbitrum → Bridge to Base → Deposit into vault
const composerQuote = await fetch('https://li.quest/v1/quote', {
  method: 'GET',
  params: {
    fromChain: '42161',           // Arbitrum
    toChain: '8453',              // Base
    fromToken: '0x...ETH',        // ETH on Arbitrum
    toToken: '0x7BfA7C4f...',     // Morpho vault token on Base
    fromAmount: '1000000000000000000',  // 1 ETH
    fromAddress: $env.TREASURY_ADDRESS,
    toAddress: $env.TREASURY_ADDRESS
  }
});

// The quote includes:
// - Optimal swap route on source chain
// - Best bridge selection
// - Automatic vault deposit on destination
// All in ONE transaction

return {
  route: composerQuote.route,
  estimatedOutput: composerQuote.estimate.toAmount,
  executionTime: composerQuote.estimate.executionDuration,
  transactionRequest: composerQuote.transactionRequest
};
```

#### Composer Use Cases for Treasury

| Use Case | Composer Flow | Benefit |
|----------|---------------|---------|
| **Yield optimization** | Swap → Bridge → Deposit to highest-yield vault | Single tx, atomic |
| **Emergency exit** | Withdraw → Bridge → Swap to stables | Fast, guaranteed |
| **Rebalancing** | Withdraw from A → Deposit to B (cross-chain) | No idle capital |
| **Contributor payout** | Swap to USDC → Bridge to recipient chain | Simplified ops |

#### Composer vs Standard LI.FI

| Feature | Standard LI.FI | Composer |
|---------|---------------|----------|
| Swap + Bridge | ✅ Yes | ✅ Yes |
| Vault deposits | ❌ Separate tx | ✅ Same tx |
| Atomic execution | ❌ No | ✅ Yes (same-chain) |
| Gas efficiency | Good | Better (batched) |
| Complexity | Simple | Moderate |

**Note**: Composer requires whitelist approval from LI.FI team. Contact them early in the hackathon.

---

## Execution Layer Design Decision

### The Question

When executing swaps and moving assets, should we use:
- **Uniswap directly** for all operations?
- **LI.FI** as the universal execution layer?
- **Both** with clear criteria for when to use each?

### Our Decision: Dual-Path Execution

We chose **Option C: Dual-path execution** — using Uniswap directly for same-chain swaps and LI.FI for cross-chain operations.

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION ROUTING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐                                            │
│  │  Swap Request   │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │ Same chain or   │                                            │
│  │ Cross-chain?    │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│     ┌─────┴─────┐                                               │
│     │           │                                               │
│     ▼           ▼                                               │
│  ┌──────┐   ┌──────┐                                            │
│  │ Same │   │Cross │                                            │
│  │Chain │   │Chain │                                            │
│  └──┬───┘   └──┬───┘                                            │
│     │          │                                                │
│     ▼          ▼                                                │
│  ┌──────────────────┐   ┌──────────────────┐                    │
│  │     UNISWAP      │   │      LI.FI       │                    │
│  │  Direct v3/v4    │   │   Aggregator     │                    │
│  │     pools        │   │  (20+ bridges)   │                    │
│  └──────────────────┘   └──────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Rationale

#### Why Not Just Uniswap?

Uniswap now has cross-chain bridging via Across Protocol (live June 2025), but:

| Limitation | Impact |
|------------|--------|
| Only 9 chains supported | We may need more chains |
| Only native assets + stablecoins | Limited token support |
| Bridge-then-swap (two steps) | Not atomic cross-chain swaps |
| Single bridge provider | No route optimization |

#### Why Not Just LI.FI?

LI.FI is powerful but adds overhead for simple operations:

| Consideration | Impact |
|---------------|--------|
| 0.25% service fee | Unnecessary for same-chain |
| Additional API hop | Latency for simple swaps |
| Abstracts Uniswap integration | Weakens Uniswap prize narrative |
| More complex debugging | Extra layer to troubleshoot |

#### Why Dual-Path Works

| Scenario | Execution Path | Reason |
|----------|----------------|--------|
| ETH→USDC on Arbitrum | Uniswap | Deep liquidity, no bridging needed |
| Rebalance within one chain | Uniswap | Direct pool access, lower fees |
| Move USDC Ethereum→Base | LI.FI | Auto-selects cheapest bridge |
| Swap + bridge in one tx | LI.FI | Handles complex routing |
| Emergency exit to stables | LI.FI | Speed optimization across bridges |

### Technical Comparison

#### Fees

| Fee Type | Uniswap (Same-Chain) | LI.FI (Cross-Chain) |
|----------|---------------------|---------------------|
| Swap fee | 0.01-0.3% (pool dependent) | Underlying DEX fee |
| Protocol fee | 0% | 0.25% LI.FI service fee |
| Bridge fee | N/A | 0.01-0.3% (bridge dependent) |
| Gas | User pays | User pays |

**Example**: $10,000 same-chain swap
- Uniswap: ~$30 (0.3% fee) + gas
- LI.FI: ~$30 + $25 (0.25% LI.FI fee) + gas
- **Savings with Uniswap**: ~$25

**Example**: $10,000 cross-chain Ethereum→Arbitrum
- Uniswap (via Across): ~$5-15 bridge fee
- LI.FI: ~$5-20 (auto-selects optimal bridge)
- **LI.FI advantage**: May find cheaper route

#### Speed

| Route Type | Uniswap | LI.FI |
|------------|---------|-------|
| Same-chain swap | 15-30 seconds | 15-30 seconds (+ API overhead) |
| L2↔L2 bridge | ~3 seconds (Across) | Variable (depends on bridge selected) |
| L1→L2 bridge | Minutes | Minutes (may optimize) |

#### Reliability

| Aspect | Uniswap | LI.FI |
|--------|---------|-------|
| Single point of failure | Uniswap contracts | LI.FI API + underlying bridge |
| Fallback options | None (single path) | Auto-routes around failed bridges |
| Uptime dependency | Uniswap + Across | LI.FI API + selected bridge |

### Implementation in Workflows

#### Workflow 3: Manual Swap Executor (Updated)

```
[Webhook: Receive Request]
        │
        ▼
[Code: Determine Route Type]
        │
   ┌────┴────┐
   │         │
   ▼         ▼
[Same]    [Cross]
[Chain]   [Chain]
   │         │
   ▼         ▼
[HTTP:    [HTTP:
Uniswap   LI.FI
Quote]    Quote]
   │         │
   ▼         ▼
[Execute  [Execute
via       via
Uniswap]  LI.FI]
   │         │
   └────┬────┘
        │
        ▼
[Notify: Discord]
```

#### Route Determination Logic

```javascript
// Code Node: Determine Route Type
const request = $input.first().json;

const sourceChain = request.sourceChain || 'arbitrum';
const destChain = request.destChain || 'arbitrum';

const isCrossChain = sourceChain !== destChain;

return {
  json: {
    ...request,
    routeType: isCrossChain ? 'cross-chain' : 'same-chain',
    executor: isCrossChain ? 'lifi' : 'uniswap'
  }
};
```

### Prize Narrative Alignment

This dual-path approach preserves strong narratives for all three partner prizes:

| Partner | Narrative | How We Use It |
|---------|-----------|---------------|
| **Uniswap** | Direct DEX integration for same-chain operations | Price monitoring (subgraph), same-chain swaps, pool data |
| **LI.FI** | Cross-chain execution layer | Bridge aggregation, cross-chain treasury movement |
| **Circle/Arc** | Asset custody and USDC infrastructure | Wallet management, balance tracking, USDC operations |

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARTNER INTEGRATION MAP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌─────────────┐                            │
│                      │  CIRCLE/ARC │                            │
│                      │   (Custody) │                            │
│                      └──────┬──────┘                            │
│                             │                                   │
│                    holds assets in                              │
│                             │                                   │
│              ┌──────────────┼──────────────┐                    │
│              │              │              │                    │
│              ▼              │              ▼                    │
│     ┌─────────────┐         │     ┌─────────────┐               │
│     │   UNISWAP   │         │     │    LI.FI    │               │
│     │ Same-chain  │◄────────┴────►│ Cross-chain │               │
│     │   swaps     │               │   bridges   │               │
│     └─────────────┘               └─────────────┘               │
│                                                                 │
│     Prize: Uniswap          Prize: Circle     Prize: LI.FI      │
│     integration             integration       integration       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Learning Objectives Added

With LI.FI integration, we add these learning goals:

```
□ Understand bridge aggregation concepts
□ Make authenticated LI.FI API calls
□ Compare quotes across multiple bridges
□ Execute cross-chain transactions
□ Handle cross-chain transaction status polling
□ Understand the tradeoffs: speed vs cost vs security
```

### Resources: LI.FI

| Resource | URL | Purpose |
|----------|-----|---------|
| Documentation | https://docs.li.fi/ | Official reference |
| API Reference | https://docs.li.fi/integrate-li.fi-sdk/li.fi-api | REST API docs |
| SDK | https://docs.li.fi/integrate-li.fi-sdk/li.fi-sdk | JavaScript SDK |
| Playground | https://jumper.exchange/ | Test routes manually |
| Status Page | https://status.li.fi/ | Check uptime |

---

## 72-Hour Learning Plan

### Day 1: Setup & First Workflows (Hours 0-24)

| Hours | Task | Details | Deliverable |
|-------|------|---------|-------------|
| 0-2 | n8n Setup | Install locally via Docker or use n8n.cloud | n8n running and accessible |
| 2-4 | n8n Basics | Follow official beginner tutorial | First "Hello World" workflow |
| 4-6 | Discord Setup | Create server, webhook, test message | Discord notifications working |
| 6-10 | Workflow 1 (Part 1) | Build cron trigger + mock data | Scheduled workflow running |
| 10-14 | Uniswap Integration | Connect to subgraph, query real data | Real prices in workflow |
| 14-18 | Circle Setup | Create account, get API key, test auth | Circle API calls working |
| 18-22 | Workflow 1 (Complete) | Combine Uniswap + Circle data | Full daily report working |
| 22-24 | Documentation | Document what we learned | Day 1 notes |

**Day 1 Checkpoint**: n8n sends a Discord message at scheduled time with real Uniswap prices and Circle balances.

### Day 2: Core Workflows (Hours 24-48)

| Hours | Task | Details | Deliverable |
|-------|------|---------|-------------|
| 24-28 | Workflow 2 | Price monitoring with thresholds | Alerts triggering correctly |
| 28-32 | Google Sheets | Add price logging | Historical data accumulating |
| 32-36 | Workflow 3 (Part 1) | Webhook setup, receive parameters | Webhook callable |
| 36-40 | Workflow 3 (Part 2) | Transaction building (testnet) | Swap execution working |
| 40-44 | Error Handling | Add retries, fallbacks to all workflows | Robust workflows |
| 44-48 | Workflow 4 | Weekly summary with aggregation | Email report working |

**Day 2 Checkpoint**: All four workflows operational, connected to real APIs.

### Day 3: Polish & Document (Hours 48-72)

| Hours | Task | Details | Deliverable |
|-------|------|---------|-------------|
| 48-52 | Simple Dashboard | HTML page showing workflow status | Basic UI |
| 52-56 | Documentation | README, architecture diagram, setup guide | Complete docs |
| 56-60 | Team Knowledge Share | Each person explains their part | Shared understanding |
| 60-66 | Demo Recording | 3-minute video walkthrough | Demo video |
| 66-70 | Submission | Prepare hackathon submission | Submitted |
| 70-72 | Retrospective | What we learned, what we'd do differently | Team learnings doc |

**Day 3 Checkpoint**: Working demo, documentation complete, team has shared knowledge.

---

## Team Roles

### Suggested Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEAM ROLES                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERSON A: n8n Lead                                             │
│  ────────────────────                                           │
│  Primary: n8n workflow design and implementation                │
│  Secondary: Discord/notification integration                    │
│  Learns: Automation patterns, workflow debugging                │
│                                                                 │
│  PERSON B: Uniswap Lead                                         │
│  ────────────────────                                           │
│  Primary: Uniswap subgraph queries, price data                  │
│  Secondary: Data transformation and calculations                │
│  Learns: DeFi data, GraphQL, AMM mechanics                      │
│                                                                 │
│  PERSON C: Circle/Arc Lead                                      │
│  ────────────────────                                           │
│  Primary: Circle API integration, wallet operations             │
│  Secondary: Transaction execution, status tracking              │
│  Learns: Stablecoin infrastructure, enterprise APIs             │
│                                                                 │
│  EVERYONE: Rotation                                             │
│  ────────────────────                                           │
│  Day 2: Pair program to cross-train                             │
│  Day 3: Everyone can explain all parts                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pairing Schedule

| Time | Person A | Person B | Person C |
|------|----------|----------|----------|
| Day 1 AM | n8n setup (solo) | Uniswap research (solo) | Circle setup (solo) |
| Day 1 PM | Workflow 1 | Help A with Uniswap | Help A with Circle |
| Day 2 AM | Workflow 2 | Workflow 3 | Help B with Circle |
| Day 2 PM | Help C with n8n | Help C with Uniswap | Workflow 4 |
| Day 3 | Documentation | Dashboard | Demo video |

---

## Success Metrics

### What Success Looks Like

```
┌─────────────────────────────────────────────────────────────────┐
│                    ✅ SUCCESS METRICS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INDIVIDUAL LEARNING                                            │
│  □ Every team member can create an n8n workflow from scratch    │
│  □ Every team member can explain how Uniswap pools work         │
│  □ Every team member can make authenticated Circle API calls    │
│  □ Every team member can debug a failing workflow               │
│                                                                 │
│  TEAM DELIVERABLES                                              │
│  □ At least 3 of 4 workflows are fully functional               │
│  □ Workflows use real API data (not mocked)                     │
│  □ Documentation exists for all workflows                       │
│  □ Demo video clearly explains what we built                    │
│                                                                 │
│  KNOWLEDGE ARTIFACTS                                            │
│  □ README with setup instructions                               │
│  □ Architecture diagram                                         │
│  □ "Lessons learned" document                                   │
│  □ Exported n8n workflows (shareable JSON)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ❌ NOT SUCCESS METRICS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • Prize money won (we're not optimizing for this)              │
│  • "Innovative" or "novel" solution                             │
│  • Production-ready code                                        │
│  • Polished UI/UX                                               │
│  • Complex features beyond scope                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Starter Resources

### n8n

| Resource | URL | Purpose |
|----------|-----|---------|
| Documentation | https://docs.n8n.io/ | Official reference |
| Beginner Course | https://docs.n8n.io/courses/ | Start here |
| Docker Install | https://docs.n8n.io/hosting/installation/docker/ | Self-hosting |
| n8n Cloud | https://n8n.cloud/ | Hosted option (free tier) |
| Community Workflows | https://n8n.io/workflows/ | Examples to learn from |

### Uniswap

| Resource | URL | Purpose |
|----------|-----|---------|
| v4 Documentation | https://docs.uniswap.org/contracts/v4/overview | Official docs |
| Subgraph Explorer | https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3 | Query interface |
| Cyfrin Course | https://updraft.cyfrin.io/courses/uniswap-v4 | Video course |
| v4 Template | https://github.com/uniswapfoundation/v4-template | Code examples |

### Circle Gateway & Arc

| Resource | URL | Purpose |
|----------|-----|---------|
| **Gateway Main Page** | https://www.circle.com/gateway | Overview and signup |
| **Gateway Quickstart** | https://developers.circle.com/gateway/quickstarts/unified-balance | Step-by-step tutorial |
| **Gateway API Docs** | https://developers.circle.com/gateway | Full API reference |
| Developer Portal | https://developers.circle.com/ | Main entry point |
| Console (API Keys) | https://console.circle.com/ | Get credentials |
| Wallets Docs | https://developers.circle.com/wallets | Legacy Wallet API |
| Arc Docs | https://docs.arc.network/ | Arc L1 info |
| Testnet Faucet | https://faucet.circle.com/ | Get test USDC |

### LI.FI

| Resource | URL | Purpose |
|----------|-----|---------|
| **LI.FI Documentation** | https://docs.li.fi/ | Main docs |
| **Composer Guide** | https://docs.li.fi/introduction/user-flows-and-examples/lifi-composer | Multi-step DeFi |
| **API Reference** | https://docs.li.fi/integrate-li.fi-sdk/li.fi-api | REST API |
| **SDK** | https://docs.li.fi/integrate-li.fi-sdk/li.fi-sdk | JavaScript SDK |
| **Jumper Exchange** | https://jumper.exchange/ | Test routes manually |
| **Supported Chains** | https://docs.li.fi/list-chains-bridges-dex-aggregators-solvers | Chain/bridge list |
| **Status Page** | https://status.li.fi/ | Check uptime |

---

## Appendix: Code Snippets

### n8n HTTP Request: Uniswap Subgraph

```javascript
// HTTP Request Node Settings
// Method: POST
// URL: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3

// Body (JSON):
{
  "query": `{
    pool(id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8") {
      token0 { symbol name }
      token1 { symbol name }
      token0Price
      token1Price
      volumeUSD
      liquidity
    }
  }`
}
```

### n8n HTTP Request: Circle Balance

```javascript
// HTTP Request Node Settings
// Method: GET
// URL: https://api.circle.com/v1/wallets/{{$env.CIRCLE_WALLET_ID}}/balances

// Authentication: Header Auth
// Name: Authorization
// Value: Bearer {{$env.CIRCLE_API_KEY}}
```

### n8n Code Node: Format Treasury Report

```javascript
// Access data from previous nodes
const circleData = $('Circle Balance').first().json;
const uniswapData = $('Uniswap Price').first().json;

// Extract values
const usdcBalance = circleData.data?.balances?.find(b => b.currency === 'USD')?.amount || '0';
const ethPrice = parseFloat(uniswapData.data?.pool?.token0Price || 0);

// Format numbers
const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

// Build report
const report = `
📊 **Treasury Report** - ${new Date().toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 **USDC Balance**: ${formatCurrency(parseFloat(usdcBalance))}
📈 **ETH Price**: ${formatCurrency(ethPrice)}
📊 **Pool Liquidity**: ${formatCurrency(parseFloat(uniswapData.data?.pool?.volumeUSD || 0))} (24h volume)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Generated: ${new Date().toLocaleString()}
`;

return {
  json: {
    report,
    data: {
      usdcBalance: parseFloat(usdcBalance),
      ethPrice,
      timestamp: new Date().toISOString()
    }
  }
};
```

### n8n Code Node: Price Alert Logic

```javascript
const currentPrice = parseFloat($input.first().json.price);
const upperThreshold = 3500;  // Alert if ETH goes above
const lowerThreshold = 2800;  // Alert if ETH goes below

let alertType = null;
let alertMessage = null;

if (currentPrice > upperThreshold) {
  alertType = 'HIGH';
  alertMessage = `🚨 ETH price is HIGH: $${currentPrice.toFixed(2)} (above $${upperThreshold})`;
} else if (currentPrice < lowerThreshold) {
  alertType = 'LOW';
  alertMessage = `🚨 ETH price is LOW: $${currentPrice.toFixed(2)} (below $${lowerThreshold})`;
}

return {
  json: {
    price: currentPrice,
    alertTriggered: alertType !== null,
    alertType,
    alertMessage,
    timestamp: new Date().toISOString()
  }
};
```

### n8n HTTP Request: Circle Gateway Unified Balance

```javascript
// HTTP Request Node Settings
// Method: POST
// URL: https://gateway-api.circle.com/v1/balances

// Headers:
// Authorization: Bearer {{$env.CIRCLE_API_KEY}}
// Content-Type: application/json

// Body (JSON):
{
  "address": "{{$env.TREASURY_ADDRESS}}"
}

// Response Structure:
{
  "balance": "1247500000000",  // Total USDC across all chains (6 decimals)
  "chainBreakdown": [
    { "chain": "ethereum", "balance": "500000000000" },
    { "chain": "arbitrum", "balance": "350000000000" },
    { "chain": "base", "balance": "397500000000" }
  ]
}
```

### n8n Code Node: Circle Gateway Cross-Chain Transfer

```javascript
// Step 1: Construct burn intent
const burnIntent = {
  sourceDomain: 0,              // Ethereum (see Gateway docs for domain IDs)
  destinationDomain: 6,         // Base
  sourceToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC on Ethereum
  destinationToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  amount: BigInt(1000 * 1e6).toString(),  // 1000 USDC
  recipient: $env.RECIPIENT_ADDRESS,
  salt: '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
  maxFee: BigInt(2.01 * 1e6).toString()   // 2.01 USDC max fee
};

// Step 2: Sign the burn intent (EIP-712 typed data)
// This would be done via your signing service or wallet
const typedData = {
  types: {
    BurnIntent: [
      { name: 'sourceDomain', type: 'uint32' },
      { name: 'destinationDomain', type: 'uint32' },
      { name: 'sourceToken', type: 'address' },
      { name: 'destinationToken', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'recipient', type: 'bytes32' },
      { name: 'salt', type: 'bytes32' },
      { name: 'maxFee', type: 'uint256' }
    ]
  },
  primaryType: 'BurnIntent',
  domain: {
    name: 'CircleGateway',
    version: '1',
    chainId: 1  // Ethereum mainnet
  },
  message: burnIntent
};

// Step 3: Request attestation from Gateway API
// HTTP Request to POST https://gateway-api.circle.com/v1/transfer
// Body: { burnIntent, signature }

// Step 4: Execute mint on destination chain
// Call gatewayMint(attestationPayload, attestationSignature) on Base

return {
  burnIntent,
  typedData,
  nextStep: 'Sign with wallet, then POST to /transfer endpoint'
};
```

### n8n HTTP Request: LI.FI Standard Cross-Chain Swap

```javascript
// HTTP Request Node Settings
// Method: GET
// URL: https://li.quest/v1/quote

// Query Parameters:
// fromChain: 42161          (Arbitrum)
// toChain: 8453             (Base)
// fromToken: 0xETH...       (ETH on Arbitrum)
// toToken: 0x833589fCD...   (USDC on Base)
// fromAmount: 1000000000000000000  (1 ETH in wei)
// fromAddress: {{$env.TREASURY_ADDRESS}}
// toAddress: {{$env.TREASURY_ADDRESS}}

// Response includes:
// - route: optimal path through bridges/DEXs
// - estimate: expected output, fees, execution time
// - transactionRequest: ready-to-sign transaction
```

### n8n HTTP Request: LI.FI Composer (Multi-Step DeFi)

```javascript
// HTTP Request Node Settings
// Method: GET
// URL: https://li.quest/v1/quote

// For Composer: specify a VAULT TOKEN as the destination
// This triggers multi-step execution: swap → bridge → deposit

// Query Parameters:
// fromChain: 42161                      (Arbitrum)
// toChain: 8453                         (Base)
// fromToken: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1  (WETH on Arbitrum)
// toToken: 0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A   (Morpho vault token on Base)
// fromAmount: 1000000000000000000       (1 ETH)
// fromAddress: {{$env.TREASURY_ADDRESS}}
// toAddress: {{$env.TREASURY_ADDRESS}}

// The response will include a SINGLE transaction that:
// 1. Swaps WETH → USDC on Arbitrum (if needed)
// 2. Bridges USDC to Base via optimal bridge
// 3. Deposits USDC into Morpho vault on Base
// 4. Returns vault shares to your address

// All in ONE transaction, ONE signature
```

### n8n Code Node: Execution Router (Uniswap vs LI.FI vs Gateway)

```javascript
// Intelligent routing based on operation type
const request = $input.first().json;

const {
  sourceChain,
  destChain,
  sourceToken,
  destToken,
  amount,
  operationType  // 'swap', 'bridge', 'rebalance', 'payout'
} = request;

let executor = null;
let reason = '';

// Decision logic
if (sourceChain === destChain) {
  // Same-chain operation
  executor = 'uniswap';
  reason = 'Same-chain swap - Uniswap is most efficient';

} else if (sourceToken === 'USDC' && destToken === 'USDC') {
  // Pure USDC transfer across chains
  executor = 'circle-gateway';
  reason = 'USDC-only transfer - Gateway is fastest (<500ms)';

} else if (operationType === 'rebalance' && amount > 10000) {
  // Complex rebalancing with vault deposit
  executor = 'lifi-composer';
  reason = 'Multi-step DeFi operation - Composer handles in single tx';

} else {
  // General cross-chain swap
  executor = 'lifi';
  reason = 'Cross-chain swap with token conversion - LI.FI aggregates best route';
}

return {
  json: {
    ...request,
    executor,
    reason,
    timestamp: new Date().toISOString()
  }
};
```

---

## Final Notes

### Remember

- **This is about learning, not winning**
- Ask for help when stuck (Discord, teammates, mentors)
- Document as you go (future you will thank present you)
- It's okay if things break—that's how we learn
- Have fun with it!

### Post-Hackathon

After the hackathon, consider:

- Continuing to build on what you learned
- Exploring more advanced n8n patterns
- Diving deeper into Uniswap v4 Hooks
- Building more sophisticated Circle integrations
- Sharing your learnings with others

---

*Project document prepared for EthGlobal HackMoney 2026 — Learning-Focused Track*
