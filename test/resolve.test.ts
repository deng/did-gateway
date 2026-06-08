// ---------------------------------------------------------------------------
// DID Resolver tests
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { resolveDidPkh } from '../src/resolvers/pkh';
import { resolveDidKey } from '../src/resolvers/key';
import { resolveDid, getSupportedMethods } from '../src/resolvers/registry';

describe('did:pkh resolver', () => {
  const did = 'did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a';

  it('resolves to a DID Document', () => {
    const result = resolveDidPkh(did);
    expect(result.didDocument.id).toBe(did);
    expect(result.caip10).toBe('eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a');
    expect(result.chain).toBe('eip155:1');
    expect(result.address).toBe('0xb9c5714089478a327f09197987f16f9e5d936e8a');
  });

  it('sets correct verification method', () => {
    const result = resolveDidPkh(did);
    const vm = result.didDocument.verificationMethod?.[0];
    expect(vm).toBeDefined();
    expect(vm!.type).toBe('EcdsaSecp256k1RecoveryMethod2020');
    expect(vm!.controller).toBe(did);
    expect(vm!.blockchainAccountId).toBe('0xb9c5714089478a327f09197987f16f9e5d936e8a@eip155:1');
  });

  it('sets authentication and assertionMethod', () => {
    const result = resolveDidPkh(did);
    expect(result.didDocument.authentication).toHaveLength(1);
    expect(result.didDocument.assertionMethod).toHaveLength(1);
  });

  it('rejects invalid did:pkh format', () => {
    expect(() => resolveDidPkh('did:pkh:invalid')).toThrow();
  });
});

describe('did:key resolver', () => {
  // Ed25519 test key: from the spec
  const ed25519Did = 'did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH';

  it('resolves Ed25519 did:key to a DID Document', () => {
    const result = resolveDidKey(ed25519Did);
    expect(result.didDocument.id).toBe(ed25519Did);
    expect(result.didDocument.verificationMethod).toHaveLength(1);
  });

  it('sets correct verification method type for Ed25519', () => {
    const result = resolveDidKey(ed25519Did);
    const vm = result.didDocument.verificationMethod?.[0];
    expect(vm!.type).toBe('Ed25519VerificationKey2018');
    expect(vm!.publicKeyMultibase).toBeDefined();
    expect(vm!.publicKeyMultibase!.startsWith('z')).toBe(true);
  });
});

describe('resolver registry', () => {
  it('routes did:pkh correctly', () => {
    const result = resolveDid('did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a');
    expect(result.didDocument.id).toContain('did:pkh:');
  });

  it('routes did:key correctly', () => {
    const result = resolveDid('did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH');
    expect(result.didDocument.id).toContain('did:key:');
  });

  it('rejects unsupported DID methods', () => {
    expect(() => resolveDid('did:unsupported:123')).toThrow('Unsupported DID method');
  });

  it('rejects invalid DID format', () => {
    expect(() => resolveDid('not-a-did')).toThrow('Invalid DID format');
  });

  it('returns supported methods', () => {
    const methods = getSupportedMethods();
    expect(methods.length).toBeGreaterThan(0);
    expect(methods.map((m) => m.method)).toContain('pkh');
    expect(methods.map((m) => m.method)).toContain('key');
  });
});
