import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_ADDRESSES, ERC20_ABI, CHAIN_NAMES, USDC_DECIMALS } from '@/lib/contracts';

const SUPPORTED_CHAINS = [42161, 8453, 1] as const; // Arbitrum, Base, Ethereum

export interface WalletChainBalance {
  chain: string;
  chainId: number;
  usdcBalance: number;
  ethBalance: number;
  ethBalanceRaw: bigint;
  usdcBalanceRaw: bigint;
}

export interface WalletBalances {
  chains: WalletChainBalance[];
  totalUsdc: number;
  totalEthValue: number;
  isLoading: boolean;
  refetch: () => void;
}

export function useWalletBalances(ethPrice: number): WalletBalances {
  const { address } = useAccount();
  const arbClient = usePublicClient({ chainId: 42161 });
  const baseClient = usePublicClient({ chainId: 8453 });
  const ethClient = usePublicClient({ chainId: 1 });
  const [chains, setChains] = useState<WalletChainBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clients: Record<number, ReturnType<typeof usePublicClient>> = {
    42161: arbClient,
    8453: baseClient,
    1: ethClient,
  };

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const results = await Promise.all(
        SUPPORTED_CHAINS.map(async (chainId) => {
          const client = clients[chainId];
          if (!client) {
            return {
              chain: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
              chainId,
              usdcBalance: 0,
              ethBalance: 0,
              ethBalanceRaw: 0n,
              usdcBalanceRaw: 0n,
            };
          }

          const usdcAddr = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];

          const [ethBal, usdcBal] = await Promise.all([
            client.getBalance({ address }).catch(() => 0n),
            usdcAddr
              ? client.readContract({
                  address: usdcAddr as `0x${string}`,
                  abi: ERC20_ABI,
                  functionName: 'balanceOf',
                  args: [address],
                }).catch(() => 0n)
              : Promise.resolve(0n),
          ]);

          const ethBalance = parseFloat(formatUnits(ethBal as bigint, 18));
          const usdcBalance = parseFloat(formatUnits(usdcBal as bigint, USDC_DECIMALS));

          return {
            chain: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
            chainId,
            usdcBalance,
            ethBalance,
            ethBalanceRaw: ethBal as bigint,
            usdcBalanceRaw: usdcBal as bigint,
          };
        })
      );

      setChains(results);
    } catch (err) {
      console.error('Failed to fetch wallet balances:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, arbClient, baseClient, ethClient]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const totalUsdc = chains.reduce((sum: number, c: WalletChainBalance) => sum + c.usdcBalance, 0);
  const totalEthValue = chains.reduce((sum: number, c: WalletChainBalance) => sum + c.ethBalance * ethPrice, 0);

  return {
    chains,
    totalUsdc,
    totalEthValue,
    isLoading,
    refetch: fetchBalances,
  };
}
