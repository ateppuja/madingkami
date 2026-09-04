import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://sa4ue85s.ap-southeast.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'insforge-anon-key';

// Initialize InsForge client if base URL is configured
export const insforge = baseUrl
  ? createClient({ baseUrl, anonKey })
  : null;

export const isInsForgeConfigured = (): boolean => {
  return Boolean(baseUrl && insforge);
};
