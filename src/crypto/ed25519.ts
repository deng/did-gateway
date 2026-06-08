// ---------------------------------------------------------------------------
// Ed25519 signature verification (Solana, etc.)
// ---------------------------------------------------------------------------

import { ed25519 } from '@noble/curves/ed25519';
import { hexToBytes } from '@noble/hashes/utils';

/**
 * Verify an Ed25519 signature.
 *
 * @param message - The original plaintext message
 * @param signature - Hex-encoded signature
 * @param publicKey - Hex-encoded Ed25519 public key
 * @returns true if the signature is valid
 */
export function verifyEd25519(
  message: string,
  signature: string,
  publicKey: string,
): boolean {
  try {
    const msgBytes = new TextEncoder().encode(message);
    const sigBytes = hexToBytes(signature.replace('0x', ''));
    const pubBytes = hexToBytes(publicKey.replace('0x', ''));
    return ed25519.verify(sigBytes, msgBytes, pubBytes);
  } catch {
    return false;
  }
}
