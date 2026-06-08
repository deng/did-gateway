// ---------------------------------------------------------------------------
// did:pkh resolver — deterministic, no network calls
// https://github.com/w3c-ccg/did-pkh
// ---------------------------------------------------------------------------

import type { DIDDocument, ResolverResult, VerificationMethod } from '../types';

/**
 * Parse a did:pkh identifier into its components.
 * Format: did:pkh:<namespace>:<reference>:<address>
 * e.g. did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a
 */
function parseDidPkh(did: string): { namespace: string; reference: string; address: string } | null {
  const prefix = 'did:pkh:';
  if (!did.startsWith(prefix)) return null;

  const rest = did.slice(prefix.length);
  // Split on ':' — the last segment is the address, everything before is namespace:reference
  const lastColon = rest.lastIndexOf(':');
  if (lastColon < 0) return null;

  const namespace = rest.slice(0, lastColon);  // e.g. "eip155:1"
  const address = rest.slice(lastColon + 1);    // e.g. "0xb9c571..."

  // Split namespace into its parts
  const nsParts = namespace.split(':');
  if (nsParts.length < 2) return null;

  return { namespace, reference: nsParts[1], address };
}

/**
 * Determine verification method type based on chain namespace.
 */
function getVerificationMethodType(namespace: string): string {
  if (namespace.startsWith('eip155')) return 'EcdsaSecp256k1RecoveryMethod2020';
  if (namespace.startsWith('solana')) return 'Ed25519VerificationKey2018';
  if (namespace.startsWith('bip122')) return 'EcdsaSecp256k1VerificationKey2019';
  return 'VerificationMethod'; // fallback
}

/**
 * Resolve a did:pkh identifier to a DID Document.
 */
export function resolveDidPkh(did: string): ResolverResult {
  const parsed = parseDidPkh(did);
  if (!parsed) {
    throw new Error(`Invalid did:pkh identifier: ${did}`);
  }

  const { namespace, address } = parsed;
  const vmType = getVerificationMethodType(namespace);
  const caip10 = `${namespace}:${address}`;
  const blockchainId = `${address}@${namespace}`;

  const vmId = `${did}#blockchainAccountId`;

  const verificationMethod: VerificationMethod[] = [{
    id: vmId,
    type: vmType,
    controller: did,
    ...(vmType === 'Ed25519VerificationKey2018'
      ? { blockchainAccountId: blockchainId }
      : { blockchainAccountId: blockchainId }),
  }];

  const didDocument: DIDDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      { blockchainAccountId: 'https://w3id.org/security#blockchainAccountId' },
    ],
    id: did,
    verificationMethod,
    authentication: [vmId],
    assertionMethod: [vmId],
  };

  return { didDocument, caip10, chain: namespace, address };
}
