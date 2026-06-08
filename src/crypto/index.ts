// ---------------------------------------------------------------------------
// Unified signature verification entry point
// Routes to the correct verifier based on verification method type.
// ---------------------------------------------------------------------------

import { verifyEip191 } from './secp256k1';
import { verifyEd25519 } from './ed25519';
import type { VerificationMethod } from '../types';

export interface VerifyParams {
  message: string;
  signature: string;
  verificationMethod: VerificationMethod;
  /** Expected CAIP-10 address (used by EIP-191) */
  expectedAddress?: string;
}

export type VerifyResult =
  | { valid: true }
  | { valid: false; error: string };

/**
 * Verify a signature against a DID Document's verification method.
 * Routes to the correct algorithm based on verificationMethod.type.
 */
export function verifySignature(params: VerifyParams): VerifyResult {
  const { message, signature, verificationMethod, expectedAddress } = params;

  switch (verificationMethod.type) {
    case 'EcdsaSecp256k1RecoveryMethod2020':
    case 'EcdsaSecp256k1VerificationKey2019': {
      if (!expectedAddress) {
        return { valid: false, error: 'EIP-191 requires an expected address' };
      }
      const ok = verifyEip191(message, signature, expectedAddress);
      return ok
        ? { valid: true }
        : { valid: false, error: 'EIP-191 signature does not match address' };
    }

    case 'Ed25519VerificationKey2018':
    case 'Ed25519VerificationKey2020': {
      const pubkey = verificationMethod.publicKeyMultibase;
      if (!pubkey) {
        return { valid: false, error: 'Ed25519 requires publicKeyMultibase' };
      }
      // multibase 'z' = base58btc, decode it
      const pk = tryDecodeMultibaseKey(pubkey);
      if (!pk) {
        return { valid: false, error: 'Invalid publicKeyMultibase format' };
      }
      const ok = verifyEd25519(message, signature, pk);
      return ok
        ? { valid: true }
        : { valid: false, error: 'Ed25519 signature does not match public key' };
    }

    default:
      return { valid: false, error: `Unsupported verification method type: ${verificationMethod.type}` };
  }
}

/**
 * Rough multibase decode (base58btc 'z' prefix).
 * Returns hex string of the decoded bytes, with multicodec prefix stripped if Ed25519.
 */
function tryDecodeMultibaseKey(multibase: string): string | null {
  if (!multibase.startsWith('z')) return null;
  try {
    // Dynamic import or inline base58 decoder to avoid extra dependency
    const decoded = base58btcDecode(multibase.slice(1));
    // Ed25519 multicodec prefix is 0xed01 (2 bytes), key is 32 bytes
    if (decoded.length === 34 && decoded[0] === 0xed && decoded[1] === 0x01) {
      return bytesToHex(decoded.slice(2));
    }
    // If no prefix, assume raw key
    if (decoded.length === 32) {
      return bytesToHex(decoded);
    }
    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Minimal base58btc decoder (no external dependency)
// ---------------------------------------------------------------------------
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58btcDecode(input: string): Uint8Array {
  // Count leading zeros
  let leadingZeros = 0;
  for (let i = 0; i < input.length && input[i] === '1'; i++) {
    leadingZeros++;
  }

  // Decode to bigint
  let num = 0n;
  for (let i = 0; i < input.length; i++) {
    const digit = BigInt(BASE58_ALPHABET.indexOf(input[i]));
    if (digit < 0n) throw new Error(`Invalid base58 character: ${input[i]}`);
    num = num * 58n + digit;
  }

  // Convert to bytes
  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }

  // Add leading zeros back
  for (let i = 0; i < leadingZeros; i++) {
    bytes.unshift(0);
  }

  return new Uint8Array(bytes);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
