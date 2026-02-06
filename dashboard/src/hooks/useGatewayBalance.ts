import { useAccount, useReadContracts } from 'wagmi';
import {
  GATEWAY_WALLET,
  GATEWAY_WALLET_ABI,
  USDC_ADDRESSES,
  CHAIN_NAMES,
  USDC_DECIMALS,
} from '@/lib/contracts';

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

  const contracts = SUPPORTED_CHAINS.map((chainId) => ({
    address: GATEWAY_WALLET,
    abi: GATEWAY_WALLET_ABI,
    functionName: 'totalBalance' as const,
    args: [USDC_ADDRESSES[chainId], address!] as const,
    chainId,
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(address),
    },
  });

  const chains: ChainBalance[] = SUPPORTED_CHAINS.map((chainId, i) => {
    const result = data?.[i];
    const balance = result?.status === 'success' ? (result.result as bigint) : 0n;
    const balanceUsd = Number(balance) / 10 ** USDC_DECIMALS;
    return {
      chain: CHAIN_NAMES[chainId] || `Chain ${chainId}`,
      chainId,
      balance,
      balanceUsd,
    };
  });

  const totalUsd = chains.reduce((sum, c) => sum + c.balanceUsd, 0);

  return {
    totalUsd,
    chains,
    isLoading,
    refetch,
  };
}
