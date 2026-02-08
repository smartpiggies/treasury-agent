import { Link } from "react-router-dom";
import {
  Layers,
  ExternalLink,
  ArrowRight,
  Globe,
  Route,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LifiIntegration() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400">
          <Layers className="h-4 w-4" />
          Integration
        </div>
        <h1 className="text-3xl font-bold">LI.FI</h1>
        <p className="text-lg text-muted-foreground">
          Cross-chain swaps with automatic bridge selection across 57 EVM chains.
          The invisible execution layer that makes "just chat" possible.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-violet-600 dark:text-violet-400 border-violet-500/30">
            <Globe className="h-3 w-3 mr-1" />
            57 chains
          </Badge>
          <Badge variant="outline">
            Bounty: $2,000
          </Badge>
        </div>
      </div>

      {/* Why LI.FI */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Why LI.FI?</h2>
        <p className="text-muted-foreground">
          When a family member says "move some ETH to stablecoins," they don't know
          (or need to know) about bridges, DEXs, or routing. LI.FI finds the optimal
          route across chains &mdash; the user just sees results.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Route className="h-5 w-5 text-violet-500" />
            <p className="text-sm font-semibold">Auto-routing</p>
            <p className="text-xs text-muted-foreground">LI.FI picks the best bridge protocol automatically (Stargate, Hop, etc.).</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Globe className="h-5 w-5 text-violet-500" />
            <p className="text-sm font-semibold">Any Token Pair</p>
            <p className="text-xs text-muted-foreground">Not limited to USDC. Supports any token pair across any supported chain.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Shield className="h-5 w-5 text-violet-500" />
            <p className="text-sm font-semibold">ERC-20 Approval Flow</p>
            <p className="text-xs text-muted-foreground">Checks existing allowance before every swap, approves only if insufficient.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="space-y-3">
          {[
            "Agent receives swap request and detects cross-chain (e.g. Arbitrum to Base)",
            "Routes to LI.FI — requests a quote with source/dest chains and tokens",
            "LI.FI returns the optimal route (bridge protocol + DEX routing)",
            "Checks ERC-20 allowance for LiFi Diamond contract; approves if needed",
            "Sends the transaction with LI.FI-provided calldata",
            "LI.FI handles bridging and delivers tokens on destination chain",
            "Records execution in Appwrite and reports to Discord",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live transactions - two of them */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Live Transactions</h2>
        <p className="text-sm text-muted-foreground">
          Two verified mainnet transactions &mdash; one via n8n, one via the dashboard.
        </p>

        {/* n8n tx */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Badge variant="outline" className="text-xs">n8n</Badge>
            USDC (Arbitrum) &rarr; USDC (Base)
          </h3>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["TX Hash", <a key="tx1" href="https://arbiscan.io/tx/0xc30d44a155374d0545ea882722921fc00c41afdd719bbabc154641b62bad1207" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 break-all">0xc30d...1207 <ExternalLink className="h-3 w-3 shrink-0" /></a>],
                  ["Route", "Arbitrum → Base"],
                  ["Input", "1 USDC"],
                  ["Output", "0.9975 USDC"],
                  ["Bridge", "Mayan + Circle CCTP"],
                  ["Gas Cost", "~$0.02"],
                ].map(([label, value]) => (
                  <tr key={label as string} className="border-b last:border-0">
                    <td className="p-3 font-medium text-muted-foreground w-28">{label}</td>
                    <td className="p-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dashboard tx */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Dashboard</Badge>
            USDC (Base) &rarr; ETH (Arbitrum)
          </h3>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["TX Hash", <a key="tx2" href="https://basescan.org/tx/0xdf0afa3662ef55dcf46ac205750e29ace068e10f971e6a4bee195921c5722a43" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 break-all">0xdf0a...2a43 <ExternalLink className="h-3 w-3 shrink-0" /></a>],
                  ["Route", "Base → Arbitrum"],
                  ["Input", "1 USDC"],
                  ["Output", "~$0.99 in ETH"],
                  ["Bridge", "NEAR"],
                  ["Executed Via", "Dashboard SwapModal (wallet-connected)"],
                ].map(([label, value]) => (
                  <tr key={label as string} className="border-b last:border-0">
                    <td className="p-3 font-medium text-muted-foreground w-28">{label}</td>
                    <td className="p-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two execution modes */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Two Execution Modes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold">n8n (Agent-driven)</p>
            <p className="text-xs text-muted-foreground">
              User requests a swap via Discord. The n8n agent fetches quote from
              LI.FI API, checks allowance, signs and submits the transaction using
              the treasury wallet's private key.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <p className="text-sm font-semibold">Dashboard (Wallet-connected)</p>
            <p className="text-xs text-muted-foreground">
              User opens SwapModal, selects tokens and chains. The dashboard fetches
              quote, handles approval, and the user signs the transaction in their
              wallet (MetaMask, etc.).
            </p>
          </div>
        </div>
      </div>

      {/* Technical details */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Technical Details</h2>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3 text-sm">
          <div>
            <p className="font-medium">ERC-20 Approval</p>
            <p className="text-muted-foreground">
              Checks existing allowance before every swap and approves only if
              insufficient. This was the root cause of initial failures &mdash; not
              calldata issues.
            </p>
          </div>
          <div>
            <p className="font-medium">LiFi Diamond Router</p>
            <p className="text-muted-foreground">
              Address: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE</code>.
              All swaps route through this contract.
            </p>
          </div>
          <div>
            <p className="font-medium">Same Routing Logic</p>
            <p className="text-muted-foreground">
              Both n8n and dashboard use the same three-way routing: Uniswap for
              same-chain, LI.FI for cross-chain, Circle Gateway for USDC-only.
            </p>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="rounded-xl border-2 border-violet-500/20 bg-violet-500/5 p-6 space-y-3">
        <h3 className="font-semibold">When does the agent use LI.FI?</h3>
        <p className="text-sm text-muted-foreground">
          When the swap is <strong>cross-chain with token conversion</strong> (e.g.
          USDC on Arbitrum &rarr; ETH on Base). For USDC-only cross-chain, the agent
          uses{" "}
          <Link to="/docs/circle-gateway" className="text-primary underline underline-offset-4">Circle Gateway</Link>{" "}
          (faster). For same-chain,{" "}
          <Link to="/docs/uniswap" className="text-primary underline underline-offset-4">Uniswap</Link>{" "}
          (cheaper).
        </p>
        <div className="rounded-lg bg-card border p-3 font-mono text-xs">
          <p className="text-muted-foreground">// Routing logic</p>
          <p>if (fromChain !== toChain && !(fromToken === "USDC" && toToken === "USDC")) {"{"}</p>
          <p className="ml-4">route = "lifi"; <span className="text-violet-500">// best bridge auto-routing</span></p>
          <p>{"}"}</p>
        </div>
      </div>

      {/* Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/docs/circle-gateway"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          Circle Gateway integration
        </Link>
        <Link
          to="/docs/ens"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          ENS integration
        </Link>
      </div>
    </div>
  );
}
