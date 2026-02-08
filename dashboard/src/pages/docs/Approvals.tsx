import { Link } from "react-router-dom";
import {
  Users,
  ArrowRight,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Approvals() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
          <Users className="h-4 w-4" />
          Reference
        </div>
        <h1 className="text-3xl font-bold">N-of-M Approvals</h1>
        <p className="text-lg text-muted-foreground">
          Social consensus for transaction security. Large transactions require
          multiple family members to approve via Discord reactions before execution.
        </p>
      </div>

      {/* Why */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Why Social Consensus?</h2>
        <p className="text-muted-foreground">
          Traditional crypto relies on a single person holding a seed phrase or 2FA device.
          PigAiBank uses a fundamentally different model: multiple real people must agree.
        </p>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Traditional</th>
                <th className="text-left p-3 font-medium">PigAiBank</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["One person holds seed phrase", "Multiple people must agree"],
                ["2FA protects one account", "Social consensus required"],
                ["If phone is stolen, funds at risk", "Attacker needs multiple family members"],
                ["Single point of failure", "Distributed trust"],
              ].map(([trad, pig], i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="p-3 text-muted-foreground">{trad}</td>
                  <td className="p-3 font-medium">{pig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tiers */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Approval Tiers</h2>
        <p className="text-muted-foreground">
          The agent checks the transaction amount against configurable thresholds
          and requires the appropriate number of approvals.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { tier: "Micro", range: "Under $100", behavior: "Auto-execute", color: "bg-emerald-500" },
            { tier: "Small", range: "$100 - $1,000", behavior: "1 admin approval", color: "bg-blue-500" },
            { tier: "Medium", range: "$1,000 - $5,000", behavior: "2 approvals (any member)", color: "bg-amber-500" },
            { tier: "Large", range: "Over $5,000", behavior: "2 admin approvals required", color: "bg-red-500" },
          ].map((t) => (
            <div key={t.tier} className="rounded-lg border bg-card p-4 flex items-start gap-3">
              <div className={`h-3 w-3 rounded-full ${t.color} shrink-0 mt-1`} />
              <div>
                <p className="text-sm font-semibold">{t.tier} <span className="text-muted-foreground font-normal">({t.range})</span></p>
                <p className="text-xs text-muted-foreground">{t.behavior}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example flow */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Example Flow</h2>
        <div className="rounded-lg border bg-card p-5 font-mono text-sm space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5 text-xs">Alex</Badge>
            <span>@PigAiBank swap $2000 ETH to USDC</span>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="shrink-0 mt-0.5 text-xs">Agent</Badge>
            <div>
              <p>Alex wants to swap <strong>$2,000 ETH &rarr; USDC</strong></p>
              <p className="text-muted-foreground mt-1">This needs <strong>2 approvals</strong>. Alex counts as 1 (requester auto-approves).</p>
              <p className="text-muted-foreground">Need 1 more from: @Dad @Mom @Sam</p>
              <p className="text-muted-foreground">React with &#x2705; to approve or &#x274C; to reject.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5 text-xs">Mom</Badge>
            <span>&#x2705;</span>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="shrink-0 mt-0.5 text-xs">Agent</Badge>
            <div>
              <p>Approved by Alex + Mom (2/2). Executing swap now...</p>
              <p className="text-muted-foreground mt-1">Done! Swapped $2,000 ETH to 1,998.50 USDC via Uniswap. <span className="text-primary">Tx confirmed.</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Member Roles</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Permissions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">
                  <Badge className="text-xs">Admin</Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  Approve any transaction size. Required for Large tier.
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">Member</Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  Approve up to Medium tier. Can request any transaction.
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <Badge variant="secondary" className="text-xs">Viewer</Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  Read-only access. Can check balances and prices but cannot approve or request transactions.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeout & safety */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Timeout & Safety</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-semibold">Timeout</p>
            <p className="text-xs text-muted-foreground">
              Pending approvals expire after 30 minutes (configurable). On timeout,
              the transaction is canceled and the requester is notified.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-semibold">Rejection</p>
            <p className="text-xs text-muted-foreground">
              Any member can react with &#x274C; to reject. A single rejection cancels
              the transaction immediately and notifies the group.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-semibold">Slippage Protection</p>
            <p className="text-xs text-muted-foreground">
              If the price moves more than 5% between request and execution, the
              agent cancels and re-quotes.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Users className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-semibold">Audit Trail</p>
            <p className="text-xs text-muted-foreground">
              Every approval, rejection, and execution is logged to Appwrite with
              full context: who requested, who approved, timestamps, tx hash.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs space-y-1 overflow-x-auto">
          <p className="text-muted-foreground"># Thresholds</p>
          <p>THRESHOLD_AUTO_EXECUTE=100</p>
          <p>THRESHOLD_SINGLE_CONFIRM=1000</p>
          <p>MAX_SINGLE_TX=50000</p>
          <p className="mt-2 text-muted-foreground"># Timeouts</p>
          <p>CONFIRMATION_TIMEOUT_MINUTES=30</p>
          <p>TIMEOUT_ACTION=cancel</p>
          <p className="mt-2 text-muted-foreground"># Protection</p>
          <p>MAX_SLIPPAGE_PERCENT=1</p>
          <p>PRICE_DEVIATION_CANCEL=5</p>
          <p className="mt-2 text-muted-foreground"># Daily limits</p>
          <p>DAILY_VOLUME_LIMIT=50000</p>
          <p>LIMIT_ACTION=alert</p>
        </div>
      </div>

      {/* Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/docs/discord-commands"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          Discord Commands
        </Link>
        <Link
          to="/docs/dashboard-guide"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          Dashboard Guide
        </Link>
      </div>
    </div>
  );
}
