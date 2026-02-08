import { Link } from "react-router-dom";
import {
  BookOpen,
  Rocket,
  Network,
  CircleDollarSign,
  ArrowLeftRight,
  Layers,
  AtSign,
  MessageSquare,
  Users,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  {
    title: "Quick Start",
    description: "Set up PigAiBank for your family or team in minutes.",
    icon: Rocket,
    path: "/docs/getting-started",
    color: "text-emerald-500",
  },
  {
    title: "System Design",
    description: "Smart routing, n8n orchestration, and the full tech stack.",
    icon: Network,
    path: "/docs/architecture",
    color: "text-amber-500",
  },
  {
    title: "Circle Gateway",
    description: "Instant cross-chain USDC via burn-and-mint. Live tx included.",
    icon: CircleDollarSign,
    path: "/docs/circle-gateway",
    color: "text-emerald-500",
  },
  {
    title: "Uniswap",
    description: "Same-chain swaps via SwapRouter02 with The Graph price data.",
    icon: ArrowLeftRight,
    path: "/docs/uniswap",
    color: "text-pink-500",
  },
  {
    title: "LI.FI",
    description: "Cross-chain swaps with automatic bridge selection and routing.",
    icon: Layers,
    path: "/docs/lifi",
    color: "text-violet-500",
  },
  {
    title: "ENS",
    description: "Human-readable addresses resolved via The Graph.",
    icon: AtSign,
    path: "/docs/ens",
    color: "text-sky-500",
  },
  {
    title: "Discord Commands",
    description: "Full command reference with examples for every intent.",
    icon: MessageSquare,
    path: "/docs/discord-commands",
    color: "text-blue-500",
  },
  {
    title: "N-of-M Approvals",
    description: "Social consensus for transaction security.",
    icon: Users,
    path: "/docs/approvals",
    color: "text-orange-500",
  },
  {
    title: "Dashboard Guide",
    description: "Walkthrough of every dashboard feature.",
    icon: LayoutDashboard,
    path: "/docs/dashboard-guide",
    color: "text-primary",
  },
];

export function DocsOverview() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <BookOpen className="h-4 w-4" />
          Documentation
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">PigAiBank Docs</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          PigAiBank is a Discord-native AI agent that manages crypto for families and
          teams. It swaps, sends, bridges, and reports &mdash; all from a chat message.
          These docs cover every integration, command, and design decision.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path} className="group">
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-200">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      {section.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Target bounties */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Target Bounties</h2>
        <p className="text-sm text-muted-foreground">
          Built for EthGlobal HackMoney 2026, targeting three partner prizes.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm font-semibold text-emerald-500">Circle / Arc</p>
            <p className="text-xs text-muted-foreground">Chain Abstracted USDC Apps</p>
            <p className="text-lg font-bold">$5,000</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm font-semibold text-pink-500">Uniswap</p>
            <p className="text-xs text-muted-foreground">v4 Agentic Finance</p>
            <p className="text-lg font-bold">$5,000</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm font-semibold text-violet-500">LI.FI</p>
            <p className="text-xs text-muted-foreground">Best AI x LI.FI Smart App</p>
            <p className="text-lg font-bold">$2,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
