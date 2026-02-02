# Threshold and Approval Flow - Decision Document

> Please review and answer the questions below to finalize the swap execution and approval logic.

## 1. Transaction Value Thresholds

What dollar value thresholds should trigger different approval requirements?

| Tier | Amount Range | Proposed Behavior |
|------|--------------|-------------------|
| **Micro** | $0 - $100 | Auto-execute, no confirmation |
| **Small** | $100 - $1,000 | Discord notification, auto-execute |
| **Medium** | $1,000 - $10,000 | Discord confirmation required |
| **Large** | $10,000+ | Dashboard + Discord confirmation |

**Questions:**
- [ ] Are these threshold ranges appropriate for your treasury?
- [ ] Should any tier require multi-person approval?
- [ ] What is the maximum single transaction size allowed?

**Your thresholds:**
```
THRESHOLD_AUTO_EXECUTE=     # Max $ for auto-execute (e.g., 100)
THRESHOLD_SINGLE_CONFIRM=   # Max $ for single confirmation (e.g., 10000)
THRESHOLD_MULTI_CONFIRM=    # Above this requires multiple approvers
MAX_SINGLE_TX=              # Absolute max per transaction
```

---

## 2. Confirmation Timeout

How long should the bot wait for human confirmation before canceling?

| Option | Timeout | Use Case |
|--------|---------|----------|
| **Quick** | 5 minutes | Time-sensitive trades |
| **Standard** | 30 minutes | Normal operations |
| **Extended** | 2 hours | Low-urgency rebalancing |

**Questions:**
- [ ] What should the default timeout be?
- [ ] Should different transaction types have different timeouts?
- [ ] What happens on timeout - cancel or escalate?

**Your choice:**
```
CONFIRMATION_TIMEOUT_MINUTES=   # Default: 30
TIMEOUT_ACTION=                 # "cancel" or "escalate"
```

---

## 3. Approver Roles

Who can approve transactions?

| Role | Permissions |
|------|-------------|
| **Admin** | Approve any transaction size |
| **Operator** | Approve up to Medium tier |
| **Viewer** | Read-only, no approvals |

**Questions:**
- [ ] How many approvers do you have?
- [ ] Should approvers be identified by Discord ID or Appwrite user?
- [ ] For POC, is single-approver sufficient?

**Your approvers:**
```
APPROVER_DISCORD_IDS=           # Comma-separated Discord user IDs
# or
APPROVER_APPWRITE_TEAM=         # Appwrite team ID
```

---

## 4. Confirmation Method

How should users confirm transactions?

### Option A: Discord Webhook Only (Simplest)
- Bot posts swap details to Discord
- User triggers `/confirm <tx-id>` command or clicks webhook button
- Requires Discord bot with slash commands

### Option B: Discord Notification + Dashboard (Recommended for POC)
- Bot posts swap details to Discord as notification only
- User goes to dashboard to review and confirm
- Simpler Discord setup (webhooks only, no bot)

### Option C: Full Discord Bot with Buttons
- Interactive buttons in Discord message
- Most polished UX but requires bot setup
- Needs `applications.commands` scope

**Questions:**
- [ ] Which option fits your hackathon timeline?
- [ ] Do you already have a Discord bot set up?

**Your choice:**
```
CONFIRMATION_METHOD=   # "discord_bot", "dashboard", or "webhook_callback"
```

---

## 5. Slippage and Price Protection

What protections should be in place for swaps?

| Setting | Description | Suggested Default |
|---------|-------------|-------------------|
| **Max Slippage** | Maximum allowed slippage % | 1% |
| **Price Deviation** | Cancel if price moved more than X% since request | 5% |
| **Quote Expiry** | Re-quote if older than X seconds | 60s |

**Questions:**
- [ ] What max slippage is acceptable?
- [ ] Should large transactions have stricter slippage limits?

**Your settings:**
```
MAX_SLIPPAGE_PERCENT=           # Default: 1
PRICE_DEVIATION_CANCEL=         # Default: 5
QUOTE_EXPIRY_SECONDS=           # Default: 60
```

---

## 6. Daily/Weekly Limits

Should there be cumulative limits on transaction volume?

| Limit Type | Example | Purpose |
|------------|---------|---------|
| **Daily Volume** | $50,000/day | Prevent runaway automation |
| **Weekly Volume** | $200,000/week | Safety cap |
| **Per-Token Limit** | Max 50% of holdings | Prevent draining single asset |

**Questions:**
- [ ] What daily volume limit makes sense for POC?
- [ ] Should limits reset at midnight UTC or rolling 24h?
- [ ] Should hitting limits alert or hard-block?

**Your limits:**
```
DAILY_VOLUME_LIMIT=             # Max $ per day (0 = unlimited)
WEEKLY_VOLUME_LIMIT=            # Max $ per week
LIMIT_ACTION=                   # "alert" or "block"
```

---

## 7. Alert Escalation

When should the bot escalate beyond normal channels?

| Trigger | Action |
|---------|--------|
| Failed transaction | Alert to Discord |
| 3+ consecutive failures | Alert + pause workflow |
| Limit reached | Alert + block further txs |
| Unusual activity | Alert to secondary channel |

**Questions:**
- [ ] Should failures auto-pause the bot?
- [ ] Who should receive escalation alerts?
- [ ] Should there be a secondary alert channel (email, SMS)?

---

## 8. Audit Trail

What should be logged for each transaction?

**Proposed fields:**
- Timestamp
- Transaction type (swap, rebalance, transfer)
- Requester (workflow, dashboard user, API)
- Amount and tokens
- Quote details (rate, slippage, route)
- Approval status and approver
- Execution result (tx hash or error)
- Gas cost

**Questions:**
- [ ] Any additional fields needed for your reporting?
- [ ] Retention period for logs?

---

## Summary: Your Configuration

Please fill in your choices:

```bash
# Thresholds
THRESHOLD_AUTO_EXECUTE=100
THRESHOLD_SINGLE_CONFIRM=10000
MAX_SINGLE_TX=50000

# Timeouts
CONFIRMATION_TIMEOUT_MINUTES=30
TIMEOUT_ACTION=cancel

# Approvers
APPROVER_DISCORD_IDS=

# Method
CONFIRMATION_METHOD=dashboard

# Protection
MAX_SLIPPAGE_PERCENT=1
PRICE_DEVIATION_CANCEL=5

# Limits
DAILY_VOLUME_LIMIT=50000
LIMIT_ACTION=alert
```

---

## Next Steps

Once you've reviewed and answered the questions above:

1. We'll add these as environment variables to `.env.example`
2. Implement the approval logic in the swap-executor workflow
3. Add threshold checks to the dashboard swap form
4. Set up the appropriate Discord integration

Let me know your answers and any questions!
