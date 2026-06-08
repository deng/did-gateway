// ---------------------------------------------------------------------------
// did:key resolver — deterministic from multicodec-encoded public key
// https://w3c-ccg.github.io/did-method-key
// ---------------------------------------------------------------------------

import type { DIDDocument, ResolverResult, VerificationMethod } from '../types';

// Multicodec table for supported key types (varint hex)
const MULTICODEC_TABLE: Array<{ prefix: number[]; type: string; keyLength: number }> = [
  { prefix: [0xed, 0x01], type: 'Ed25519VerificationKey2018', keyLength: 32 },
  { prefix: [0xe7, 0x01], type: 'EcdsaSecp256k1VerificationKey2019', keyLength: 33 },
  { prefix: [0x80, 0x24], type: 'P256VerificationKey2018', keyLength: 33 },
  { prefix: [0x12, 0x00], type: 'RSAVerificationKey2018', keyLength: 0 }, // variable
];

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58btcDecode(input: string): Uint8Array {
  let leadingZeros = 0;
  for (let i = 0; i < input.length && input[i] === '1'; i++) {
    leadingZeros++;
  }

  let num = 0n;
  for (let i = 0; i < input.length; i++) {
    const idx = BASE58_ALPHABET.indexOf(input[i]);
    if (idx < 0) throw new Error(`Invalid base58 character: ${input[i]}`);
    num = num * 58n + BigInt(idx);
  }

  const bytes: number[] = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num >>= 8n;
  }
  for (let i = 0; i < leadingZeros; i++) {
    bytes.unshift(0);
  }
  return new Uint8Array(bytes);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Decode a did:key multibase string to raw public key hex.
 * Format: did:key:z<base58btc(multicodec(pubkey))>
 */
function decodeDidKey(did: string): { publicKeyHex: string; type: string } {
  const prefix = 'did:key:z';
  if (!did.startsWith(prefix)) {
    throw new Error(`Invalid did:key format: ${did}`);
  }

  const encoded = did.slice(prefix.length - 1); // include 'z'
  const decoded = base58btcDecode(encoded.slice(1)); // skip 'z' for base58 decode

  for (const entry of MULTICODEC_TABLE) {
    if (decoded.length >= entry.prefix.length + entry.keyLength &&
        entry.prefix.every((b, i) => decoded[i] === b)) {
      const keyBytes = decoded.slice(entry.prefix.length, entry.prefix.length + entry.keyLength);
      return { publicKeyHex: bytesToHex(keyBytes), type: entry.type };
    }
  }

  throw new Error(`Unsupported key type in did:key: ${did}`);
}

/**
 * Resolve a did:key identifier to a DID Document.
 */
export function resolveDidKey(did: string): ResolverResult {
  const { publicKeyHex, type } = decodeDidKey(did);

  const vmId = `${did}#${did.slice('did:key:'.length)}`;
  const isEd25519 = type === 'Ed25519VerificationKey2018';
  const isSecp256k1 = type === 'EcdsaSecp256k1VerificationKey2019';

  const verificationMethod: VerificationMethod[] = [{
    id: vmId,
    type,
    controller: did,
    publicKeyMultibase: `z${base58btcEncoded(publicKeyHex, type)}`,
  }];

  const didDocument: DIDDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/multikey/v1',
    ],
    id: did,
    verificationMethod,
    authentication: [vmId],
    assertionMethod: [vmId],
    ...(isEd25519 ? { keyAgreement: [vmId] } : {}),
    ...(isSecp256k1 ? { capabilityInvocation: [vmId], capabilityDelegation: [vmId] } : {}),
  };

  return {
    didDocument,
    caip10: '', // did:key has no chain binding
    chain: '',
    address: publicKeyHex,
  };
}

/**
 * Encode raw public key hex back to multibase for publicKeyMultibase field.
 */
function base58btcEncoded(hex: string, type: string): string {
  const raw = hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? [];
  const prefix = MULTICODEC_TABLE.find((t) => t.type === type);
  const prefixed = prefix ? [...prefix.prefix, ...raw] : raw;
  return base58btcEncode(new Uint8Array(prefixed));
}

function base58btcEncode(bytes: Uint8Array): string {
  let leadingZeros = 0;
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    leadingZeros++;
  }

  let num = 0n;
  for (const b of bytes) {
    num = num * 256n + BigInt(b);
  }

  let result = '';
  while (num > 0n) {
    result = BASE58_ALPHABET[Number(num % 58n)] + result;
    num /= 58n;
  }

  return '1'.repeat(leadingZeros) + result;
}
