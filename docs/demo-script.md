# PigAiBank Demo Script

**Duration:** 3 minutes
**Format:** Screen recording of Discord + brief dashboard view
**Network:** Mainnet (Arbitrum + Base L2s)
**Budget:** $100 USDC ($50 on each chain)

---

## Narrative

> "Meet the Johnson family. They want to invest in crypto together, but Mom isn't technical, the kids are busy, and Dad doesn't want to be the single point of failure holding all the keys. PigAiBank lets them manage their crypto through Discord chat - no wallets to learn, no scary interfaces, just conversation."

---

## Pre-Demo Setup

### Discord Server
- Server name: "Johnson Family" or "Family Treasury"
- Channel: #treasury
- Members with visible names:
  - Dad (Admin)
  - Mom (Admin)
  - Alex (Member)
  - Sam (Member)
  - PigAiBank (Bot)

### Wallet State
- EOA wallet connected to n8n
- $50 USDC on Arbitrum
- $50 USDC on Base
- Small ETH for gas on both chains (~$2 worth each)

### Approval Rules (shown in dashboard or mentioned)
- Under $25: Auto-execute
- $25-$100: 2 approvals required
- Over $100: 2 admin approvals required

---

## Scene 1: Introduction (0:00 - 0:30)

**[Show Discord server with family members listed]**

**Voiceover:**
> "The Johnson family has $100 in crypto spread across two blockchain networks. Mom and Dad are admins who can approve transactions. Alex and Sam are members who can request and participate in approvals. Let's see how they manage their money - just by chatting."

**Visual:** Discord server sidebar showing members, #treasury channel open

---

## Scene 2: Check Balance (0:30 - 1:00)

**[Mom types in Discord]**

```
Mom: @PigAiBank what's our balance?
```

**[Agent responds within 2-3 seconds]**

```
PigAiBank: Good morning! Here's where you stand:

💰 Total: $100.42

Breakdown:
• $50.21 USDC on Arbitrum
• $50.21 USDC on Base

Everything's stable today. Nothing needs your attention.
```

**Voiceover:**
> "Mom asks a simple question and gets a simple answer. She doesn't need to know what Arbitrum or Base are - just that the family has about $100. The agent shows a unified balance across all chains."

**Key Points to Highlight:**
- Plain English response
- Unified balance (not per-chain confusion)
- Conversational tone
- No jargon

---

## Scene 3: Small Auto-Execute Swap (1:00 - 1:45)

**[Alex types in Discord]**

```
Alex: @PigAiBank swap $10 to ETH
```

**[Agent responds]**

```
PigAiBank: Got it! $10 is under your auto-approve limit, so I'll do this now.

Swapping $10 USDC → ETH on Arbitrum...
```

**[Few seconds pass, agent updates]**

```
PigAiBank: Done! ✓

Bought 0.0029 ETH (about $10.00)
Fee: $0.03

Your balance now:
• $80.39 USDC
• $10.00 in ETH

Transaction: arbiscan.io/tx/0x7f3a... (link)
```

**Voiceover:**
> "Alex wants to buy a little ETH. Since it's under $25, the agent just does it - no approval needed for small amounts. Notice Alex didn't specify which chain, gas settings, or slippage. The agent handled all of that. Alex just said what they wanted."

