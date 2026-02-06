import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="pigaibank-ui-theme">
      <WalletProvider>
        <App />
      </WalletProvider>
    </ThemeProvider>
  </React.StrictMode>
);
