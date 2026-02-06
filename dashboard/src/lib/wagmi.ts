import { http } from "wagmi";
import { arbitrum, base, mainnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn(
    "WalletConnect project ID is not set. Wallet functionality may be limited.",
  );
}

export const config = getDefaultConfig({
  appName: "PigAiBank",
  projectId,
  chains: [arbitrum, base, mainnet],
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: false,
});

// Chain IDs for quick reference
export const CHAIN_IDS = {
  ETHEREUM: mainnet.id,
  ARBITRUM: arbitrum.id,
  BASE: base.id,
} as const;

// Check if WalletConnect is configured
export function isWalletConnectConfigured(): boolean {
  return Boolean(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID);
}
