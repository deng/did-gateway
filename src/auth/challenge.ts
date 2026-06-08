// ---------------------------------------------------------------------------
// CAIP-122 (SIWx) / EIP-4361 (SIWE) challenge generation
// ---------------------------------------------------------------------------

import type { ChallengeData, ChallengeRequest } from '../types';

const NONCE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const NONCE_LENGTH = 16;

/**
 * Generate a cryptographically-random nonce.
 */
function generateNonce(): string {
  const arr = new Uint8Array(NONCE_LENGTH);
  crypto.getRandomValues(arr);
  let nonce = '';
  for (const b of arr) {
    nonce += NONCE_CHARS[b % NONCE_CHARS.length];
  }
  return nonce;
}

/**
 * Build the chain-specific human name for the "wants you to sign in" line.
 */
function chainDisplayName(chain: string): string {
  if (chain.startsWith('eip155')) return 'Ethereum';
  if (chain.startsWith('solana')) return 'Solana';
  if (chain.startsWith('bip122')) return 'Bitcoin';
  if (chain.startsWith('tron')) return 'TRON';
  if (chain.startsWith('aptos')) return 'Aptos';
  if (chain.startsWith('sui')) return 'Sui';
  return 'blockchain';
}

/**
 * Build a CAIP-122 / EIP-4361 compliant sign-in message.
 *
 * The message follows EIP-4361 ABNF grammar and is chain-agnostic per CAIP-122.
 */
function buildSignInMessage(req: ChallengeRequest, nonce: string, now: Date): string {
  const domain = req.domain ?? 'zerowallet.io';
  const chainName = chainDisplayName(req.chain);
  const uri = req.uri ?? `https://${domain}/login`;
  const issuedAt = now.toISOString();
  const expirationTime = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

  const lines: string[] = [];

  // Domain line
  lines.push(`${domain} wants you to sign in with your ${chainName} account:`);
  lines.push(req.address);
  lines.push('');

  // Statement
  if (req.statement) {
    lines.push(req.statement);
    lines.push('');
  }

  // Required fields
  lines.push(`URI: ${uri}`);
  lines.push('Version: 1');
  lines.push(`Chain ID: ${req.chain}`);
  lines.push(`Nonce: ${nonce}`);
  lines.push(`Issued At: ${issuedAt}`);
  lines.push(`Expiration Time: ${expirationTime}`);

  // Resources
  if (req.resources && req.resources.length > 0) {
    lines.push('Resources:');
    for (const r of req.resources) {
      lines.push(`- ${r}`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate an authentication challenge.
 * Returns the nonce, the full message to sign, and expiry.
 */
export function createChallenge(req: ChallengeRequest): ChallengeData {
  const now = new Date();
  const nonce = generateNonce();
  const message = buildSignInMessage(req, nonce, now);
  const expiresAt = now.getTime() + 5 * 60 * 1000; // 5 minutes

  return { nonce, message, expiresAt };
}
