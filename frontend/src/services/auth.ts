import { createAuthClient } from '@neon/neon-js/auth';
import { BetterAuthVanillaAdapter } from '@neon/neon-js/auth/vanilla/adapters';

export const authConfigured = Boolean(import.meta.env.VITE_NEON_AUTH_URL);
// Keep provider-managed sessions; API JWTs are fetched as needed and never persisted.
const authUrl=new URL('/neon-auth',window.location.origin).href;
export const authClient = authConfigured ? createAuthClient(authUrl,{adapter:BetterAuthVanillaAdapter({fetchOptions:{credentials:'include'}})}) : null;
export function requireAuth() {
  if (!authClient) throw new Error('Sign-in is not configured yet. Please try again once the service is connected.');
  return authClient;
}
export async function getToken() {
  requireAuth();
  // The installed SDK caches token() as session data; use the provider's token endpoint.
  const response=await fetch(`${authUrl.replace(/\/$/,'')}/token`,{credentials:'include',cache:'no-store'});
  const result=await response.json();
  if(!response.ok || typeof result.token!=='string')throw new Error('Your session has expired. Please sign in again.');
  return result.token as string;
}
