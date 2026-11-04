import 'dotenv/config';
export function readEnv(env = process.env) {
  const required = ['DATABASE_URL','FRONTEND_URL','PUBLIC_BASE_URL','NEON_AUTH_BASE_URL','NEON_AUTH_JWKS_URL','NEON_AUTH_ISSUER','NEON_AUTH_AUDIENCE'];
  for (const name of required) if (!env[name]) throw new Error(`Missing required configuration: ${name}`);
  for (const name of required.filter(n => n !== 'DATABASE_URL')) {
    const url = new URL(env[name]);
    if (!['http:', 'https:'].includes(url.protocol)) throw Error(`Invalid URL configuration: ${name}`);
    if (env.NODE_ENV === 'production' && url.protocol !== 'https:') throw Error(`HTTPS required: ${name}`);
  }
  const port = Number(env.PORT || 5000), trustProxyHops = Number(env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(port) || port < 1 || port > 65535 || !Number.isInteger(trustProxyHops) || trustProxyHops < 0) throw Error('Invalid port or proxy configuration');
  return { databaseUrl: env.DATABASE_URL, frontendUrl: env.FRONTEND_URL, publicBaseUrl: env.PUBLIC_BASE_URL.replace(/\/$/, ''), jwksUrl: env.NEON_AUTH_JWKS_URL, issuer: env.NEON_AUTH_ISSUER, audience: env.NEON_AUTH_AUDIENCE, port, trustProxyHops };
}
