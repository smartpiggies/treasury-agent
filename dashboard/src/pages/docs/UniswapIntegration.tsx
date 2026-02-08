import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  ExternalLink,
  ArrowRight,
  Zap,
  BarChart3,
  Code,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UniswapIntegration() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400">
          <ArrowLeftRight className="h-4 w-4" />
          Integration
        </div>
        <h1 className="text-3xl font-bold">Uniswap</h1>
        <p className="text-lg text-muted-foreground">
          Same-chain token swaps via SwapRouter02 with pool data from The Graph.
          The fastest and cheapest option when source and destination are on the same chain.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-pink-600 dark:text-pink-400 border-pink-500/30">
            <Zap className="h-3 w-3 mr-1" />
            Same-chain swaps
          </Badge>
          <Badge variant="outline">
            Bounty: $5,000
          </Badge>
        </div>
      </div>

      {/* Why Uniswap */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Why Uniswap?</h2>
        <p className="text-muted-foreground">
          PigAiBank exemplifies "agentic finance" &mdash; autonomous monitoring,
          threshold-based decisions, and programmatic execution. For same-chain
          operations, Uniswap provides the best price, lowest gas, and fastest execution.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Zap className="h-5 w-5 text-pink-500" />
            <p className="text-sm font-semibold">Fastest</p>
            <p className="text-xs text-muted-foreground">No bridge overhead. Direct pool access for immediate execution.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <BarChart3 className="h-5 w-5 text-pink-500" />
            <p className="text-sm font-semibold">Price Data</p>
            <p className="text-xs text-muted-foreground">Real-time ETH pricing via Uniswap v3 subgraph on The Graph decentralized network.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <Code className="h-5 w-5 text-pink-500" />
            <p className="text-sm font-semibold">Dynamic Routing</p>
            <p className="text-xs text-muted-foreground">Pool fee tier fetched dynamically from subgraph, not hardcoded.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="space-y-3">
          {[
            "Agent receives swap request and detects same-chain (e.g. Arbitrum to Arbitrum)",
            "Routes to Uniswap — fetches optimal pool fee tier from The Graph subgraph",
            "Approves USDC spend to SwapRouter02 (ERC-20 approve with MaxUint256)",
            "Calls exactInputSingle() on SwapRouter02 with the USDC/WETH pool",
            "Records execution in Appwrite database",
            "Reports result to Discord in plain English",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500/10 text-xs font-bold text-pink-600 dark:text-pink-400 shrink-0 mt-0.5">
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
          Verified on mainnet &mdash; real USDC swapped to WETH on Arbitrum.
        </p>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["TX Hash", <a key="tx" href="https://arbiscan.io/tx/0x2a5fc9c0c91199209398cfbb4793b9e93085d85ae4dcbebe098ec49142dd713d" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 break-all">0x2a5f...713d <ExternalLink className="h-3 w-3 shrink-0" /></a>],
                ["Chain", "Arbitrum"],
                ["From", <span key="from" className="break-all">pigaibank.eth (0xc3c68a5d6607b26D60ADc4925e08788778989314)</span>],
                ["Router", <span key="router" className="break-all">SwapRouter02 (0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45)</span>],
                ["Input", "1 USDC"],
                ["Output", "0.000480266576959973 WETH (~$1.08)"],
                ["Gas Used", "153,824"],
                ["Gas Cost", "~$0.007"],
              ].map(([label, value]) => (
                <tr key={label as string} className="border-b last:border-0">
                  <td className="p-3 font-medium text-muted-foreground w-32">{label}</td>
                  <td className="p-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code pattern */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Code Pattern</h2>
        <div className="rounded-lg border bg-muted/50 p-4 font-mono text-xs space-y-1 overflow-x-auto">
          <p className="text-muted-foreground">// 1. Get current price from The Graph</p>
          <p>{"const poolData = await queryUniswapSubgraph(`"}</p>
          <p className="ml-4">{"pool(id: \"0x...\") { token0Price, liquidity }"}</p>
          <p>{"`);"}</p>
          <p className="mt-2 text-muted-foreground">// 2. Build swap transaction</p>
          <p>{"const swapTx = buildUniswapSwap({"}</p>
          <p className="ml-4">{"tokenIn: \"ETH\", tokenOut: \"USDC\","}</p>
          <p className="ml-4">{"amount: userRequestedAmount,"}</p>
          <p className="ml-4">{"slippage: 0.5 // 0.5% max"}</p>
          <p>{"});"}</p>
          <p className="mt-2 text-muted-foreground">// 3. Execute and report</p>
          <p>{"const result = await executeTransaction(swapTx);"}</p>
          <p>{"postToDiscord(`Swapped ${amount} ETH for ${result.received} USDC`);"}</p>
        </div>
      </div>

      {/* Technical details */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Technical Details</h2>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3 text-sm">
          <div>
            <p className="font-medium">SwapRouter02</p>
            <p className="text-muted-foreground">
              Uses SwapRouter02 (not Universal Router, which requires Permit2 setup).
              Address: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45</code>
            </p>
          </div>
          <div>
            <p className="font-medium">Dynamic Fee Tier</p>
            <p className="text-muted-foreground">
              Pool fee tier is dynamically fetched from the Uniswap v3 subgraph via
              The Graph decentralized network &mdash; not hardcoded.
            </p>
          </div>
          <div>
            <p className="font-medium">Price Source</p>
            <p className="text-muted-foreground">
              ETH price comes from <code className="text-xs bg-muted px-1.5 py-0.5 rounded">sqrtPriceX96</code> in the USDC/ETH pool,
              queried via The Graph every 5 minutes for monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="rounded-xl border-2 border-pink-500/20 bg-pink-500/5 p-6 space-y-3">
        <h3 className="font-semibold">When does the agent use Uniswap?</h3>
        <p className="text-sm text-muted-foreground">
          When the swap is <strong>same-chain</strong> (e.g. USDC &rarr; ETH on Arbitrum).
          This is always the fastest and cheapest option. For cross-chain operations,
          the agent routes to{" "}
          <Link to="/docs/lifi" className="text-primary underline underline-offset-4">LI.FI</Link>{" "}
          or{" "}
          <Link to="/docs/circle-gateway" className="text-primary underline underline-offset-4">Circle Gateway</Link>.
        </p>
        <div className="rounded-lg bg-card border p-3 font-mono text-xs">
          <p className="text-muted-foreground">// Routing logic</p>
          <p>if (fromChain === toChain) {"{"}</p>
          <p className="ml-4">route = "uniswap"; <span className="text-pink-500">// fastest, cheapest</span></p>
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
