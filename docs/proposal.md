# Treasury Agent: Crypto Without the Complexity

**EthGlobal HackMoney 2026**

---

## The Problem

Crypto promises financial sovereignty, DeFi yields, and a new financial system. But for most people, it delivers:

- Terrifying wallet interfaces where one wrong click loses everything
- Dozens of chains, bridges, and protocols to understand
- Technical jargon that excludes anyone without hours to learn
- Single points of failure (one person holds the keys)

**The result?** Your family members, your busy friends, your non-technical colleagues - people who *want* to participate in crypto - **can't**. The barrier to entry isn't interest. It's complexity.

---

## The Insight

The magic of modern AI tools isn't raw capability - it's **approachability**. Tools like n8n and AI agents succeed because they make powerful automation feel like having a conversation.

What if we applied this to crypto?

Instead of teaching someone to:
- Install MetaMask and secure a seed phrase
- Understand gas fees and bridge risks
- Navigate confusing DeFi interfaces
- Avoid scams and phishing attacks

...what if they could just type in Discord:

> *"@TreasuryAgent what's our balance?"*
> *"@TreasuryAgent convert $500 of ETH to stablecoins"*
> *"@TreasuryAgent how did we do this month?"*

---

## What We're Building

**Treasury Agent** is a Discord-native AI that manages crypto for families, teams, and small organizations through conversation.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TREASURY AGENT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  "Just chat. The agent handles the complexity."                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   👨‍👩‍👧‍👦  Family Discord Server                            │   │
│  │                                                         │   │
│  │   Mom: "@TreasuryAgent what's our balance?"             │   │
│  │   Agent: "You have $12,340 total - $8,200 in            │   │
│  │          stablecoins and $4,140 in ETH"                 │   │
│  │                                                         │   │
│  │   Dad: "@TreasuryAgent move $2000 to savings"           │   │
│  │   Agent: "Got it! This needs Mom's approval too.        │   │
│  │          @Mom can you confirm?"                         │   │
│  │   Mom: "✅ Approved"                                     │   │
│  │   Agent: "Done! Moved $2000 to the savings vault."      │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Discord-first │ Plain English │ Family Consensus │ Proactive  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### For the Less Technical
Zero learning curve. Just chat. See your family's crypto grow, participate in decisions, understand what's happening - all in plain English, in Discord where you already are.

### For Busy People
Faster than any wallet UI. The agent is proactive - it monitors positions, alerts you when action is needed, and handles the execution. You just approve.

### For Security
N-of-M confirmations via Discord. "Mom and one sibling must approve any move over $500." This is arguably *more secure* than single-key wallets with 2FA - it requires **social consensus**, not just device access.

### For Transparency
Everyone sees the same reports, alerts, and decisions. No black box. The less-technical family members aren't locked out - they're equal participants.

---

## Who Is This For?

| Audience | Their Problem | How Treasury Agent Helps |
|----------|--------------|-------------------------|
| **Families** | "I want to invest in crypto with my kids but can't teach them all the technical stuff" | Everyone participates via Discord chat; family consensus on big decisions |
| **Small Teams** | "Our startup has crypto reserves but managing them is a full-time job" | Agent handles monitoring and execution; team approves via Discord |
| **Investment Clubs** | "We pool money but one person holds all the keys" | Democratic control via n-of-m approvals; transparent reporting |
| **Crypto-curious** | "I want to participate but the interfaces terrify me" | No interfaces to learn - just conversation |

---

## Table of Contents

