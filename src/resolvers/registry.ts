// ---------------------------------------------------------------------------
// Resolver registry — routes DID resolution by method name
// ---------------------------------------------------------------------------

import type { ResolverResult } from '../types';
import { resolveDidPkh } from './pkh';
import { resolveDidKey } from './key';

export type Resolver = (did: string) => ResolverResult;

interface ResolverEntry {
  name: string;
  description: string;
  resolve: Resolver;
}

const RESOLVERS: ResolverEntry[] = [
  {
    name: 'pkh',
    description: 'did:pkh — deterministic DID from CAIP-10 address, no network needed',
    resolve: resolveDidPkh,
  },
  {
    name: 'key',
    description: 'did:key — deterministic DID from public key, no network needed',
    resolve: resolveDidKey,
  },
];

/**
 * Resolve any DID to a DID Document.
 * Auto-detects method from DID prefix.
 */
export function resolveDid(did: string): ResolverResult {
  const colonIdx = did.indexOf(':');
  if (colonIdx < 0) throw new Error(`Invalid DID format: ${did}`);

  const rest = did.slice(colonIdx + 1);
  const methodEnd = rest.indexOf(':');
  if (methodEnd < 0) throw new Error(`Invalid DID format: ${did}`);

  const method = rest.slice(0, methodEnd);
  const resolver = RESOLVERS.find((r) => r.name === method);
  if (!resolver) {
    throw new Error(`Unsupported DID method: ${method}. Supported: ${getSupportedMethods().join(', ')}`);
  }

  return resolver.resolve(did);
}

/**
 * List all supported DID methods.
 */
export function getSupportedMethods(): Array<{ method: string; description: string }> {
  return RESOLVERS.map((r) => ({ method: r.name, description: r.description }));
}
