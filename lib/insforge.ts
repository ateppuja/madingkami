import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

// Initialize InsForge client if environment variables are configured
export const insforge = baseUrl && anonKey
  ? createClient({ baseUrl, anonKey })
  : null;

export const isInsForgeConfigured = (): boolean => {
  return Boolean(baseUrl && anonKey && insforge);
};
