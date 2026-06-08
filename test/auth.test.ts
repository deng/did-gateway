// ---------------------------------------------------------------------------
// Auth module tests: challenge, verify, token
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { createChallenge } from '../src/auth/challenge';
import { verifyEip191 } from '../src/crypto/secp256k1';
import { verifyEd25519 } from '../src/crypto/ed25519';

describe('challenge generation (CAIP-122 / EIP-4361)', () => {
  it('generates a nonce and message', () => {
    const result = createChallenge({
      address: '0xb9c5714089478a327f09197987f16f9e5d936e8a',
      chain: 'eip155:1',
      domain: 'app.zerowallet.io',
    });

    expect(result.nonce).toBeDefined();
    expect(result.nonce.length).toBeGreaterThanOrEqual(16);
    expect(result.message).toBeDefined();
    expect(result.expiresAt).toBeGreaterThan(Date.now());
  });

  it('includes all required EIP-4361 fields in message', () => {
    const result = createChallenge({
      address: '0xb9c5714089478a327f09197987f16f9e5d936e8a',
      chain: 'eip155:1',
      domain: 'app.zerowallet.io',
      statement: 'Test sign-in',
    });

    expect(result.message).toContain('app.zerowallet.io wants you to sign in');
    expect(result.message).toContain('0xb9c5714089478a327f09197987f16f9e5d936e8a');
    expect(result.message).toContain('Chain ID: eip155:1');
    expect(result.message).toContain('Nonce:');
    expect(result.message).toContain('Version: 1');
    expect(result.message).toContain('URI:');
    expect(result.message).toContain('Issued At:');
    expect(result.message).toContain('Test sign-in');
  });

  it('includes resources when provided', () => {
    const result = createChallenge({
      address: '0x...',
      chain: 'eip155:1',
      resources: ['https://example.com/tos'],
    });

    expect(result.message).toContain('Resources:');
    expect(result.message).toContain('https://example.com/tos');
  });

  it('uses correct chain name for non-EVM chains', () => {
    const result = createChallenge({
      address: 'solana-address',
      chain: 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
    });

    expect(result.message).toContain('Solana');
  });
});

describe('EIP-191 signature verification', () => {
  it('generates correct EIP-191 hash prefix', async () => {
    const { eip191Hash } = await import('../src/crypto/secp256k1');
    const hash = eip191Hash('test message');
    expect(hash).toBeInstanceOf(Uint8Array);
    expect(hash.length).toBe(32); // keccak256 output
  });

  it('rejects invalid signature format', () => {
    const result = verifyEip191(
      'test message',
      '0x1234', // too short
      '0xb9c5714089478a327f09197987f16f9e5d936e8a',
    );
    expect(result).toBe(false);
  });

  it('rejects mismatched address', () => {
    const result = verifyEip191(
      'test message',
      '0x' + 'ab'.repeat(32) + 'cd'.repeat(32) + '1c', // valid length but random sig
      '0xb9c5714089478a327f09197987f16f9e5d936e8a',
    );
    expect(result).toBe(false);
  });
});

describe('Ed25519 signature verification', () => {
  it('rejects invalid signature', () => {
    const result = verifyEd25519(
      'test message',
      '0x' + '01'.repeat(64),
      '0x' + '02'.repeat(32),
    );
    expect(result).toBe(false);
  });
});
