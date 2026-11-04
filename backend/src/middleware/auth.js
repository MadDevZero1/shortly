import { createRemoteJWKSet, jwtVerify } from 'jose';
import { HttpError } from '../utils/errors.js';
export function createVerifier(config) {
  const jwks = createRemoteJWKSet(new URL(config.jwksUrl), { timeoutDuration: 5000 });
  return async token => {
    try {
      const { payload } = await jwtVerify(token, jwks, { issuer: config.issuer, audience: config.audience, algorithms: ['EdDSA'], requiredClaims: ['sub', 'exp', 'iat'] });
      if (typeof payload.sub !== 'string' || !payload.sub.trim() || payload.role === 'anonymous' || payload.banned === true) throw Error('Invalid identity');
      return payload.sub;
    } catch (error) {
      if (['ERR_JWKS_TIMEOUT'].includes(error.code) || error instanceof TypeError) throw new HttpError(503, 'AUTH_UNAVAILABLE', 'Authentication is temporarily unavailable.');
      throw new HttpError(401, 'UNAUTHORIZED', 'Sign in to continue.');
    }
  };
}
export function authMiddleware(verifyToken) {
  return async (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const header = req.get('authorization') || '';
    if (!/^Bearer \S+$/i.test(header)) return next(new HttpError(401, 'UNAUTHORIZED', 'Sign in to continue.'));
    try { req.ownerId = await verifyToken(header.slice(7)); next(); } catch (error) { next(error); }
  };
}
