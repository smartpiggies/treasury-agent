/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_N8N_WEBHOOK_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
