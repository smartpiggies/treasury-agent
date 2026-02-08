import { Link } from "react-router-dom";
import {
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Command {
  intent: string;
  examples: string[];
  description: string;
  response: string;
}

const commands: Command[] = [
  {
    intent: "balance",
    examples: [
      "@PigAiBank what's our balance?",
      "@PigAiBank how much do we have?",
      "@PigAiBank balance",
    ],
    description:
      "Fetches the treasury's total USDC balance across all chains via Circle Gateway, plus ETH holdings.",
    response:
      "You have $12,340 total — $8,200 in USDC across Ethereum, Arbitrum, and Base, and $4,140 in ETH.",
  },
  {
    intent: "price",
    examples: [
      "@PigAiBank what's the price of ETH?",
      "@PigAiBank ETH price",
      "@PigAiBank how much is ethereum?",
    ],
    description:
      "Queries ETH price from the Uniswap v3 subgraph via The Graph decentralized network.",
    response: "ETH is currently $3,450.00 (up 2.1% in the last 24h).",
  },
  {
    intent: "swap",
    examples: [
      "@PigAiBank swap 1 USDC to ETH on Arbitrum",
      "@PigAiBank convert $500 ETH to stablecoins",
      "@PigAiBank move 100 USDC from Arbitrum to Base",
    ],
    description:
      "Routes through Uniswap (same-chain), LI.FI (cross-chain), or Circle Gateway (USDC cross-chain) based on smart routing logic.",
    response:
      "Swapping 1 USDC → ETH on Arbitrum via Uniswap... Done! Received 0.00048 WETH (~$1.08). Tx confirmed.",
  },
  {
    intent: "deposit",
    examples: [
      "@PigAiBank deposit $100",
      "@PigAiBank deposit 50 USDC",
    ],
    description:
      "Initiates a USDC deposit to Circle Gateway. In mock mode, simulates the deposit. For real deposits, use the dashboard with a connected wallet.",
    response:
      "Deposit of $100 USDC initiated. Check the dashboard for status.",
  },
  {
    intent: "help",
    examples: [
      "@PigAiBank help",
      "@PigAiBank what can you do?",
    ],
    description:
      "Lists all available commands and capabilities.",
    response:
      "I can help with: checking balances, ETH prices, swaps, deposits, and more. Try \"@PigAiBank what's our balance?\" to get started.",
  },
];

export function DiscordCommands() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
          <MessageSquare className="h-4 w-4" />
          Reference
        </div>
        <h1 className="text-3xl font-bold">Discord Commands</h1>
        <p className="text-lg text-muted-foreground">
          PigAiBank understands natural language &mdash; no exact syntax required.
          Here are the supported intents with example phrasings.
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-xl border bg-card p-6 space-y-3">
        <h2 className="text-lg font-semibold">How it works</h2>
        <p className="text-sm text-muted-foreground">
          Mention <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@PigAiBank</code>{" "}
          in any channel the bot has access to. The agent parses your message for intent
          (balance, price, swap, deposit, help) and responds accordingly. You can use
          natural language &mdash; the examples below are just suggestions, not required syntax.
        </p>
      </div>

      {/* Commands */}
      <div className="space-y-6">
        {commands.map((cmd) => (
          <div key={cmd.intent} className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="text-xs uppercase">{cmd.intent}</Badge>
              <h2 className="text-lg font-semibold capitalize">{cmd.intent}</h2>
            </div>

            <p className="text-sm text-muted-foreground">{cmd.description}</p>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Examples</p>
              <div className="space-y-1.5">
                {cmd.examples.map((ex) => (
                  <div key={ex} className="rounded-lg border bg-muted/50 px-4 py-2 font-mono text-sm">
                    {ex}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Example Response</p>
              <div className="rounded-lg border bg-card px-4 py-3 text-sm flex items-start gap-3">
                <Badge className="shrink-0 mt-0.5 text-xs">Agent</Badge>
                <span className="text-muted-foreground">{cmd.response}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automatic reports */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Automatic Reports</h2>
        <p className="text-sm text-muted-foreground">
          The agent also posts messages without being asked:
        </p>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Report</th>
                <th className="text-left p-3 font-medium">Schedule</th>
                <th className="text-left p-3 font-medium">Content</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Daily Report", "9 AM daily", "Treasury balance + ETH price summary"],
                ["Price Alert", "When triggered", "ETH crossed a threshold — up or down"],
                ["Weekly Summary", "Monday 8 AM", "Week-over-week stats, swap history, net change"],
                ["Error Alert", "On failure", "Transaction failed — details and recovery status"],
              ].map(([name, schedule, content]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="p-3 font-medium">{name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{schedule}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/docs/approvals"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          N-of-M Approvals
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
