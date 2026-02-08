import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Settings,
  ArrowRight,
  Wallet,
  ArrowLeftRight,
  CircleDollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardGuide() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <LayoutDashboard className="h-4 w-4" />
          Reference
        </div>
        <h1 className="text-3xl font-bold">Dashboard Guide</h1>
        <p className="text-lg text-muted-foreground">
          The dashboard is the secondary interface for detailed analytics, execution
          history, and wallet-connected operations. Discord handles day-to-day; the
          dashboard handles the rest.
        </p>
      </div>

      {/* Pages overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pages</h2>
        <div className="space-y-4">
          {[
            {
              icon: LayoutDashboard,
              title: "Dashboard",
              path: "/dashboard",
              features: [
                "Total USDC balance from Circle Gateway",
                "Current ETH price from Uniswap subgraph",
                "Pending executions count",
                "Active alerts count",
                "Per-chain USDC breakdown (Ethereum, Arbitrum, Base)",
                "Quick action buttons: Swap, Transfer, Deposit",
              ],
            },
            {
              icon: BarChart3,
              title: "Analytics",
              path: "/analytics",
              features: [
                "ETH price chart (7D / 30D / 90D views)",
                "Swap volume over time",
                "Summary stats: high/low price, percent change",
                "Total volume and execution count",
              ],
            },
            {
              icon: History,
              title: "History",
              path: "/history",
              features: [
                "Full execution log from Appwrite",
                "Filter by status: All / Completed / Pending / Failed",
                "Status badges with color coding",
                "Block explorer links for each transaction",
                "Confirmation buttons for pending executions",
              ],
            },
            {
              icon: Settings,
              title: "Settings",
              path: "/settings",
              features: [
                "Connection status (Appwrite, n8n)",
                "Alert configuration and management",
                "Environment display",
                "Quick links to n8n and Appwrite console",
              ],
            },
          ].map((page) => {
            const Icon = page.icon;
            return (
              <div key={page.title} className="rounded-lg border bg-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{page.path}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 ml-1">
                  {page.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wallet-connected features */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Wallet-Connected Features</h2>
        <p className="text-muted-foreground">
          Connecting a wallet via RainbowKit unlocks on-chain operations directly from the dashboard.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <CircleDollarSign className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold">Deposit USDC</p>
            <p className="text-xs text-muted-foreground">
              Approve and deposit USDC to Circle Gateway. Adds funds to the treasury's
              chain-abstracted balance.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <ArrowLeftRight className="h-5 w-5 text-pink-500" />
            <p className="text-sm font-semibold">Execute Swaps</p>
            <p className="text-xs text-muted-foreground">
              Open the SwapModal, select tokens and chains. The dashboard uses the same
              smart routing logic as the Discord bot.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Wallet className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold">Sign Transactions</p>
            <p className="text-xs text-muted-foreground">
              All on-chain operations require wallet signature. Supports MetaMask,
              Coinbase Wallet, and WalletConnect.
            </p>
          </div>
        </div>
      </div>

      {/* Smart routing in dashboard */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Smart Routing in Dashboard</h2>
        <p className="text-muted-foreground">
          The SwapModal uses the same three-way routing as the n8n agent:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs space-y-2 overflow-x-auto">
          <p className="text-muted-foreground">// Dashboard swap routing (same logic as n8n)</p>
          <p>{"if (sourceChain === destChain) {"}</p>
          <p className="ml-4"><span className="text-pink-500">// Uniswap</span> — same-chain, direct swap</p>
          <p>{"} else if (sourceToken === \"USDC\" && destToken === \"USDC\") {"}</p>
          <p className="ml-4"><span className="text-emerald-500">// Circle Gateway</span> — instant USDC transfer</p>
          <p>{"} else {"}</p>
          <p className="ml-4"><span className="text-violet-500">// LI.FI</span> — cross-chain with token conversion</p>
          <p>{"}"}</p>
        </div>
      </div>

      {/* Themes */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Themes</h2>
        <p className="text-muted-foreground">
          The dashboard supports three color themes, switchable via the theme toggle
          in the header.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 text-center space-y-2">
            <div className="h-6 w-6 rounded-full bg-white border mx-auto" />
            <p className="text-sm font-medium">Light</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center space-y-2">
            <div className="h-6 w-6 rounded-full bg-slate-900 border mx-auto" />
            <p className="text-sm font-medium">Dark</p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center space-y-2">
            <div className="h-6 w-6 rounded-full bg-purple-900 border mx-auto" />
            <p className="text-sm font-medium">Dusk</p>
          </div>
        </div>
      </div>

      {/* Data sources */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Data</th>
                <th className="text-left p-3 font-medium">Source</th>
                <th className="text-left p-3 font-medium">Refresh</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["USDC Balance", "Circle Gateway API via n8n webhook", "On page load"],
                ["ETH Price", "Uniswap v3 subgraph via The Graph", "Every 5 minutes"],
                ["Executions", "Appwrite database (executions collection)", "On page load"],
                ["Price History", "Appwrite database (price_history collection)", "On page load"],
                ["Alerts", "Appwrite database (alerts collection)", "On page load"],
              ].map(([data, source, refresh]) => (
                <tr key={data} className="border-b last:border-0">
                  <td className="p-3 font-medium">{data}</td>
                  <td className="p-3 text-muted-foreground">{source}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{refresh}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/docs/getting-started"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          Getting Started
        </Link>
        <Link
          to="/docs/architecture"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          System Architecture
        </Link>
      </div>
    </div>
  );
}
