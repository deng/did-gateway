// ---------------------------------------------------------------------------
// RFC 7519 JWT token management
// Uses jose library for JWT signing/verification with HS256.
// ---------------------------------------------------------------------------

import { SignJWT, jwtVerify } from 'jose';
import type { AuthData, AuthContext } from '../types';

/**
 * Derive a 256-bit HMAC key from the JWT_SECRET string.
 */
function getSecretKey(secret: string): Uint8Array {
  // If secret is hex-encoded, decode it; otherwise use raw bytes
  if (/^[0-9a-fA-F]{64,}$/.test(secret)) {
    const bytes = new Uint8Array(secret.length / 2);
    for (let i = 0; i < secret.length; i += 2) {
      bytes[i / 2] = parseInt(secret.slice(i, i + 2), 16);
    }
    return bytes;
  }
  // Pad or hash to get exactly 32 bytes
  const encoder = new TextEncoder();
  const raw = encoder.encode(secret);
  if (raw.length >= 32) return raw.slice(0, 32);
  const padded = new Uint8Array(32);
  padded.set(raw);
  return padded;
}

/**
 * Issue a JWT token.
 */
export async function issueToken(
  secret: string,
  issuer: string,
  payload: {
    did: string;
    address: string;
    chain: string;
    caip10: string;
    jti: string;
  },
  ttlSeconds: number,
): Promise<AuthData> {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = (now + ttlSeconds) * 1000;

  const token = await new SignJWT({
    chain_id: payload.chain,
    address: payload.address,
    caip10: payload.caip10,
    jti: payload.jti,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .setIssuer(issuer)
    .setAudience('zerowallet')
    .setSubject(payload.did)
    .setJti(payload.jti)
    .sign(getSecretKey(secret));

  return { token, did: payload.did, expiresAt };
}

/**
 * Verify and decode a JWT token.
 * Returns the auth context on success, null on failure.
 */
export async function verifyToken(
  secret: string,
  issuer: string,
  token: string,
): Promise<AuthContext | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret), {
      issuer,
      audience: 'zerowallet',
    });

    if (!payload.sub || !payload.jti) return null;

    return {
      did: payload.sub as string,
      address: (payload.address as string) ?? '',
      chain: (payload.chain_id as string) ?? '',
      caip10: (payload.caip10 as string) ?? '',
      jti: payload.jti as string,
    };
  } catch {
    return null;
  }
}
