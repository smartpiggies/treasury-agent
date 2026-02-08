import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Coins,
  ArrowLeftRight,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Github,
  Wallet,
  CircleDollarSign,
  Layers,
  Zap,
  AtSign,
  ShieldCheck,
  Bot,
  Eye,
  AlertTriangle,
  Workflow,
  Terminal,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";

/* ───────────────────────────── Data ───────────────────────────── */

interface Feature {
  icon: typeof Bot;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: AtSign,
    title: "ENS Name Resolution",
    description:
      "Send to human-readable addresses like dad.eth instead of raw hex addresses. Resolved via The Graph decentralized network.",
  },
  {
    icon: Coins,
    title: "Unified USDC Balance",
    description:
      "Circle Gateway provides a single balance view across Ethereum, Arbitrum, and Base. No bridging required.",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart Swap Routing",
    description:
      "The agent automatically picks Uniswap, LI.FI, or Circle Gateway based on chain, token, and cost. Users never choose.",
  },
  {
    icon: Users,
    title: "N-of-M Approvals",
    description:
      "Large transactions require multiple family members to approve via Discord reactions before execution.",
  },
  {
    icon: MessageSquare,
    title: "Discord Native",
    description:
      "No app to install, no UI to learn. The conversation is the interface. Works wherever Discord works.",
  },
  {
    icon: TrendingUp,
    title: "Price Monitoring",
    description:
      "Automated ETH price tracking via Uniswap v3 subgraph. Threshold alerts delivered straight to your Discord.",
  },
];

interface Integration {
  icon: typeof Bot;
  name: string;
  role: string;
  description: string;
  color: string;
}

const integrations: Integration[] = [
  {
    icon: CircleDollarSign,
    name: "Circle Gateway",
    role: "Chain-abstracted USDC",
    description:
      "Instant cross-chain USDC transfers in under 500ms. One unified balance across 20 supported chains.",
    color: "text-emerald-500",
  },
  {
    icon: ArrowLeftRight,
    name: "Uniswap",
    role: "Same-chain swaps",
    description:
      "Direct on-chain swaps via SwapRouter02 with pool data from The Graph. Fastest and cheapest for same-chain trades.",
    color: "text-pink-500",
  },
  {
    icon: Layers,
    name: "LI.FI",
    role: "Cross-chain routing",
    description:
      "Cross-chain swaps across 57 EVM chains with automatic bridge selection. Quote, approve, and execute in one agent action.",
    color: "text-violet-500",
  },
  {
    icon: AtSign,
    name: "ENS",
    role: "Name resolution",
    description:
      "Human-readable addresses via The Graph. Send to dad.eth instead of 0x742d35Cc... The agent handles resolution.",
    color: "text-sky-500",
  },
];

const TW_CDN = "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains";

interface ChainInfo {
  name: string;
  /** Trust Wallet assets slug — omit for initials fallback */
  tw?: string;
}

/** Circle Gateway (CCTP) supported chains — 20 mainnet domains */
const gatewayChains: ChainInfo[] = [
  { name: "Ethereum", tw: "ethereum" },
  { name: "Avalanche", tw: "avalanchec" },
  { name: "OP Mainnet", tw: "optimism" },
  { name: "Arbitrum", tw: "arbitrum" },
  { name: "Solana", tw: "solana" },
  { name: "Base", tw: "base" },
  { name: "Polygon", tw: "polygon" },
  { name: "Unichain" },
  { name: "Linea", tw: "linea" },
  { name: "Codex" },
  { name: "Sonic", tw: "sonic" },
  { name: "World Chain" },
  { name: "Monad" },
  { name: "Sei", tw: "sei" },
  { name: "BNB Chain", tw: "smartchain" },
  { name: "XDC", tw: "xdc" },
  { name: "HyperEVM" },
  { name: "Ink" },
  { name: "Plume" },
  { name: "Starknet", tw: "starknet" },
];

