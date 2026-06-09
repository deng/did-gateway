// ---------------------------------------------------------------------------
// DID Auth Verify — orchestrates the complete verification pipeline
// 1. Validate nonce (D1)
// 2. Mark nonce used (prevent replay)
// 3. Resolve DID → DID Document → VerificationMethod
// 4. Route to correct crypto verifier
// 5. Issue JWT on success
// ---------------------------------------------------------------------------

import { resolveDid } from '../resolvers/registry';
import { verifySignature } from '../crypto/index';
import { issueToken } from './token';
import { didCacheKey, sessionCacheKey } from '../storage/kv';
import type { AuthData, AuthContext, Env } from '../types';
import type { Cache } from '../storage/kv';
import type { Db } from '../storage/d1';

export interface VerifyError {
  status: number;
  error: string;
}

export type VerifyResult =
  | { success: true; data: AuthData; auth: AuthContext }
  | { success: false; error: VerifyError };

export async function verifyAuth(
  nonce: string,
  signature: string,
  did: string,
  chain: string,
  env: Env,
  cache: Cache,
  db: Db,
  ip?: string,
): Promise<VerifyResult> {
  // --- Step 1: Validate nonce ---
  const challengeRow = await db.getChallenge(nonce);
  if (!challengeRow) {
    return { success: false, error: { status: 401, error: 'Invalid nonce' } };
  }
  if (challengeRow.is_used) {
    return { success: false, error: { status: 401, error: 'Nonce already used (replay detected)' } };
  }
  if (challengeRow.expires_at < Date.now()) {
    return { success: false, error: { status: 401, error: 'Nonce expired' } };
  }

  // --- Step 2: Mark nonce used (prevent replay) ---
  await db.markChallengeUsed(nonce);
  await cache.delete(`challenge:${nonce}`);

  // --- Step 3: Resolve DID → DID Document ---
  let resolverResult;
  try {
    resolverResult = resolveDid(did);
    // Cache the resolved DID Document
    await cache.set(didCacheKey(did), resolverResult.didDocument, parseInt(env.DID_CACHE_TTL ?? '300'));
  } catch (err) {
    await db.logOperation({ did, opType: 'verify_fail', detail: `DID resolve error: ${(err as Error).message}`, ip });
    return { success: false, error: { status: 400, error: `DID resolution failed: ${(err as Error).message}` } };
  }

  const { didDocument, caip10, address } = resolverResult;

  // --- Step 4: Extract the first verification method ---
  const vm = didDocument.verificationMethod?.[0];
  if (!vm) {
    await db.logOperation({ did, opType: 'verify_fail', detail: 'No verification method in DID Document', ip });
    return { success: false, error: { status: 400, error: 'DID Document has no verification method' } };
  }

  // Reconstruct the original sign-in message from the challenge
  const message = challengeRow.message;

  // --- Step 5: Route to correct crypto verifier ---
  const verifyResult = verifySignature({
    message,
    signature,
    verificationMethod: vm,
    expectedAddress: address,
  });

  if (!verifyResult.valid) {
    await db.logOperation({
      did,
      opType: 'verify_fail',
      detail: `${verifyResult.error} (address: ${address})`,
      ip,
    });
    return { success: false, error: { status: 401, error: verifyResult.error } };
  }

  // --- Step 6: Issue JWT ---
  const jti = crypto.randomUUID();
  const sessionTtl = parseInt(env.SESSION_TTL ?? '86400');
  const issuer = env.JWT_ISSUER ?? 'did.bithub.pro';
  const authData = await issueToken(env.JWT_SECRET, issuer, {
    did,
    address,
    chain,
    caip10,
    jti,
  }, sessionTtl);

  // Write session to KV for fast revocation check
  await cache.set(
    sessionCacheKey(jti),
    { revoked: false, expiresAt: authData.expiresAt },
    sessionTtl,
  );

  // Write session to D1 for audit
  await db.insertSession({
    jti,
    did,
    address,
    chain,
    caip10,
    issued_at: Math.floor(Date.now() / 1000),
    expires_at: Math.floor(authData.expiresAt / 1000),
    revoked: 0,
    last_used: Math.floor(Date.now() / 1000),
  });

  // Log success
  await db.logOperation({
    did,
    opType: 'verify_success',
    detail: `Chain: ${chain}, Address: ${address}`,
    ip,
  });

  return {
    success: true,
    data: authData,
    auth: { did, address, chain, caip10, jti },
  };
}
