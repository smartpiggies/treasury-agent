import { Client, Account, Databases, Query } from 'appwrite';

const client = new Client();

// Configure client with environment variables
if (import.meta.env.VITE_APPWRITE_ENDPOINT) {
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'treasury';

export const COLLECTIONS = {
  PRICE_HISTORY: 'price_history',
  EXECUTIONS: 'executions',
  ALERTS: 'alerts',
  BALANCES: 'balances',
} as const;

// Re-export Query for convenience
export { Query };

// Helper to check if Appwrite is configured
export function isAppwriteConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_APPWRITE_ENDPOINT &&
      import.meta.env.VITE_APPWRITE_PROJECT_ID
  );
}
