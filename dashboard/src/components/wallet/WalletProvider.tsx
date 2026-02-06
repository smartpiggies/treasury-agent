import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { useTheme } from '@/components/theme/ThemeProvider';
import '@rainbow-me/rainbowkit/styles.css';

// Create a separate QueryClient for wagmi to avoid conflicts
const wagmiQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { theme } = useTheme();

  const rainbowTheme = theme === 'light'
    ? lightTheme({
        accentColor: 'hsl(221, 83%, 53%)',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      })
    : darkTheme({
        accentColor: 'hsl(221, 83%, 53%)',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={wagmiQueryClient}>
        <RainbowKitProvider
          theme={rainbowTheme}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
