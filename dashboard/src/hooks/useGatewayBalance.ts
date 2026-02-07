import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { CIRCLE_DOMAINS, CHAIN_NAMES } from '@/lib/contracts';

const CIRCLE_GATEWAY_URL = import.meta.env.VITE_CIRCLE_GATEWAY_URL || 'https://gateway-api.circle.com';

interface ChainBalance {
  chain: string;
  chainId: number;
  balance: bigint;
  balanceUsd: number;
}

interface GatewayBalance {
  totalUsd: number;
  chains: ChainBalance[];
  isLoading: boolean;
  refetch: () => void;
}

const SUPPORTED_CHAINS = [42161, 8453, 1] as const; // Arbitrum, Base, Ethereum

export function useGatewayBalance(): GatewayBalance {
  const { address } = useAccount();
  const [chains, setChains] = useState<ChainBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const sources = SUPPORTED_CHAINS.map((chainId) => ({
        depositor: address,
        domain: CIRCLE_DOMAINS[chainId],
      }));

      const response = await fetch(`${CIRCLE_GATEWAY_URL}/v1/balances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'USDC', sources }),
      });

      if (!response.ok) {
        throw new Error(`Circle API error ${response.status}`);
      }

      const data: { balances: { domain: number; balance: string }[] } = await response.json();

      const result: ChainBalance[] = SUPPORTED_CHAINS.map((chainId) => {
        const domain = CIRCLE_DOMAINS[chainId];
        const entry = data.balances.find((b) => b.domain === domain);
        const balanceUsd = entry ? parseFloat(entry.balance) : 0;
        return {
          chain: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
          chainId,
          balance: BigInt(Math.round(balanceUsd * 1e6)),
          balanceUsd,
        };
      });

      setChains(result);
    } catch (err) {
      console.error('Failed to fetch Gateway balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const totalUsd = chains.reduce((sum, c) => sum + c.balanceUsd, 0);

  return {
    totalUsd,
    chains,
    isLoading,
    refetch: fetchBalances,
  };
}
