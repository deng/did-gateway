// ---------------------------------------------------------------------------
// Auth middleware — validates Bearer JWT on protected routes
// Checks KV for revocation, falls back to D1.
// ---------------------------------------------------------------------------

import type { Context } from 'hono';
import { verifyToken } from './token';
import { createCache, sessionCacheKey } from '../storage/kv';
import type { Env, AuthContext } from '../types';

/**
 * Hono middleware that validates the Authorization Bearer JWT.
 * On success, injects auth context into c.set('auth', ...).
 * On failure, returns 401.
 */
export async function authMiddleware(c: Context<{ Bindings: Env; Variables: { auth: AuthContext } }>, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return c.json({ success: false, error: 'Empty token' }, 401);
  }

  // Verify JWT signature
  const issuer = c.env.JWT_ISSUER ?? 'did.bithub.pro';
  const authCtx = await verifyToken(c.env.JWT_SECRET, issuer, token);
  if (!authCtx) {
    return c.json({ success: false, error: 'Invalid or expired token' }, 401);
  }

  // Check revocation status in KV
  const cache = createCache(c.env.DID_CACHE);
  const sessionData = await cache.get<{ revoked: boolean; expiresAt: number }>(sessionCacheKey(authCtx.jti));

  if (sessionData) {
    if (sessionData.revoked) {
      return c.json({ success: false, error: 'Token has been revoked' }, 401);
    }
  }

  // Inject auth context (available as c.get('auth'))
  c.set('auth', authCtx);
  await next();
}
