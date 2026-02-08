import { Link } from "react-router-dom";
import { Rocket, MessageSquare, LayoutDashboard, Wallet, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GettingStarted() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <Rocket className="h-4 w-4" />
          Quick Start
        </div>
        <h1 className="text-3xl font-bold">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          PigAiBank has two interfaces: Discord (primary, day-to-day) and the
          Dashboard (detailed settings and history). Here's how to get set up.
        </p>
      </div>

      {/* Step 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          <h2 className="text-xl font-semibold">Join the Discord</h2>
        </div>
        <div className="ml-11 space-y-3">
          <p className="text-muted-foreground">
            PigAiBank lives in your Discord server. The agent responds to
            mentions and commands in any channel it has access to.
          </p>
          <div className="rounded-lg border bg-card p-4 font-mono text-sm space-y-2">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0 mt-0.5">You</Badge>
              <span>@PigAiBank what's our balance?</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="shrink-0 mt-0.5">Agent</Badge>
              <span>You have <strong>$12,340</strong> total &mdash; $8,200 in USDC and $4,140 in ETH.</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Supported intents: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">balance</code>,{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">price</code>,{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">swap</code>,{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">deposit</code>,{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">help</code>.
            See the{" "}
            <Link to="/docs/discord-commands" className="text-primary underline underline-offset-4">
              Discord Commands
            </Link>{" "}
            reference for details.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </span>
          <h2 className="text-xl font-semibold">Open the Dashboard</h2>
        </div>
        <div className="ml-11 space-y-3">
          <p className="text-muted-foreground">
            The dashboard gives you detailed analytics, execution history, and
            settings that don't fit into Discord chat. No account needed to browse.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: LayoutDashboard, label: "Dashboard", desc: "Balances, quick actions, chain breakdown" },
              { icon: MessageSquare, label: "History", desc: "Full log of every swap, transfer, and alert" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-card p-4 flex items-start gap-3">
                <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            3
          </span>
          <h2 className="text-xl font-semibold">Connect your wallet (optional)</h2>
        </div>
        <div className="ml-11 space-y-3">
          <p className="text-muted-foreground">
            For on-chain actions from the dashboard (depositing USDC, executing swaps
            directly), connect a wallet via RainbowKit. Supports MetaMask, Coinbase Wallet,
            WalletConnect, and more.
          </p>
          <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
            <Wallet className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Wallet-connected features</p>
              <p className="text-xs text-muted-foreground">
                Deposit USDC to Circle Gateway, execute LI.FI swaps, and sign
                transactions directly from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            4
          </span>
          <h2 className="text-xl font-semibold">Try a command</h2>
        </div>
        <div className="ml-11 space-y-3">
          <p className="text-muted-foreground">
            Start with something simple. The agent understands natural language,
            so you don't need to memorize syntax.
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2 font-mono text-sm">
            <p className="text-muted-foreground"># Check balance</p>
            <p>@PigAiBank what's our balance?</p>
            <p className="text-muted-foreground mt-3"># Check ETH price</p>
            <p>@PigAiBank what's the price of ETH?</p>
            <p className="text-muted-foreground mt-3"># Request a swap</p>
            <p>@PigAiBank swap 1 USDC to ETH on Arbitrum</p>
            <p className="text-muted-foreground mt-3"># Send to an ENS name</p>
            <p>@PigAiBank send $100 to alex.eth</p>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-3">
        <h3 className="font-semibold">What's next?</h3>
        <div className="space-y-2">
          <Link
            to="/docs/architecture"
            className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
          >
            <ArrowRight className="h-4 w-4" />
            Understand the system architecture
          </Link>
          <Link
            to="/docs/discord-commands"
            className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
          >
            <ArrowRight className="h-4 w-4" />
            See all Discord commands
          </Link>
          <Link
            to="/docs/circle-gateway"
            className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
          >
            <ArrowRight className="h-4 w-4" />
            Explore the Circle Gateway integration
          </Link>
        </div>
      </div>
    </div>
  );
}
