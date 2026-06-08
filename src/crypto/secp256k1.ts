// ---------------------------------------------------------------------------
// EIP-191 (personal_sign) signature verification for secp256k1 (EVM chains)
// ---------------------------------------------------------------------------

import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

/**
 * Build the EIP-191 personal_sign message hash.
 * \x19Ethereum Signed Message:\n${len}${message}
 */
export function eip191Hash(message: string): Uint8Array {
  const encoder = new TextEncoder();
  const msgBytes = encoder.encode(message);
  const prefix = `\x19Ethereum Signed Message:\n${msgBytes.length}`;
  const prefixBytes = encoder.encode(prefix);
  const combined = new Uint8Array(prefixBytes.length + msgBytes.length);
  combined.set(prefixBytes);
  combined.set(msgBytes, prefixBytes.length);
  return keccak_256(combined);
}

/**
 * Verify an EIP-191 personal_sign signature.
 *
 * @param message - The original plaintext message that was signed
 * @param signature - Hex-encoded signature (0x-prefixed, r(32) + s(32) + v(1))
 * @param expectedAddress - The Ethereum address (0x-prefixed, 40 hex chars)
 * @returns true if the signature is valid
 */
export function verifyEip191(
  message: string,
  signature: string,
  expectedAddress: string,
): boolean {
  const sigHex = signature.replace('0x', '');
  const sigBytes = hexToBytes(sigHex);

  if (sigBytes.length !== 65) {
    return false;
  }

  const r = sigBytes.slice(0, 32);
  const s = sigBytes.slice(32, 64);
  const v = sigBytes[64];

  // Recovery id: v - 27 (for non-EIP-155) or v - 35 - (chainId * 2) (for EIP-155)
  // Most wallet personal_sign returns v = 27 or 28
  let recoveryId = v - 27;
  if (recoveryId < 0 || recoveryId > 1) {
    // Try EIP-155 format: v = 35 + chainId * 2 +/- 1
    // If we can't determine, try both 0 and 1
    recoveryId = (v % 2 === 0) ? 1 : 0;
  }

  const msgHash = eip191Hash(message);

  try {
    const sig = secp256k1.Signature.fromCompact(new Uint8Array([...r, ...s]));
    sig.addRecoveryBit(recoveryId);

    const recoveredPoint = sig.recoverPublicKey(msgHash);
    const uncompressedPub = recoveredPoint.toRawBytes(false); // 0x04 + x + y

    // Ethereum address = keccak256(pubkey[1:]).slice(-20)
    const pubKeyHash = keccak_256(uncompressedPub.slice(1));
    const recoveredAddress = bytesToHex(pubKeyHash.slice(-20));

    return recoveredAddress.toLowerCase() === expectedAddress.replace('0x', '').toLowerCase();
  } catch {
    return false;
  }
}
