// ---------------------------------------------------------------------------
// Shared types for DID Gateway
// ---------------------------------------------------------------------------

// --- DID Document (W3C DID Core v1.0) ---

export interface DIDDocument {
  '@context': string | Record<string, unknown> | (string | Record<string, unknown>)[];
  id: string;
  controller?: string | string[];
  alsoKnownAs?: string[];
  verificationMethod?: VerificationMethod[];
  authentication?: (string | VerificationMethod)[];
  assertionMethod?: (string | VerificationMethod)[];
  keyAgreement?: (string | VerificationMethod)[];
  service?: ServiceEndpoint[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase?: string;
  blockchainAccountId?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string | string[];
}

// --- DID Resolution ---

export interface ResolverResult {
  didDocument: DIDDocument;
  /** CAIP-10 address extracted from the DID */
  caip10: string;
  /** Chain CAIP-2 identifier extracted from the DID */
  chain: string;
  /** Raw blockchain address */
  address: string;
}

// --- Auth ---

export interface ChallengeRequest {
  address: string;
  chain: string;
  domain?: string;
  uri?: string;
  statement?: string;
  resources?: string[];
}

export interface ChallengeData {
  nonce: string;
  message: string;
  expiresAt: number;
}

export interface VerifyRequest {
  nonce: string;
  signature: string;
  did: string;
  chain: string;
}

export interface AuthData {
  token: string;
  did: string;
  expiresAt: number;
}

// --- Auth Context (injected by middleware) ---

export interface AuthContext {
  did: string;
  address: string;
  chain: string;
  caip10: string;
  jti: string;
}

// --- Env ---

export interface Env {
  DID_CACHE: KVNamespace;
  DID_DB: D1Database;
  DID_CACHE_TTL?: string;
  CHALLENGE_TTL?: string;
  SESSION_TTL?: string;
  JWT_SECRET: string;
  JWT_ISSUER?: string;
  ETHR_RPC_URLS?: string;
}

// --- API Response wrappers ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// --- D1 Row types ---

export interface DidRegistryRow {
  id: number;
  did: string;
  controller: string;
  method: string;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface AuthChallengeRow {
  id: number;
  nonce: string;
  address: string;
  chain: string;
  did: string | null;
  domain: string | null;
  message: string;
  expires_at: number;
  is_used: number;
  ip: string | null;
  created_at: number;
}

export interface AuthSessionRow {
  id: number;
  jti: string;
  did: string;
  address: string;
  chain: string;
  caip10: string;
  issued_at: number;
  expires_at: number;
  revoked: number;
  last_used: number | null;
}
