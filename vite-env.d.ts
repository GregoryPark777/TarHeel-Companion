/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Augment the existing Process interface to include the API_KEY.
 * This satisfies the Gemini SDK's requirement for process.env.API_KEY.
 * We use interface merging instead of redeclaring the variable 'process'
 * to avoid conflicts with existing block-scoped declarations of 'process'
 * (which are common in Vite/Node mixed environments).
 */
interface Process {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  };
}

interface Window {
  aistudio?: {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  };
}