/** LI.FI supported EVM chains — 57 chains */
const lifiChains: ChainInfo[] = [
  { name: "Ethereum", tw: "ethereum" },
  { name: "Arbitrum", tw: "arbitrum" },
  { name: "Base", tw: "base" },
  { name: "Hyperliquid" },
  { name: "HyperEVM" },
  { name: "Monad" },
  { name: "BSC", tw: "smartchain" },
  { name: "OP Mainnet", tw: "optimism" },
  { name: "Polygon", tw: "polygon" },
  { name: "Avalanche", tw: "avalanchec" },
  { name: "Gnosis", tw: "xdai" },
  { name: "Metis", tw: "metis" },
  { name: "Lisk" },
  { name: "FUSE", tw: "fuse" },
  { name: "Moonbeam", tw: "moonbeam" },
  { name: "Unichain" },
  { name: "Sei", tw: "sei" },
  { name: "Immutable zkEVM" },
  { name: "Flare", tw: "flare" },
  { name: "Sonic", tw: "sonic" },
  { name: "Vana" },
  { name: "Gravity" },
  { name: "Taiko" },
  { name: "Soneium" },
  { name: "Swellchain" },
  { name: "Ronin", tw: "ronin" },
  { name: "opBNB", tw: "opbnb" },
  { name: "Corn" },
  { name: "Lens" },
  { name: "Cronos", tw: "cronos" },
  { name: "Fraxtal" },
  { name: "Abstract" },
  { name: "Boba", tw: "boba" },
  { name: "Rootstock" },
  { name: "zkSync", tw: "zksync" },
  { name: "Apechain" },
  { name: "Mode" },
  { name: "Celo", tw: "celo" },
  { name: "Etherlink" },
  { name: "Hemi" },
  { name: "World Chain" },
  { name: "XDC", tw: "xdc" },
  { name: "Mantle", tw: "mantle" },
  { name: "Sophon" },
  { name: "Scroll", tw: "scroll" },
  { name: "Superposition" },
  { name: "Ink" },
  { name: "Linea", tw: "linea" },
  { name: "BOB" },
  { name: "Flow" },
  { name: "Katana" },
  { name: "Berachain" },
  { name: "Blast", tw: "blast" },
  { name: "Kaia", tw: "klaytn" },
  { name: "Viction" },
  { name: "Plasma" },
  { name: "Plume" },
];

/* ───────────────────────────── Components ───────────────────────────── */

function FadeInSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

