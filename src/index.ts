// ---------------------------------------------------------------------------
// DID Gateway — main Hono app
// ---------------------------------------------------------------------------

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiSpec } from './openapi';
import { createChallenge } from './auth/challenge';
import { verifyAuth } from './auth/verify';
import { verifyToken } from './auth/token';
import { authMiddleware } from './auth/middleware';
import { resolveDid, getSupportedMethods } from './resolvers/registry';
import { createCache, didCacheKey, challengeCacheKey, sessionCacheKey } from './storage/kv';
import { createDb } from './storage/d1';
import type { Env, ApiResponse, HealthResponse, ChallengeData, AuthData, AuthContext } from './types';

type Variables = {
  auth: AuthContext;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// ---------------------------------------------------------------------------
// OpenAPI
// ---------------------------------------------------------------------------
app.get('/openapi.json', (c) => c.json(openApiSpec));
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  } satisfies HealthResponse);
});

// ---------------------------------------------------------------------------
// GET /api/v1/methods — supported DID methods
// ---------------------------------------------------------------------------
app.get('/api/v1/methods', (c) => {
  const methods = getSupportedMethods();
  return c.json({ success: true, data: methods } satisfies ApiResponse);
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/challenge — generate CAIP-122 challenge
// ---------------------------------------------------------------------------
app.post('/api/v1/auth/challenge', async (c) => {
  let body: { address?: string; chain?: string; domain?: string; uri?: string; statement?: string; resources?: string[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }

  if (!body.address) {
    return c.json({ success: false, error: "Field 'address' is required" } satisfies ApiResponse, 400);
  }
  if (!body.chain) {
    return c.json({ success: false, error: "Field 'chain' is required" } satisfies ApiResponse, 400);
  }

  const challengeData: ChallengeData = createChallenge({
    address: body.address,
    chain: body.chain,
    domain: body.domain,
    uri: body.uri,
    statement: body.statement,
    resources: body.resources,
  });

  // Store challenge in D1 + KV
  const cache = createCache(c.env.DID_CACHE);
  const db = createDb(c.env.DID_DB);
  const ttl = parseInt(c.env.CHALLENGE_TTL ?? '300');

  await cache.set(challengeCacheKey(challengeData.nonce), {
    address: body.address,
    chain: body.chain,
  }, ttl);

  await db.insertChallenge({
    nonce: challengeData.nonce,
    address: body.address,
    chain: body.chain,
    did: null,
    domain: body.domain ?? null,
    message: challengeData.message,
    expires_at: challengeData.expiresAt,
    is_used: 0,
    ip: c.req.header('CF-Connecting-IP') ?? null,
    created_at: Date.now(),
  });

  return c.json({ success: true, data: challengeData } satisfies ApiResponse<ChallengeData>);
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/verify — verify signature + issue JWT
// ---------------------------------------------------------------------------
app.post('/api/v1/auth/verify', async (c) => {
  let body: { nonce?: string; signature?: string; did?: string; chain?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }

  if (!body.nonce || !body.signature || !body.did || !body.chain) {
    return c.json({
      success: false,
      error: "Fields 'nonce', 'signature', 'did', and 'chain' are required",
    } satisfies ApiResponse, 400);
  }

  const cache = createCache(c.env.DID_CACHE);
  const db = createDb(c.env.DID_DB);
  const ip = c.req.header('CF-Connecting-IP');

  const result = await verifyAuth(body.nonce, body.signature, body.did, body.chain, c.env, cache, db, ip);

  if (!result.success) {
    return c.json({ success: false, error: result.error.error } satisfies ApiResponse, result.error.status as 400 | 401);
  }

  return c.json({ success: true, data: result.data } satisfies ApiResponse<AuthData>);
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/refresh — refresh JWT
// ---------------------------------------------------------------------------
app.post('/api/v1/auth/refresh', async (c) => {
  let body: { token?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }
  if (!body.token) {
    return c.json({ success: false, error: "Field 'token' is required" } satisfies ApiResponse, 400);
  }

  const issuer = c.env.JWT_ISSUER ?? 'did-gateway.bithub.pro';
  const authCtx = await verifyToken(c.env.JWT_SECRET, issuer, body.token);
  if (!authCtx) {
    return c.json({ success: false, error: 'Invalid or expired token' } satisfies ApiResponse, 401);
  }

  // Issue new token, revoke old one
  const { issueToken } = await import('./auth/token');
  const cache = createCache(c.env.DID_CACHE);
  const db = createDb(c.env.DID_DB);

  const newJti = crypto.randomUUID();
  const sessionTtl = parseInt(c.env.SESSION_TTL ?? '86400');
  const newAuthData = await issueToken(c.env.JWT_SECRET, issuer, {
    did: authCtx.did,
    address: authCtx.address,
    chain: authCtx.chain,
    caip10: authCtx.caip10,
    jti: newJti,
  }, sessionTtl);

  // Revoke old token
  await cache.set(sessionCacheKey(authCtx.jti), { revoked: true, expiresAt: 0 }, 60);
  await db.revokeSession(authCtx.jti);

  // Store new session
  await cache.set(sessionCacheKey(newJti), { revoked: false, expiresAt: newAuthData.expiresAt }, sessionTtl);
  await db.insertSession({
    jti: newJti,
    did: authCtx.did,
    address: authCtx.address,
    chain: authCtx.chain,
    caip10: authCtx.caip10,
    issued_at: Math.floor(Date.now() / 1000),
    expires_at: Math.floor(newAuthData.expiresAt / 1000),
    revoked: 0,
    last_used: Math.floor(Date.now() / 1000),
  });

  return c.json({ success: true, data: newAuthData } satisfies ApiResponse<AuthData>);
});

// ---------------------------------------------------------------------------
// POST /api/v1/auth/revoke — revoke JWT
// ---------------------------------------------------------------------------
app.post('/api/v1/auth/revoke', async (c) => {
  let body: { token?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }
  if (!body.token) {
    return c.json({ success: false, error: "Field 'token' is required" } satisfies ApiResponse, 400);
  }

  const issuer = c.env.JWT_ISSUER ?? 'did-gateway.bithub.pro';
  const authCtx = await verifyToken(c.env.JWT_SECRET, issuer, body.token);
  if (!authCtx) {
    return c.json({ success: false, error: 'Invalid token' } satisfies ApiResponse, 401);
  }

  const cache = createCache(c.env.DID_CACHE);
  const db = createDb(c.env.DID_DB);

  await cache.set(sessionCacheKey(authCtx.jti), { revoked: true, expiresAt: 0 }, 60);
  await db.revokeSession(authCtx.jti);

  return c.json({ success: true } satisfies ApiResponse);
});

// ---------------------------------------------------------------------------
// GET /api/v1/resolve/:did — resolve DID to DID Document
// ---------------------------------------------------------------------------
app.get('/api/v1/resolve/:did', async (c) => {
  const did = c.req.param('did');
  if (!did) {
    return c.json({ success: false, error: 'DID is required' } satisfies ApiResponse, 400);
  }

  const cache = createCache(c.env.DID_CACHE);
  const cached = await cache.get(didCacheKey(did));
  if (cached) {
    return c.json({ success: true, data: cached } satisfies ApiResponse);
  }

  try {
    const result = resolveDid(did);
    await cache.set(didCacheKey(did), result.didDocument, parseInt(c.env.DID_CACHE_TTL ?? '300'));
    return c.json({ success: true, data: result.didDocument } satisfies ApiResponse);
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message } satisfies ApiResponse, 400);
  }
});

// ---------------------------------------------------------------------------
// POST /api/v1/resolve — batch resolve DIDs
// ---------------------------------------------------------------------------
app.post('/api/v1/resolve', async (c) => {
  let body: { dids?: string[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }

  if (!body.dids || !Array.isArray(body.dids) || body.dids.length === 0) {
    return c.json({ success: false, error: "Field 'dids' must be a non-empty array" } satisfies ApiResponse, 400);
  }

  const results = [];
  for (const did of body.dids) {
    try {
      const doc = resolveDid(did);
      results.push({ did, success: true, data: doc.didDocument });
    } catch (err) {
      results.push({ did, success: false, error: (err as Error).message });
    }
  }

  return c.json({ success: true, data: results } satisfies ApiResponse);
});

// ---------------------------------------------------------------------------
// GET /api/v1/resolve-by-address/:caip10 — resolve DID from CAIP-10 address
// ---------------------------------------------------------------------------
app.get('/api/v1/resolve-by-address/:caip10', async (c) => {
  const caip10 = c.req.param('caip10')!;
  const didStr = `did:pkh:${caip10}`;

  const cache = createCache(c.env.DID_CACHE);
  const cached = await cache.get(didCacheKey(didStr));
  if (cached) {
    return c.json({ success: true, data: cached } satisfies ApiResponse);
  }

  try {
    const result = resolveDid(didStr);
    await cache.set(didCacheKey(didStr), result.didDocument, parseInt(c.env.DID_CACHE_TTL ?? '300'));
    return c.json({ success: true, data: result.didDocument } satisfies ApiResponse);
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message } satisfies ApiResponse, 400);
  }
});

// ---------------------------------------------------------------------------
// POST /api/v1/dids — create DID (protected)
// ---------------------------------------------------------------------------
app.post('/api/v1/dids', authMiddleware, async (c) => {
  const auth = c.get('auth');

  let body: { did?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: 'Invalid JSON body' } satisfies ApiResponse, 400);
  }

  if (!body.did) {
    return c.json({ success: false, error: "Field 'did' is required" } satisfies ApiResponse, 400);
  }

  const db = createDb(c.env.DID_DB);
  // Check if DID already exists
  const existing = await db.getRegistryByDid(body.did);
  if (existing) {
    return c.json({ success: false, error: 'DID already exists' } satisfies ApiResponse, 409);
  }

  const method = body.did.split(':')[1] ?? 'unknown';
  const now = Date.now();

  await db.insertRegistry({
    did: body.did,
    controller: auth.caip10,
    method,
    status: 'active',
    created_at: now,
    updated_at: now,
  });

  await db.logOperation({
    did: body.did,
    opType: 'create',
    detail: `Created by ${auth.caip10}`,
    requester: auth.caip10,
  });

  return c.json({ success: true, data: { did: body.did, controller: auth.caip10, method, status: 'active' } } satisfies ApiResponse, 201);
});

// ---------------------------------------------------------------------------
// GET /api/v1/dids — list DIDs by controller (protected)
// ---------------------------------------------------------------------------
app.get('/api/v1/dids', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const controller = c.req.query('controller') ?? auth.caip10;

  const db = createDb(c.env.DID_DB);
  const entries = await db.getRegistryByController(controller);

  return c.json({ success: true, data: entries } satisfies ApiResponse);
});

// ---------------------------------------------------------------------------
// DELETE /api/v1/dids/:did — deactivate DID (protected)
// ---------------------------------------------------------------------------
app.delete('/api/v1/dids/:did', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const did = c.req.param('did')!;

  const db = createDb(c.env.DID_DB);
  const cache = createCache(c.env.DID_CACHE);

  const entry = await db.getRegistryByDid(did);
  if (!entry) {
    return c.json({ success: false, error: 'DID not found' } satisfies ApiResponse, 404);
  }
  if (entry.controller !== auth.caip10) {
    return c.json({ success: false, error: 'Forbidden: not the DID controller' } satisfies ApiResponse, 403);
  }

  await db.updateRegistryStatus(did, 'deactivated');
  await cache.delete(didCacheKey(did));

  await db.logOperation({
    did,
    opType: 'deactivate',
    detail: `Deactivated by ${auth.caip10}`,
    requester: auth.caip10,
  });

  return c.json({ success: true } satisfies ApiResponse);
});

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export default {
  fetch: app.fetch,
};
