import { Link } from "react-router-dom";
import {
  AtSign,
  ArrowRight,
  Search,
  Users,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EnsIntegration() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-600 dark:text-sky-400">
          <AtSign className="h-4 w-4" />
          Integration
        </div>
        <h1 className="text-3xl font-bold">ENS</h1>
        <p className="text-lg text-muted-foreground">
          Human-readable Ethereum addresses via The Graph decentralized network.
          Send to <code className="text-base bg-muted px-2 py-0.5 rounded">dad.eth</code> instead of <code className="text-base bg-muted px-2 py-0.5 rounded">0x742d35Cc...</code>
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-sky-600 dark:text-sky-400 border-sky-500/30">
            <Search className="h-3 w-3 mr-1" />
            Name resolution
          </Badge>
        </div>
      </div>

      {/* Why ENS */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Why ENS?</h2>
        <p className="text-muted-foreground">
          Hex addresses are scary, error-prone, and meaningless to non-technical users.
          ENS names let family members send funds using memorable names they already know.
          The agent handles resolution transparently.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Users className="h-5 w-5 text-sky-500" />
            <p className="text-sm font-semibold">User Friendly</p>
            <p className="text-xs text-muted-foreground">
              "Send $100 to alex.eth" is far less error-prone than pasting a hex address.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Search className="h-5 w-5 text-sky-500" />
            <p className="text-sm font-semibold">Decentralized</p>
            <p className="text-xs text-muted-foreground">
              Resolution via The Graph decentralized network, not a centralized API.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Shield className="h-5 w-5 text-sky-500" />
            <p className="text-sm font-semibold">Transparent</p>
            <p className="text-xs text-muted-foreground">
              Agent shows the resolved address before executing so users can verify.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="space-y-3">
          {[
            "User mentions an ENS name in their Discord message (e.g. \"send $100 to alex.eth\")",
            "Agent detects the .eth name and queries The Graph ENS subgraph",
            "The Graph returns the resolved Ethereum address",
            "Agent confirms the resolution to the user: \"Resolved alex.eth → 0x742d...\"",
            "Proceeds with the transaction using the resolved address",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Example */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Example Interaction</h2>
        <div className="rounded-lg border bg-card p-4 font-mono text-sm space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 mt-0.5">Dad</Badge>
            <span>@PigAiBank send $100 to alex.eth</span>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="shrink-0 mt-0.5">Agent</Badge>
            <div>
              <p>Resolved <strong>alex.eth</strong> &rarr; <code className="text-xs bg-muted px-1.5 py-0.5 rounded">0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18</code></p>
              <p className="mt-1">Sending $100 USDC now.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="shrink-0 mt-0.5">Agent</Badge>
            <span>Done! $100 USDC sent to alex.eth. <span className="text-primary">Tx confirmed.</span></span>
          </div>
        </div>
      </div>

      {/* Treasury ENS */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Treasury ENS Name</h2>
        <p className="text-muted-foreground">
          The PigAiBank treasury wallet itself uses an ENS name for identification:
        </p>
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <AtSign className="h-5 w-5 text-sky-500 shrink-0" />
            <div>
              <p className="font-mono text-sm font-semibold">pigaibank.eth</p>
              <p className="font-mono text-xs text-muted-foreground break-all">0xc3c68a5d6607b26D60ADc4925e08788778989314</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          This name is used across all live test transactions and is referenced in both
          the swap-executor and discord-webhook-handler n8n workflows.
        </p>
      </div>

      {/* Technical details */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Technical Details</h2>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3 text-sm">
          <div>
            <p className="font-medium">Resolution via The Graph</p>
            <p className="text-muted-foreground">
              ENS names are resolved using The Graph's ENS subgraph on the decentralized
              network, not through a centralized JSON-RPC provider.
            </p>
          </div>
          <div>
            <p className="font-medium">Used in Both Interfaces</p>
            <p className="text-muted-foreground">
              ENS resolution works in both the n8n swap-executor (Discord-triggered) and
              the dashboard (wallet-connected). Same resolution logic, two entry points.
            </p>
          </div>
          <div>
            <p className="font-medium">Validation</p>
            <p className="text-muted-foreground">
              The agent validates that the resolved address is non-null before proceeding.
              If resolution fails, the user is notified and the transaction is aborted.
            </p>
          </div>
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
          to="/docs/approvals"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          N-of-M Approvals
        </Link>
      </div>
    </div>
  );
}