function ChainIcon({ chain, size = "sm" }: { chain: ChainInfo; size?: "sm" | "md" }) {
  const [imgError, setImgError] = useState(false);
  const initials = chain.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const dim = size === "md" ? "h-6 w-6" : "h-5 w-5";
  const textSize = size === "md" ? "text-[10px]" : "text-[9px]";

  if (chain.tw && !imgError) {
    return (
      <img
        src={`${TW_CDN}/${chain.tw}/info/logo.png`}
        alt={chain.name}
        className={`${dim} rounded-full object-cover`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      className={`${dim} rounded-full bg-muted flex items-center justify-center ${textSize} font-bold text-muted-foreground shrink-0`}
    >
      {initials}
    </span>
  );
}

/** Interactive SVG architecture diagram */
function ArchitectureDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  const routes = [
    { id: "uniswap", label: "Uniswap", desc: "Same-chain swaps", y: 30, color: "rgb(236, 72, 153)" },
    { id: "lifi", label: "LI.FI", desc: "Cross-chain swaps", y: 110, color: "rgb(139, 92, 246)" },
    { id: "gateway", label: "Circle Gateway", desc: "USDC transfers", y: 190, color: "rgb(16, 185, 129)" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Mobile: stacked cards */}
      <div className="block lg:hidden space-y-3">
        {[
          { icon: MessageSquare, label: "Discord", sub: "Natural language input", border: "border-blue-500/30", bg: "bg-blue-500/5" },
          { icon: Workflow, label: "n8n Orchestrator", sub: "Workflow engine", border: "border-amber-500/30", bg: "bg-amber-500/5" },
          { icon: Bot, label: "AI Agent", sub: "Intent parsing & routing", border: "border-primary/50", bg: "bg-primary/5" },
        ].map((item, i) => (
          <div key={item.label}>
            <div className={`rounded-xl border-2 ${item.border} ${item.bg} p-4 text-center`}>
              <div className="flex items-center justify-center gap-2">
                <item.icon className="h-4 w-4 text-foreground" />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
            </div>
            {i < 2 && (
              <div className="flex justify-center">
                <div className="w-px h-5 bg-border" />
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center"><div className="w-px h-5 bg-border" /></div>
        <div className="grid grid-cols-1 gap-2">
          {routes.map((r) => (
            <div key={r.id} className="rounded-lg border bg-card p-3 flex items-center gap-3" style={{ borderColor: `${r.color}40` }}>
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
              <div>
                <span className="font-semibold text-sm">{r.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center"><div className="w-px h-5 bg-border" /></div>
        <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
          <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">On-chain Execution</span>
        </div>
      </div>

      {/* Desktop: SVG diagram with n8n layer */}
      <div className="hidden lg:block">
        <svg viewBox="0 0 1050 250" className="w-full" style={{ maxHeight: "270px" }}>
          {/* Discord box */}
          <g>
            <rect x="10" y="85" width="130" height="70" rx="12" className="fill-card" stroke="rgb(59,130,246)" strokeWidth="2" strokeOpacity="0.4" />
            <text x="75" y="112" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">Discord</text>
            <text x="75" y="130" textAnchor="middle" className="fill-muted-foreground text-[10px]">"swap 1 USDC to ETH"</text>
          </g>

          {/* Arrow: Discord → n8n */}
          <line x1="140" y1="120" x2="195" y2="120" className="stroke-border" strokeWidth="1.5" strokeDasharray="5 3" />
          <polygon points="190,116 200,120 190,124" className="fill-muted-foreground" />

          {/* n8n orchestrator box */}
          <g>
            <rect x="200" y="75" width="145" height="90" rx="14" fill="url(#n8nGradient)" stroke="rgb(245,158,11)" strokeWidth="2" strokeOpacity="0.4" />
            <text x="272" y="105" textAnchor="middle" className="fill-foreground text-[12px] font-bold">n8n Orchestrator</text>
            <text x="272" y="122" textAnchor="middle" className="fill-muted-foreground text-[9.5px]">Validate &bull; Route &bull; Execute</text>
            <text x="272" y="137" textAnchor="middle" className="fill-muted-foreground text-[9.5px]">Log &bull; Notify &bull; Recover</text>
            <text x="272" y="155" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[9px] font-medium">6 workflows &bull; 40+ nodes</text>
          </g>

          {/* Arrow: n8n → AI Agent */}
          <line x1="345" y1="120" x2="405" y2="120" className="stroke-border" strokeWidth="1.5" strokeDasharray="5 3" />
          <polygon points="400,116 410,120 400,124" className="fill-muted-foreground" />

          {/* AI Agent box */}
          <g>
            <rect x="410" y="80" width="155" height="80" rx="14" className="stroke-primary/50" strokeWidth="2.5" fill="url(#agentGradient)" />
            <text x="487" y="110" textAnchor="middle" className="fill-foreground text-[13px] font-bold">AI Agent</text>
            <text x="487" y="128" textAnchor="middle" className="fill-muted-foreground text-[10px]">NLP intent &bull; ENS resolve</text>
            <text x="487" y="145" textAnchor="middle" className="fill-muted-foreground text-[10px]">Smart route selection</text>
          </g>

          {/* Branching arrows from Agent to protocols */}
          {routes.map((r) => {
            const isActive = hovered === r.id;
            return (
              <g key={r.id}>
                <path
                  d={`M 565 120 C 610 120, 630 ${r.y + 20}, 680 ${r.y + 20}`}
                  fill="none"
                  stroke={isActive ? r.color : "hsl(var(--border))"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "0" : "5 3"}
                  style={{ transition: "all 0.3s ease" }}
                />
                <polygon
                  points={`675,${r.y + 16} 685,${r.y + 20} 675,${r.y + 24}`}
                  fill={isActive ? r.color : "hsl(var(--muted-foreground))"}
                  style={{ transition: "fill 0.3s ease" }}
                />
                <g
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x="688" y={r.y} width="170" height="40" rx="10"
                    className="fill-card"
                    stroke={isActive ? r.color : "hsl(var(--border))"}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <circle cx="705" cy={r.y + 20} r="4" fill={r.color} />
                  <text x="720" y={r.y + 16} className="fill-foreground text-[11px] font-semibold">{r.label}</text>
                  <text x="720" y={r.y + 29} className="fill-muted-foreground text-[9.5px]">{r.desc}</text>
                </g>
                <line
                  x1="858" y1={r.y + 20} x2="920" y2={r.y + 20}
                  stroke={isActive ? r.color : "hsl(var(--border))"}
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeDasharray={isActive ? "0" : "5 3"}
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            );
          })}

          {/* On-chain box */}
          <g>
            <rect x="925" y="75" width="110" height="100" rx="12" className="fill-card stroke-emerald-500/40" strokeWidth="2" />
            <text x="980" y="115" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[12px] font-semibold">On-chain</text>
            <text x="980" y="133" textAnchor="middle" className="fill-muted-foreground text-[10px]">Confirmed</text>
            <text x="980" y="150" textAnchor="middle" className="fill-muted-foreground text-[9px]">Logged to Appwrite</text>
          </g>

          <defs>
            <linearGradient id="agentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="n8nGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(245,158,11)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="rgb(245,158,11)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export function Homepage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10 text-center space-y-8 py-20 px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Bot className="h-4 w-4" />
            Agentic Treasury Management
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Your AI agent for
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Crypto Treasury
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Talk to it in Discord. It swaps, sends, bridges, and reports &mdash;
            across Ethereum, Arbitrum, and Base. No wallets to install.
            No DeFi jargon to learn. Just chat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link to="/dashboard">
                <Wallet className="mr-2 h-5 w-5" />
                Launch Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToFeatures} className="text-base">
              How It Works
            </Button>
          </div>

        </div>
      </section>

      {/* ─── Chain Networks ─── */}
      <section className="py-10 sm:py-12 border-b border-border/50">
        <div className="container space-y-8 px-4 max-w-5xl mx-auto">
          {/* Circle Gateway */}
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-2.5">
              <CircleDollarSign className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-bold">Circle Gateway</h3>
              <span className="text-sm text-muted-foreground">
                &mdash; Unified USDC across {gatewayChains.length} chains
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {gatewayChains.map((chain) => (
                <span
                  key={chain.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 pl-1.5 pr-3 py-1.5 text-sm font-medium text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                >
                  <ChainIcon chain={chain} />
                  {chain.name}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* LI.FI */}
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-2.5">
              <Layers className="h-5 w-5 text-violet-500" />
              <h3 className="text-lg font-bold">LI.FI</h3>
              <span className="text-sm text-muted-foreground">
                &mdash; Cross-chain swaps across {lifiChains.length} chains
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {lifiChains.map((chain) => (
                <span
                  key={chain.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 pl-1.5 pr-3 py-1.5 text-sm font-medium text-foreground hover:border-violet-500/50 hover:bg-violet-500/10 transition-colors"
                >
                  <ChainIcon chain={chain} />
                  {chain.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-14 border-b border-border/50 bg-gradient-to-b from-background to-destructive/5">
          <div className="container space-y-8 px-4 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
                The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Managing crypto is painful &mdash; even for pros
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a family pooling savings or a DAO managing a
                treasury, the tooling creates friction at every step.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-lg border-2 border-destructive/20 bg-card p-6 space-y-3">
                <p className="font-semibold">Complex interfaces</p>
                <p className="text-sm text-muted-foreground">
                  Dozens of chains, bridges, and protocols to understand.
                  One wrong click can mean lost funds.
                </p>
              </div>
              <div className="rounded-lg border-2 border-destructive/20 bg-card p-6 space-y-3">
                <p className="font-semibold">Single points of failure</p>
                <p className="text-sm text-muted-foreground">
                  One person holds the keys, manages the wallets, and makes all
                  the decisions. No transparency, no shared control.
                </p>
              </div>
              <div className="rounded-lg border-2 border-destructive/20 bg-card p-6 space-y-3">
                <p className="font-semibold">Treasury is DevOps</p>
                <p className="text-sm text-muted-foreground">
                  Even crypto-native teams spend hours on routine operations &mdash; checking balances, approving tokens, choosing bridges, tracking transactions.
                </p>
              </div>
              <div className="rounded-lg border-2 border-destructive/20 bg-card p-6 space-y-3">
                <p className="font-semibold">No group coordination</p>
                <p className="text-sm text-muted-foreground">
                  No simple way for families or teams to jointly manage funds,
                  approve transactions, or see what's happening.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── Solution ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-14 border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
          <div className="container space-y-8 px-4 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                The Solution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                An AI agent that does the work for you
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                PigAiBank is a Discord-native AI agent. It understands natural language,
                picks the optimal route, executes on-chain, and reports back &mdash; all
                from a chat message.
              </p>
            </div>

            {/* Chat example */}
            <div className="rounded-xl border-2 border-primary/20 bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-4 font-mono text-base">
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-sm font-bold text-blue-500">Mom</span>
                <p>"@PigAiBank what's our balance?"</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                  <Bot className="inline h-3 w-3 mr-0.5 -mt-0.5" />Agent
                </span>
                <p>"You have <strong>$12,340</strong> total &mdash; $8,200 in USDC and $4,140 in ETH across Arbitrum and Base."</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-sm font-bold text-emerald-500">Dad</span>
                <p>"@PigAiBank send $100 to alex.eth"</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                  <Bot className="inline h-3 w-3 mr-0.5 -mt-0.5" />Agent
                </span>
                <p>"Resolved alex.eth &rarr; 0x742d... Sending $100 USDC. <a className="underline text-primary">Tx confirmed.</a>"</p>
              </div>
            </div>

            {/* Solution pillars - reframed around agentic qualities */}
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Terminal className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold">Natural language in</p>
                <p className="text-sm text-muted-foreground">
                  No forms, no dropdowns, no hex addresses. Say what you want in plain English. The agent figures out the rest.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold">Agent decides &amp; acts</p>
                <p className="text-sm text-muted-foreground">
                  The agent resolves ENS names, selects the optimal protocol, handles approvals and slippage, and executes the transaction.
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold">Humans stay in control</p>
                <p className="text-sm text-muted-foreground">
                  N-of-M approvals for large transactions. Every action is logged, reported, and visible to the group. The agent works <em>for</em> you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── Why Agentic ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-14 border-b border-border/50">
          <div className="container space-y-8 px-4 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                <Workflow className="h-4 w-4" />
                Why Agentic?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                The future of DeFi is conversational
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                We're in the age of powerful AI agents. The question isn't whether
                agents will manage on-chain finance &mdash; it's whether they'll do it
                safely. PigAiBank is built for reliability, transparency, and human oversight.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Workflow className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold">n8n Orchestration</p>
                    <p className="text-sm text-muted-foreground">Not a black box</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every agent action runs through a structured n8n workflow &mdash; 6 workflows,
                  40+ nodes, with validation, error handling, retry logic, and Discord notifications.
                  You can inspect, audit, and modify every decision the agent makes.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Full Visibility</p>
                    <p className="text-sm text-muted-foreground">Every action logged</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every execution is logged to Appwrite with full context &mdash; route chosen,
                  quote received, tx hash, status. Daily reports, price alerts, and error
                  notifications keep the whole team informed.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Human-in-the-Loop</p>
                    <p className="text-sm text-muted-foreground">Agents with guardrails</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unlike autonomous agents that act unilaterally, PigAiBank requires
                  human confirmation for transactions. Large operations need N-of-M
                  Discord reactions. The agent proposes &mdash; the group decides.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Chain Abstracted</p>
                    <p className="text-sm text-muted-foreground">Multi-chain, one interface</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Users never think about which chain their funds are on. The agent
                  sees all balances across Ethereum, Arbitrum, and Base as one
                  treasury and routes accordingly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── Architecture ─── */}
      <FadeInSection id="features">
        <section className="py-12 sm:py-14 border-b border-border/50 bg-gradient-to-b from-background to-accent/5">
          <div className="container space-y-8 px-4">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Agent architecture
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                A Discord message flows through n8n's workflow engine, where the AI agent
                parses intent, resolves names, picks the optimal protocol, and executes on-chain.
                Every step is observable and auditable.
              </p>
            </div>

            <ArchitectureDiagram />

            {/* Routing decision rules */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4">
              <div className="text-center p-4 rounded-lg bg-card border border-pink-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-pink-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Same chain swap?</p>
                <p className="text-sm text-muted-foreground mt-1">Uniswap via SwapRouter02</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border border-violet-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-violet-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Cross-chain + token swap?</p>
                <p className="text-sm text-muted-foreground mt-1">LI.FI auto-routing</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border border-emerald-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">USDC cross-chain?</p>
                <p className="text-sm text-muted-foreground mt-1">Circle Gateway &mdash; instant</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── What the agent can do (replaces old How It Works + Features) ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-14">
          <div className="container space-y-8 px-4">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                What the agent can do
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                One chat interface. Six capabilities. All on mainnet.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-2 hover:border-primary transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── Protocol Stack ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-14 bg-gradient-to-br from-accent/5 via-background to-primary/5">
          <div className="container space-y-8 px-4">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Protocol stack
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                The agent composes four protocols into a unified execution layer.
                Each handles what it does best &mdash; the agent picks the right one.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {integrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <Card
                    key={integration.name}
                    className="border-2 border-primary/20 hover:border-primary transition-all duration-300 relative overflow-hidden"
                  >
                    <CardHeader className="space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className={`h-6 w-6 ${integration.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{integration.name}</CardTitle>
                        <CardDescription className="text-sm mt-2">
                          {integration.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {integration.role}
                      </Badge>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── CTA ─── */}
      <FadeInSection>
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container text-center space-y-6 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              The easiest way to manage crypto
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop clicking through DeFi dashboards. Start chatting with your treasury agent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <a
                  href="https://github.com/smartpiggies/treasury-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      <Footer />
    </>
  );
}