**Key Points to Highlight:**
- Small amounts = no friction
- Agent picks the chain automatically
- Plain English confirmation
- Real transaction link (proves it's mainnet)

---

## Scene 4: N-of-M Approval Flow (1:45 - 2:45)

**[Dad types in Discord]**

```
Dad: @PigAiBank swap $30 USDC to ETH
```

**[Agent responds]**

```
PigAiBank: This swap is over $25, so I need one more person to approve.

📋 Pending Approval
━━━━━━━━━━━━━━━━━━
Swap: $30 USDC → ETH
Requested by: Dad
Current price: 1 ETH = $3,450

Need 1 more approval from: @Mom, @Alex, or @Sam
Reply ✅ to approve or ❌ to reject
Expires in 30 minutes
```

**[Mom replies]**

```
Mom: ✅
```

**[Agent confirms and executes]**

```
PigAiBank: Approved by Dad + Mom ✓

Swapping $30 USDC → ETH on Arbitrum...
```

**[Few seconds pass]**

```
PigAiBank: Done! ✓

Bought 0.0087 ETH (about $30.00)
Approved by: Dad, Mom

Your ETH is now worth $40.00 total.
Remaining USDC: $50.39

Transaction: arbiscan.io/tx/0x8b2c... (link)
```

**Voiceover:**
> "For larger amounts, the agent requires family consensus. Dad wants to swap $30, so the agent asks for one more approval. Mom confirms with a simple checkmark emoji. This is social multi-sig - arguably more secure than traditional crypto wallets because an attacker would need to compromise multiple family members, not just steal one phone."

**Key Points to Highlight:**
- Threshold-based approval tiers
- Simple emoji approval (not complex signing)
- Shows who approved
- Family members are equal participants
- 30-minute timeout for safety

---

## Scene 5: Cross-Chain Transfer (2:45 - 3:15)

**[Mom types in Discord]**

```
Mom: @PigAiBank move $20 to Base
```

**[Agent responds]**

```
PigAiBank: Moving $20 USDC from Arbitrum to Base...

Using Circle Gateway - this should be instant.
```

**[1-2 seconds pass]**

```
PigAiBank: Done! ✓

$20 USDC arrived on Base.

Updated balance:
• Arbitrum: $30.39 USDC + $40.00 ETH
• Base: $70.21 USDC

Total: $140.60
```

**Voiceover:**
> "Mom wants to move money to Base. She doesn't say 'bridge my assets' or worry about which bridge is safest. She just says 'move $20 to Base' and it happens in under a second. The agent used Circle Gateway for instant settlement - but Mom doesn't need to know that."

**Key Points to Highlight:**
- No bridge jargon
- Instant transfer (Circle Gateway)
- User doesn't pick the method
- Balance updates immediately

---

## Scene 6: Dashboard Glimpse (3:15 - 3:30)

**[Switch to dashboard view briefly]**

**Voiceover:**
> "For full history, settings, and detailed analytics, there's a dashboard. This is where you'd configure approval rules, add family members, or export data for taxes. But for day-to-day? Just chat."

**Visual:** Quick pan across dashboard showing:
- Transaction history list
- Balance chart
- Approval rules settings
- Family members list

---

## Closing (3:30 - 3:45)

**[Back to Discord view]**

**Voiceover:**
> "PigAiBank. Crypto for families - not just experts. No seed phrases to lose, no interfaces to learn, no single point of failure. Just chat with your agent, and it handles the complexity."

**Visual:** Discord chat with the conversation history visible

**End card:**
```
PigAiBank
"Crypto without the complexity"

github.com/[repo]
```

---

## Backup Plans

### If Circle Gateway is unavailable:
- Use LI.FI for cross-chain transfer instead
- Takes ~30 seconds instead of instant
- Script change: "Using LI.FI bridge - should take about 30 seconds"

### If approval times out during recording:
- Pre-record Scene 4 separately
- Or have Mom ready to approve immediately

### If gas spikes unexpectedly:
- All L2 transactions should still be < $0.50
- Have extra ETH in wallet just in case

### If swap fails:
- Have a retry ready
- Can edit out failed attempt in post

---

## Recording Checklist

**Before Recording:**
- [ ] Discord server set up with all members
- [ ] Wallet has $50 USDC on Arbitrum
- [ ] Wallet has $50 USDC on Base
- [ ] Wallet has ~$2 ETH on each chain for gas
- [ ] n8n workflows active and tested
- [ ] Dashboard accessible
- [ ] Screen recording software ready (OBS recommended)
- [ ] Microphone tested for voiceover
- [ ] Notifications silenced on all devices

**Test Run:**
- [ ] Balance query works
- [ ] Small swap executes
- [ ] Approval flow triggers correctly
- [ ] Cross-chain transfer completes
- [ ] All Discord messages format correctly

**During Recording:**
- [ ] Move mouse smoothly, don't rush
- [ ] Pause briefly after each agent response (let viewer read)
- [ ] Keep Discord window clean (no other servers visible)

**After Recording:**
- [ ] Trim dead air
- [ ] Add voiceover if not recorded live
- [ ] Add subtle background music (optional)
- [ ] Add end card with links
- [ ] Export at 1080p minimum

---

## Transaction Log (fill during demo)

| Scene | Action | Tx Hash | Cost |
|-------|--------|---------|------|
| 3 | Swap $10 USDC → ETH | | |
| 4 | Swap $30 USDC → ETH | | |
| 5 | Move $20 USDC Arb→Base | | |

**Starting Balance:** $100.00
**Ending Balance:** $___
**Total Spent on Fees:** $___

---

## Key Messages to Convey

1. **Accessibility**: "Your mom can use this"
2. **Security**: "Social consensus, not single point of failure"
3. **Simplicity**: "Just chat - the agent handles complexity"
4. **Real**: "Mainnet transactions, real money"
5. **Family-friendly**: "Everyone participates, no one is locked out"
