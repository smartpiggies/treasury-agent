// Chain identifiers
export type Chain =
  | 'ethereum'
  | 'arbitrum'
  | 'base'
  | 'polygon'
  | 'sepolia'
  | 'arbitrum-sepolia'
  | 'base-sepolia';

// Token symbols
export type Token = 'ETH' | 'USDC' | 'USDT' | 'WETH' | 'WBTC';

// Execution types
export type ExecutionType = 'swap' | 'rebalance' | 'transfer';

export type ExecutionStatus =
  | 'pending'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ExecutionRoute = 'uniswap' | 'lifi' | 'circle';

// Alert types
export type AlertType =
  | 'price_high'
  | 'price_low'
  | 'execution_failed'
  | 'limit_reached'
  | 'system_error';

export type AlertSeverity = 'info' | 'warning' | 'critical';

// Database document types

export interface PriceHistory {
  $id: string;
  $createdAt: string;
  timestamp: string;
  token: Token;
  price_usd: number;
  source: string;
  chain?: Chain;
}

export interface Execution {
  $id: string;
  $createdAt: string;
  timestamp: string;
  type: ExecutionType;
  source_chain: Chain;
  dest_chain: Chain;
  source_token: Token;
  dest_token: Token;
  amount: string;
  amount_usd?: number;
  status: ExecutionStatus;
  tx_hash?: string;
  route?: ExecutionRoute;
  requester?: string;
  approver?: string;
  approved_at?: string;
  completed_at?: string;
  error?: string;
  gas_used?: string;
  gas_price?: string;
  slippage?: number;
  reason?: string;
}

export interface Alert {
  $id: string;
  $createdAt: string;
  timestamp: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  token?: Token;
  threshold?: number;
  actual_value?: number;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  related_execution?: string;
}

export interface Balance {
  $id: string;
  $createdAt: string;
  timestamp: string;
  chain: Chain;
  token: Token;
  balance: string;
  balance_usd?: number;
  source: string;
}

// API request/response types

export interface SwapRequest {
  sourceChain: Chain;
  destChain: Chain;
  sourceToken: Token;
  destToken: Token;
  amount: string;
  reason?: string;
}

export interface BalanceResponse {
  total_usd: number;
  chains: Array<{
    chain: Chain;
    token: Token;
    balance: string;
    balance_usd: number;
  }>;
}

// Dashboard UI types

export interface ChainBalance {
  chain: Chain;
  token: Token;
  balance: string;
  balanceUsd: number;
  percentOfTotal: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}
