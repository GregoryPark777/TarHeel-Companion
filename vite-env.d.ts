/// <reference types="vite/client" />

/**
 * Augment the NodeJS namespace to include our specific environment variables.
 * This ensures process.env.API_KEY is recognized by TypeScript.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    readonly VITE_API_KEY: string;
  }
}
