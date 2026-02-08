import { Link } from "react-router-dom";
import {
  CircleDollarSign,
  Zap,
  ExternalLink,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CircleGateway() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CircleDollarSign className="h-4 w-4" />
          Integration
        </div>
        <h1 className="text-3xl font-bold">Circle Gateway</h1>
        <p className="text-lg text-muted-foreground">
          Instant cross-chain USDC transfers using burn-and-mint. One unified balance
          across Ethereum, Arbitrum, and Base &mdash; no bridging required.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <Zap className="h-3 w-3 mr-1" />
            &lt;500ms transfers
          </Badge>
          <Badge variant="outline">
            Bounty: $5,000
          </Badge>
        </div>
      </div>

      {/* Why Gateway */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Why Circle Gateway?</h2>
        <p className="text-muted-foreground">
          For a family managing crypto together, "which chain is my money on?"
          shouldn't matter. Circle Gateway provides a single unified USDC balance
          across all supported chains. Moving between chains takes under 500ms.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold">Instant</p>
            <p className="text-xs text-muted-foreground">Sub-500ms cross-chain transfers. No waiting for bridge confirmations.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <CircleDollarSign className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold">Chain Abstracted</p>
            <p className="text-xs text-muted-foreground">Users see one balance. The agent handles which chain the USDC lives on.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold">No Pre-positioned Liquidity</p>
            <p className="text-xs text-muted-foreground">Burns on source, mints on destination. No liquidity pools or slippage.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="space-y-3">
          {[
            "Agent receives transfer request and detects USDC-to-USDC cross-chain",
            "Routes to Circle Gateway — the fastest option for same-token cross-chain",
            "Signs a BurnIntent using EIP-712 typed data (burns USDC on source chain)",
            "Submits to Circle Gateway API — receives attestation + signature synchronously",
            "Calls gatewayMinter.gatewayMint(attestation, signature) on destination chain",
            "USDC is minted on the destination chain — transfer complete in <500ms",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live transaction */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Live Transaction</h2>
        <p className="text-sm text-muted-foreground">
          Verified on mainnet &mdash; real USDC, real chains, real transfer.
        </p>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["TX Hash (Mint)", <a key="tx" href="https://basescan.org/tx/0x229536792918033e38818965745029162c91fbb990183f1d86cca5752f9861f7" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 break-all">0x2295...61f7 <ExternalLink className="h-3 w-3 shrink-0" /></a>],
                ["Source Chain", "Arbitrum"],
                ["Destination Chain", "Base"],
                ["From", <span key="from" className="break-all">pigaibank.eth (0xc3c68a5d6607b26D60ADc4925e08788778989314)</span>],
                ["Contract", <span key="contract" className="break-all">GatewayMinter (0x2222222d7164433c4C09B0b0D809a9b52C04C205)</span>],
                ["Amount", "1 USDC"],
                ["Transfer Time", "<500ms"],
              ].map(([label, value]) => (
                <tr key={label as string} className="border-b last:border-0">
                  <td className="p-3 font-medium text-muted-foreground w-40">{label}</td>
                  <td className="p-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical details */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Technical Details</h2>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3 text-sm">
          <div>
            <p className="font-medium">EIP-712 Signing</p>
            <p className="text-muted-foreground">
              Domain: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"{ name: \"GatewayWallet\", version: \"1\" }"}</code> — no chainId or verifyingContract.
            </p>
          </div>
          <div>
            <p className="font-medium">API Format</p>
            <p className="text-muted-foreground">
              POST body is an <strong>array</strong>{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">[{"{ burnIntent, signature }"}]</code>,
              not a single object.
            </p>
          </div>
          <div>
            <p className="font-medium">Synchronous Attestation</p>
            <p className="text-muted-foreground">
              Unlike CCTP (which requires polling), Gateway returns the attestation
              synchronously in the API response.
            </p>
          </div>
          <div>
            <p className="font-medium">Destination Contract</p>
            <p className="text-muted-foreground">
              Must be GatewayMinter (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">0x2222...</code>),
              not GatewayWallet (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">0x7777...</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 space-y-3">
        <h3 className="font-semibold">When does the agent use Circle Gateway?</h3>
        <p className="text-sm text-muted-foreground">
          When the request is <strong>USDC &rarr; USDC across chains</strong>. This
          is always the fastest option. For cross-chain + token conversion, the agent
          routes to{" "}
          <Link to="/docs/lifi" className="text-primary underline underline-offset-4">LI.FI</Link>{" "}
          instead.
        </p>
        <div className="rounded-lg bg-card border p-3 font-mono text-xs">
          <p className="text-muted-foreground">// Routing logic</p>
          <p>if (fromToken === "USDC" && toToken === "USDC" && fromChain !== toChain) {"{"}</p>
          <p className="ml-4">route = "circle-gateway"; <span className="text-emerald-500">// instant, &lt;500ms</span></p>
          <p>{"}"}</p>
        </div>
      </div>

      {/* Next */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/docs/uniswap"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          Uniswap integration
        </Link>
        <Link
          to="/docs/lifi"
          className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowRight className="h-4 w-4" />
          LI.FI integration
        </Link>
      </div>
    </div>
  );
}
