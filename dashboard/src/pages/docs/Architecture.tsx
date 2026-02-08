import { Link } from "react-router-dom";
import {
  Network,
  MessageSquare,
  Workflow,
  Bot,
  ArrowLeftRight,
  Database,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Architecture() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
          <Network className="h-4 w-4" />
          Architecture
        </div>
        <h1 className="text-3xl font-bold">System Design</h1>
        <p className="text-lg text-muted-foreground">
          How Discord messages become on-chain transactions. Every layer is
          observable, auditable, and recoverable.
        </p>
      </div>

      {/* Data flow */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Flow</h2>
        <p className="text-muted-foreground">
          A user message in Discord triggers a webhook to n8n, where the AI agent
          parses intent, resolves addresses, selects the optimal protocol, executes
          on-chain, logs to Appwrite, and reports back.
        </p>

        <div className="space-y-3">
          {[
            { icon: MessageSquare, label: "Discord", desc: "User sends natural language message", color: "text-blue-500", border: "border-blue-500/20" },
            { icon: Workflow, label: "n8n Orchestrator", desc: "6 workflows, 40+ nodes — validates, routes, executes, recovers", color: "text-amber-500", border: "border-amber-500/20" },
            { icon: Bot, label: "AI Agent", desc: "Parses intent, resolves ENS, picks protocol, builds transaction", color: "text-primary", border: "border-primary/20" },
            { icon: ArrowLeftRight, label: "Protocol Layer", desc: "Uniswap (same-chain) / LI.FI (cross-chain) / Circle Gateway (USDC)", color: "text-pink-500", border: "border-pink-500/20" },
            { icon: Database, label: "Appwrite", desc: "Logs execution, updates balances, stores price history", color: "text-emerald-500", border: "border-emerald-500/20" },
          ].map((step, i) => (
            <div key={step.label}>
              <div className={`rounded-lg border ${step.border} bg-card p-4 flex items-start gap-4`}>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
              {i < 4 && (
                <div className="flex justify-center">
                  <div className="w-px h-3 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Smart routing */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Smart Routing</h2>
        <p className="text-muted-foreground">
          The agent automatically selects the optimal execution path based on chain,
          token, and cost. Users never choose a protocol — the agent handles it.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/docs/uniswap" className="group">
            <div className="rounded-lg border border-pink-500/20 bg-card p-4 space-y-2 hover:border-pink-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                <p className="text-sm font-semibold">Same-chain swap</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Uniswap via SwapRouter02. Fastest and cheapest when source and
                destination are on the same chain.
              </p>
              <p className="text-xs text-pink-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
          <Link to="/docs/lifi" className="group">
            <div className="rounded-lg border border-violet-500/20 bg-card p-4 space-y-2 hover:border-violet-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                <p className="text-sm font-semibold">Cross-chain swap</p>
              </div>
              <p className="text-sm text-muted-foreground">
                LI.FI auto-routing across 57 chains. Finds the best bridge and
                DEX route automatically.
              </p>
              <p className="text-xs text-violet-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
          <Link to="/docs/circle-gateway" className="group">
            <div className="rounded-lg border border-emerald-500/20 bg-card p-4 space-y-2 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold">USDC cross-chain</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Circle Gateway &mdash; instant (&lt;500ms) burn-and-mint. The fastest
                option for moving USDC between chains.
              </p>
              <p className="text-xs text-emerald-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* n8n Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">n8n Workflows</h2>
        <p className="text-muted-foreground">
          All orchestration runs on self-hosted n8n. Each workflow is a structured
          pipeline with validation, error handling, and Discord reporting.
        </p>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Workflow</th>
                <th className="text-left p-3 font-medium">Trigger</th>
                <th className="text-left p-3 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Daily Report", "9 AM daily", "Circle balance + ETH price to Discord"],
                ["Price Monitor", "Every 5 min", "ETH price alerts on threshold cross"],
                ["Swap Executor", "Webhook", "Validate, route, execute, log, notify"],
                ["Discord Handler", "Webhook", "Parse intents: balance, price, swap, deposit"],
                ["Weekly Summary", "Monday 8 AM", "Aggregated stats to Discord"],
                ["Error Handler", "Error trigger", "Catch failures, notify team"],
              ].map(([name, trigger, purpose]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="p-3 font-medium">{name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{trigger}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech stack */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { category: "Orchestration", items: ["n8n (self-hosted)", "6 workflows", "40+ nodes"] },
            { category: "Frontend", items: ["React 18 + TypeScript", "Vite + Tailwind CSS", "shadcn/ui components"] },
            { category: "Wallet", items: ["RainbowKit", "Wagmi + Viem", "MetaMask, Coinbase, WalletConnect"] },
            { category: "Data", items: ["Appwrite (self-hosted)", "4 collections", "Real-time queries"] },
            { category: "On-chain", items: ["ethers.js v6", "EIP-712 signing", "Multi-chain (Eth, Arb, Base)"] },
            { category: "Infrastructure", items: ["Hostinger VPS", "Docker containers", "Custom n8n image"] },
          ].map((stack) => (
            <div key={stack.category} className="rounded-lg border bg-card p-4 space-y-2">
              <p className="text-sm font-semibold">{stack.category}</p>
              <ul className="space-y-1">
                {stack.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Agent loop */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Agent Loop</h2>
        <p className="text-muted-foreground">
          The agent follows a continuous cycle: Monitor, Decide, Execute, Report.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Monitor", desc: "Watch prices, track balances, detect changes", color: "bg-blue-500" },
            { label: "Decide", desc: "Check thresholds, determine if approval needed", color: "bg-amber-500" },
            { label: "Execute", desc: "Route to optimal protocol, sign and submit tx", color: "bg-emerald-500" },
            { label: "Report", desc: "Log to Appwrite, notify Discord, update dashboard", color: "bg-violet-500" },
          ].map((step) => (
            <div key={step.label} className="rounded-lg border bg-card p-4 text-center space-y-2">
              <div className={`h-3 w-3 rounded-full ${step.color} mx-auto`} />
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