1. [Core Features](#core-features)
2. [How It Works](#how-it-works)
3. [Partner Prize Strategy](#partner-prize-strategy)
4. [Technical Architecture](#technical-architecture)
5. [Workflow Details](#workflow-details)
6. [Technology Deep Dives](#technology-deep-dives)
7. [N-of-M Approval System](#n-of-m-approval-system)
8. [Execution Layer Design](#execution-layer-design)
9. [Development Plan](#development-plan)
10. [Success Metrics](#success-metrics)
11. [Resources & Appendix](#resources--appendix)

---

## Core Features

### 1. Conversational Interface
Discord is the primary interface. No apps to install, no seed phrases to manage, no terrifying "confirm transaction" popups. Just chat.

```
User: "How are we doing?"
Agent: "Pretty good! Your portfolio is up 3.2% this week.
        You have $12,340 total across 3 chains.
        ETH is at $3,450 - up from $3,200 when you bought."
```

### 2. Plain English Everything
No jargon. No technical metrics. Reports are written for humans, not traders.

```
# What most crypto tools show:
"0.285 ETH swapped for 1,000.00 USDC via LI.FI
Arbitrum→Base, tx: 0x7f3a..."

# What Treasury Agent shows:
"Done! Converted about $1,000 of ETH to dollars.
Your stablecoin balance is now safer at $8,200."
```

### 3. Family Consensus (N-of-M Approvals)
Big decisions require agreement. Configure rules like:
- "Any swap over $500 needs 2 family members to approve"
- "Moving to a new chain needs Dad and one other person"
- "Daily limit of $1,000 can auto-execute; above needs approval"

This is **social multisig** - more intuitive and arguably more secure than technical multi-signature wallets.

### 4. Proactive Monitoring
The agent doesn't wait to be asked. It watches and notifies:
- "ETH dropped 8% today. Want me to buy the dip?"
- "Your stablecoin yield is now 2% lower on Arbitrum. Should I move to Base?"
- "Weekly report: You're up $340 this week. Here's the breakdown..."

### 5. Dashboard for Details
Discord handles day-to-day. The dashboard handles:
- Full transaction history
- Settings and approval rules
- Detailed analytics
- Manual overrides when needed

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERFACE STRATEGY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DISCORD (Primary - Day-to-Day)                                 │
│  ──────────────────────────────                                 │
│  • Check balances                                               │
│  • Request swaps and transfers                                  │
│  • Approve/reject pending actions                               │
│  • Receive reports and alerts                                   │
│  • Ask questions in natural language                            │
│                                                                 │
│  DASHBOARD (Secondary - Details & Settings)                     │
│  ──────────────────────────────────────────                     │
│  • Full transaction history                                     │
│  • Configure approval rules and thresholds                      │
│  • Manage family members and permissions                        │
│  • Detailed charts and analytics                                │
│  • Export data for taxes                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## How It Works

### The Agent Loop

Treasury Agent follows a simple cycle: **Monitor → Decide → Execute → Report**

```
┌─────────────────────────────────────────────────────────────────┐
│              TREASURY AGENT LOOP                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      MONITOR                              │  │
│  │  • Watch prices across chains                             │  │
│  │  • Track your balances automatically                      │  │
│  │  • Notice when yields change                              │  │
│  │  • Detect unusual activity                                │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      DECIDE                               │  │
│  │  • Should we alert the family?                            │  │
│  │  • Does this action need approval?                        │  │
│  │  • What's the best way to execute this?                   │  │
│  │  • Is this within safe limits?                            │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      EXECUTE                              │  │
│  │  • Small stuff: Auto-execute within limits                │  │
│  │  • Big stuff: Request family approval first               │  │
│  │  • Handle all the chain/bridge complexity                 │  │
│  │  • Use the cheapest, safest route                         │  │
│  └─────────────────────────┬────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      REPORT                               │  │
│  │  • "Done! Here's what happened."                          │  │
│  │  • Daily/weekly summaries in plain English                │  │
│  │  • Log everything for transparency                        │  │
│  │  • Alert on anything unusual                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

The complexity is hidden from users, but under the hood:

| Layer | Technology | What It Does |
|-------|------------|--------------|
| **Orchestration** | n8n | Coordinates all the workflows |
| **Interface** | Discord | Where users interact |
| **Dashboard** | React + Appwrite | Settings and detailed history |
| **Same-Chain Swaps** | Uniswap v4 | Fast, cheap, direct swaps |
| **Cross-Chain** | LI.FI | Bridges assets between chains |
| **Stablecoins** | Circle Gateway | Instant USDC transfers |
| **Storage** | Appwrite | User data and history |

---

## Partner Prize Strategy

We're targeting prizes that align with our accessibility-focused agent architecture:

### Target Prizes Overview

| Partner | Prize | Amount | Our Angle |
|---------|-------|--------|-----------|
| **LI.FI** | Best AI × LI.FI Smart App | $2,000 | Agent uses LI.FI as cross-chain execution layer |
| **Circle** | Best Chain Abstracted USDC Apps | $5,000 | Unified USDC balance, instant transfers |
| **Circle** | Global Payouts & Treasury Systems | $2,500 | Multi-recipient family/team payouts |
| **Uniswap** | v4 Agentic Finance | $5,000 | Agent-driven swaps via Uniswap v4 |

---

### LI.FI: Best AI × LI.FI Smart App ($2,000)

**Prize Description**: "Innovative AI-powered agents using LI.FI as cross-chain execution layer"

**Our Narrative**:

> Treasury Agent makes cross-chain DeFi accessible to non-technical users through conversational AI. When a family member says "move some ETH to stablecoins," the agent uses LI.FI to find the optimal route across chains - the user never knows (or needs to know) about bridges, DEXs, or routing. LI.FI is the invisible execution layer that makes "just chat" possible.

**Key Integration Points**:
- Cross-chain swaps route through LI.FI automatically
- Agent selects optimal bridge based on speed/cost
- Users never see bridge complexity - just results
- Composer enables multi-step DeFi in single transactions

```
┌─────────────────────────────────────────────────────────────────┐
│                    LI.FI AS INVISIBLE LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER EXPERIENCE                     WHAT HAPPENS               │
│  ───────────────                     ─────────────              │
│                                                                 │
│  "Convert my ETH to          →    Agent queries LI.FI           │
│   stablecoins"                    for best route                │
│                                           ↓                     │
│                                   LI.FI finds: Arbitrum ETH     │
│                                   → Stargate → Base USDC        │
│                                           ↓                     │
│                                   Agent executes                │
│                                           ↓                     │
│  "Done! $3,400 now in         ←   Transaction complete          │
│   stablecoins on Base"                                          │
│                                                                 │
│  User never sees: bridges, gas, routing, chains, confirmations  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Circle: Best Chain Abstracted USDC Apps ($5,000)

**Prize Description**: "Apps treating multiple chains as unified liquidity"

**Our Narrative**:

> For a family managing crypto together, "which chain is my money on?" shouldn't matter. Treasury Agent uses Circle Gateway to present a single unified balance. When the agent says "you have $8,200 in stablecoins," that's the total across Ethereum, Arbitrum, Base, and more. Moving between chains happens in under 500ms - users just see instant results.

**Key Integration Points**:
- Single balance view across all chains
- Sub-500ms cross-chain USDC transfers
- No pre-positioned liquidity needed
- Users never think about chains

---

### Circle: Global Payouts & Treasury Systems ($2,500)

**Prize Description**: "Automated multi-recipient settlement with USDC"

**Our Narrative**:

> Families and small teams need to distribute funds - allowances, expense reimbursements, contributor payments. Treasury Agent enables Discord-triggered payouts: "Send $200 to each kid for the month" executes automatically with appropriate approvals, settling instantly via Circle Gateway.

---

### Uniswap: v4 Agentic Finance ($5,000)

**Prize Description**: "Agent-driven financial systems using Uniswap v4"

**Our Narrative**:

> Treasury Agent exemplifies "agentic finance" - autonomous monitoring, threshold-based decisions, and programmatic execution. For same-chain operations, the agent uses Uniswap v4 directly for optimal execution. The agent queries v4 pools for real-time pricing and executes swaps through the protocol - all invisible to users who just asked to "swap some ETH."

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌─────────────────┐                        │
│                      │    DISCORD      │                        │
│                      │  (User Chat)    │                        │
│                      └────────┬────────┘                        │
│                               │                                 │
│                               ▼                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                         n8n                             │    │
│  │              (Workflow Orchestration)                   │    │
│  │                                                         │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │    │
│  │  │ Daily   │ │ Price   │ │ Swap    │ │ Approval│       │    │
│  │  │ Report  │ │ Monitor │ │ Execute │ │ Handler │       │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │    │
│  └────────────────────────────────────────────────────────┘    │
│                               │                                 │
│              ┌────────────────┼────────────────┐                │
│              │                │                │                │
│              ▼                ▼                ▼                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   UNISWAP    │  │    LI.FI     │  │   CIRCLE     │          │
│  │  Same-chain  │  │  Cross-chain │  │   Gateway    │          │
│  │    swaps     │  │   bridges    │  │  USDC moves  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                               │                                 │
│                               ▼                                 │
│                      ┌─────────────────┐                        │
│                      │    APPWRITE     │                        │
│                      │  (Data + Auth)  │                        │
│                      └─────────────────┘                        │
│                               │                                 │
│                               ▼                                 │
│                      ┌─────────────────┐                        │
│                      │   DASHBOARD     │                        │
│                      │ (Settings/History)                       │
│                      └─────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Storage

**Appwrite Database** stores all persistent data:

| Collection | Purpose |
|------------|---------|
| `price_history` | Historical prices for reports |
| `executions` | All transactions and swaps |
| `alerts` | Alert history and acknowledgments |
| `balances` | Treasury snapshots across chains |
| `approvals` | Pending and completed approvals |
| `members` | Family/team member permissions |

---

## Workflow Details

### Workflow 1: Daily Report

Every morning, the agent posts a friendly summary to Discord.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW: Daily Report                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trigger: 9:00 AM daily                                         │
│                                                                 │
│  [Cron] → [Get Balances] → [Get Prices] → [Format Report]       │
│                                                 ↓                │
│                                        [Post to Discord]        │
│                                                                 │
│  Example Output:                                                │
│  ──────────────                                                 │
│  "Good morning! Here's your daily update:                       │
│                                                                 │
│   💰 Total: $12,340 (+2.1% this week)                           │
│   📊 ETH: $4,140 (1.2 ETH @ $3,450)                             │
│   💵 Stables: $8,200 across 3 chains                            │
│                                                                 │
│   Nothing needs your attention today."                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 2: Price Monitor

Watches prices and alerts when thresholds are crossed.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW: Price Monitor                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trigger: Every 5 minutes                                       │
│                                                                 │
│  [Interval] → [Get Price] → [Check Thresholds] → [IF Alert?]    │
│                                                       ↓ Yes     │
│                                              [Discord Alert]    │
│                                                                 │
│  Example Alert:                                                 │
│  ─────────────                                                  │
│  "Heads up! ETH dropped 5% in the last hour.                    │
│   Current price: $3,280                                         │
│                                                                 │
│   Your ETH is now worth $3,936 (was $4,140)                     │
│                                                                 │
│   Want me to:                                                   │
│   • Buy more at this price?                                     │
│   • Convert some to stablecoins?                                │
│   • Do nothing (just watching)"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 3: Swap Executor

Handles swap requests with appropriate approvals.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW: Swap Executor                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trigger: Discord command or dashboard                          │
│                                                                 │
│  [Request] → [Check Amount] → [Needs Approval?]                 │
│                                      │                          │
│                          ┌───────────┴───────────┐              │
│                          ▼                       ▼              │
│                    [Auto-Execute]        [Request Approval]     │
│                          │                       │              │
│                          │              [Wait for N-of-M]       │
│                          │                       │              │
│                          └───────────┬───────────┘              │
│                                      ▼                          │
│                          [Route: Uniswap or LI.FI]              │
│                                      │                          │
│                                      ▼                          │
│                              [Execute Swap]                     │
│                                      │                          │
│                                      ▼                          │
│                          [Report to Discord]                    │
│                                                                 │
│  Example Interaction:                                           │
│  ────────────────────                                           │
│  User: "@Agent swap $2000 ETH to USDC"                          │
│  Agent: "Got it! This is over $500 so I need one more           │
│          approval. @Dad or @Sister - can you confirm?"          │
│  Dad: "✅"                                                       │
│  Agent: "Approved! Swapping now..."                             │
│  Agent: "Done! Converted $2,000 of ETH to USDC.                 │
│          You received 1,998.50 USDC (0.075% fee).               │
│          Stablecoin balance is now $10,198.50"                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 4: Weekly Summary

Comprehensive weekly report with trends and insights.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKFLOW: Weekly Summary                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trigger: Monday 8:00 AM                                        │
│                                                                 │
│  [Cron] → [Read Week History] → [Calculate Stats] → [Format]    │
│                                                         ↓       │
│                                                 [Post Discord]  │
│                                                                 │
│  Example Output:                                                │
│  ──────────────                                                 │
│  "Weekly Recap (Jan 27 - Feb 3)                                 │
│                                                                 │
│   📈 Portfolio: $12,340 → $12,680 (+2.7%)                       │
│                                                                 │
│   This week:                                                    │
│   • ETH went from $3,200 to $3,450 (+7.8%)                      │
│   • You swapped $500 ETH → USDC on Tuesday                      │
│   • No alerts triggered                                         │
│                                                                 │
│   Your stablecoins earned $4.20 in yield.                       │
│                                                                 │
│   Looking ahead: ETH has been volatile. Want me                 │
│   to tighten the price alerts?"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## N-of-M Approval System

A key differentiator: **social consensus** for security.

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    N-OF-M APPROVAL FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONFIGURATION (set in dashboard)                               │
│  ────────────────────────────────                               │
│                                                                 │
│  Family Members:                                                │
│  • Dad (@dad#1234) - Admin                                      │
│  • Mom (@mom#5678) - Admin                                      │
│  • Alex (@alex#9012) - Member                                   │
│  • Sam (@sam#3456) - Member                                     │
│                                                                 │
│  Approval Rules:                                                │
│  • Under $100: Auto-execute                                     │
│  • $100-$1000: 1 admin approval                                 │
│  • $1000-$5000: 2 approvals (any member)                        │
│  • Over $5000: 2 admins required                                │
│                                                                 │
│  FLOW EXAMPLE                                                   │
│  ────────────                                                   │
│                                                                 │
│  1. Alex requests: "Swap $2000 ETH to USDC"                     │
│                                                                 │
│  2. Agent checks: $2000 needs 2 approvals                       │
│     Alex counts as 1 (requester auto-approves)                  │
│                                                                 │
│  3. Agent posts:                                                │
│     "Alex wants to swap $2000 ETH → USDC                        │
│      Need 1 more approval from: @Dad @Mom @Sam                  │
│      Reply ✅ to approve or ❌ to reject"                        │
│                                                                 │
│  4. Mom replies: "✅"                                            │
│                                                                 │
│  5. Agent executes and reports:                                 │
│     "Approved by Alex + Mom. Swap complete!"                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Is More Secure

| Traditional Crypto | Treasury Agent |
|-------------------|----------------|
| One person holds seed phrase | Multiple people must agree |
| 2FA protects one account | Social consensus required |
| If phone is stolen, funds at risk | Attacker needs multiple family members |
| Single point of failure | Distributed trust |

### Timeout Handling

```
Rules:
• Pending approvals expire after 30 minutes (configurable)
• On timeout: Cancel and notify requester
• Urgent flag: Can request faster response
• Dashboard shows all pending approvals
```

---

## Execution Layer Design

### Intelligent Routing

The agent automatically picks the best execution path:

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION ROUTING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER REQUEST: "Swap ETH to USDC"                               │
│                                                                 │
│                    ┌─────────────┐                              │
│                    │ AGENT LOGIC │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│              ┌────────────┼────────────┐                        │
│              │            │            │                        │
│              ▼            ▼            ▼                        │
│       Same Chain?   Cross Chain?   USDC Only?                   │
│              │            │            │                        │
│              ▼            ▼            ▼                        │
│         ┌────────┐  ┌────────┐  ┌────────┐                      │
│         │UNISWAP │  │ LI.FI  │  │ CIRCLE │                      │
│         │  v4    │  │        │  │GATEWAY │                      │
│         └────────┘  └────────┘  └────────┘                      │
│                                                                 │
│  Decision Logic:                                                │
│  • Same chain swap → Uniswap (fastest, cheapest)                │
│  • Cross chain swap → LI.FI (finds best bridge)                 │
│  • USDC between chains → Circle Gateway (<500ms)                │
│                                                                 │
│  User never knows which path was used - just sees results.      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Matters for Users

They don't need to understand:
- What a bridge is
- Which chain their money is on
- Gas fees and optimization
- DEX routing

They just say what they want, and the agent handles it.

---

## Technology Deep Dives

### n8n Workflow Automation

n8n is the brain that coordinates everything:

```
┌─────────────────────────────────────────────────────────────────┐
│                    n8n MENTAL MODEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRIGGERS (What starts a workflow)                              │
│  ├── Cron: "Every day at 9am"                                   │
│  ├── Interval: "Every 5 minutes"                                │
│  ├── Webhook: "When Discord sends a message"                    │
│  └── Manual: "When we click execute"                            │
│                                                                 │
│  ACTIONS (What the workflow does)                               │
│  ├── HTTP Request: Call Uniswap, LI.FI, Circle APIs             │
│  ├── Code: Transform data, make decisions                       │
│  ├── Discord: Send messages, read reactions                     │
│  └── Database: Store/retrieve from Appwrite                     │
│                                                                 │
│  FLOW CONTROL (How it decides)                                  │
│  ├── IF: "Is this over $500?"                                   │
│  ├── Switch: "Which approval tier?"                             │
│  ├── Wait: "Pause for approval"                                 │
│  └── Merge: "Combine data from multiple sources"                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Uniswap v4 (Same-Chain Execution)

For swaps within a single chain, we use Uniswap directly:

```javascript
// What the agent does behind the scenes

// 1. Get current price
const poolData = await queryUniswapSubgraph(`{
  pool(id: "0x...") {
    token0Price
    liquidity
  }
}`);

// 2. Build swap transaction
const swapTx = buildUniswapSwap({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: userRequestedAmount,
  slippage: 0.5  // 0.5% max slippage
});

// 3. Execute
const result = await executeTransaction(swapTx);

// 4. Report in plain English
postToDiscord(`Done! Swapped ${formatCurrency(amount)} ETH
for ${result.received} USDC.`);
```

### LI.FI (Cross-Chain Execution)

When assets need to move between chains:

```javascript
// User says: "Move my ETH from Arbitrum to Base"

// 1. Get optimal route
const quote = await lifi.getQuote({
  fromChain: 'arbitrum',
  toChain: 'base',
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: userAmount
});

// 2. LI.FI handles:
//    - Finding best bridge (Stargate, Hop, etc.)
//    - Optimal DEX routing
//    - Gas estimation
//    - Fallback if bridge fails

// 3. Execute and report
postToDiscord(`Done! Your ETH is now USDC on Base.
Took about 2 minutes via Stargate bridge.`);
```

### Circle Gateway (USDC Transfers)

For moving stablecoins between chains instantly:

```javascript
// User says: "Move $5000 USDC to Base"

// 1. Gateway provides unified balance
const balance = await circleGateway.getBalance(treasuryAddress);
// Returns total across ALL chains, not per-chain

// 2. Transfer in <500ms
const transfer = await circleGateway.transfer({
  amount: 5000,
  toChain: 'base',
  recipient: treasuryAddress
});

// 3. Report
postToDiscord(`Done! $5,000 USDC moved to Base instantly.`);
```

---

## Development Plan

### Phase 1: Core Agent (Days 1-2)

| Task | Details |
|------|---------|
| n8n setup | Deploy to Hostinger VPS |
| Discord integration | Webhooks for messages |
| Daily report workflow | Balance + price summary |
| Price monitor | Alert on threshold cross |
| Basic swap execution | Same-chain via Uniswap |

### Phase 2: Cross-Chain + Approvals (Days 2-3)

| Task | Details |
|------|---------|
| LI.FI integration | Cross-chain swaps |
| Circle Gateway | Fast USDC transfers |
| N-of-M approval flow | Discord-based consensus |
| Dashboard basics | Settings + history |

### Phase 3: Polish + Demo (Day 3)

| Task | Details |
|------|---------|
| Plain English formatting | Human-friendly messages |
| Error handling | Graceful failures |
| Demo video | 3-minute walkthrough |
| Documentation | README + architecture |

---

## Success Metrics

### What Success Looks Like

```
┌─────────────────────────────────────────────────────────────────┐
│                    ✅ SUCCESS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER EXPERIENCE                                                │
│  □ Non-technical person can check balance via Discord           │
│  □ Swap request → execution takes < 5 messages                  │
│  □ Reports are readable without crypto knowledge                │
│  □ N-of-M approval works via Discord reactions                  │
│                                                                 │
│  TECHNICAL FUNCTION                                             │
│  □ Daily reports post automatically                             │
│  □ Price alerts trigger correctly                               │
│  □ Swaps execute on testnet with real protocols                 │
│  □ Cross-chain transfers work via LI.FI                         │
│                                                                 │
│  DEMO QUALITY                                                   │
│  □ 3-minute video shows full flow                               │
│  □ Family scenario is compelling                                │
│  □ Technical architecture is clear                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Real Test

> Can your mom use it?

If a non-technical family member can:
1. Ask for the balance
2. Request a swap
3. Approve someone else's request
4. Understand the weekly report

...we've succeeded.

---

## Resources & Appendix

### Documentation Links

| Resource | URL |
|----------|-----|
| n8n Docs | https://docs.n8n.io/ |
| Uniswap v4 | https://docs.uniswap.org/contracts/v4/overview |
| LI.FI Docs | https://docs.li.fi/ |
| Circle Gateway | https://developers.circle.com/gateway |
| Appwrite | https://appwrite.io/docs |

### Code Snippets

#### Plain English Report Formatting

```javascript
// Transform technical data into human-readable report
function formatDailyReport(data) {
  const { balances, prices, weekChange } = data;

  const total = balances.reduce((sum, b) => sum + b.valueUsd, 0);
  const changeEmoji = weekChange >= 0 ? '📈' : '📉';
  const changeText = weekChange >= 0 ? 'up' : 'down';

  return `
Good morning! Here's your daily update:

💰 **Total**: ${formatCurrency(total)} (${changeText} ${Math.abs(weekChange)}% this week) ${changeEmoji}

**Breakdown:**
${balances.map(b => `• ${b.symbol}: ${formatCurrency(b.valueUsd)}`).join('\n')}

${getInsight(data)}
  `.trim();
}

function getInsight(data) {
  // Add contextual, helpful insights
  if (data.weekChange > 5) {
    return "Great week! Your patience is paying off.";
  } else if (data.weekChange < -5) {
    return "Rough week, but you're in it for the long term.";
  } else {
    return "Steady as she goes. Nothing needs your attention.";
  }
}
```

#### N-of-M Approval Check

```javascript
// Check if request has enough approvals
function checkApprovalStatus(request, approvals, rules) {
  const amount = request.amount;
  const requiredApprovals = getRequiredApprovals(amount, rules);

  // Requester auto-approves
  const currentApprovals = [request.requesterId, ...approvals.map(a => a.userId)];
  const uniqueApprovers = [...new Set(currentApprovals)];

  return {
    approved: uniqueApprovers.length >= requiredApprovals,
    current: uniqueApprovers.length,
    required: requiredApprovals,
    pendingFrom: rules.approvers.filter(a => !uniqueApprovers.includes(a.id))
  };
}
```

#### Execution Router

```javascript
// Pick the best execution path
function routeExecution(request) {
  const { fromChain, toChain, fromToken, toToken } = request;

  // Same chain = Uniswap
  if (fromChain === toChain) {
    return { executor: 'uniswap', reason: 'Same chain - direct swap' };
  }

  // USDC to USDC = Circle Gateway (fastest)
  if (fromToken === 'USDC' && toToken === 'USDC') {
    return { executor: 'circle-gateway', reason: 'USDC transfer - instant' };
  }

  // Everything else = LI.FI
  return { executor: 'lifi', reason: 'Cross-chain - finding best route' };
}
```

---

## Final Thought

Crypto doesn't have an adoption problem - it has an **accessibility problem**.

The technology works. The value proposition is real. But asking normal people to navigate seed phrases, gas fees, bridges, and DEXs is asking too much.

Treasury Agent proves a different model: **the interface is conversation, and the complexity is hidden**.

Your family can finally participate - not by learning crypto, but by chatting with an agent that handles it for them.

---

*Treasury Agent — Crypto for everyone, not just experts.*

*EthGlobal HackMoney 2026*
