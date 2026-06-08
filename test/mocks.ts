// ---------------------------------------------------------------------------
// Mock bindings for Vitest tests
// ---------------------------------------------------------------------------

import type { Env } from '../src/types';

/** In-memory KV mock */
export function createMockKV(): KVNamespace {
  const store = new Map<string, string>();
  return {
    get: async (key: string, type?: string) => {
      const val = store.get(key);
      if (val === undefined) return null;
      if (type === 'json') return JSON.parse(val);
      return val;
    },
    put: async (key: string, value: string, _opts?: { expirationTtl?: number }) => {
      store.set(key, value);
    },
    delete: async (key: string) => { store.delete(key); },
    list: async () => ({ keys: [] }),
    getWithMetadata: async () => ({ value: null, metadata: null }),
  } as unknown as KVNamespace;
}

/** In-memory D1 mock */
export function createMockD1(): D1Database {
  const store = new Map<string, unknown[]>();
  store.set('challenges', []);
  store.set('sessions', []);
  store.set('registry', []);

  return {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        run: async () => {
          // Very basic mock — stores data by table name
          if (sql.includes('auth_challenges') && sql.includes('INSERT')) {
            const rows = store.get('challenges') as Record<string, unknown>[];
            const row: Record<string, unknown> = { id: rows.length + 1 };
            // Extract values from INSERT
            rows.push(row);
            store.set('challenges', rows);
          }
          return { success: true, meta: { changes: 1, last_row_id: 0 } };
        },
        first: async <T>(): Promise<T | null> => {
          if (sql.includes('auth_challenges') && sql.includes('nonce = ?')) {
            const rows = store.get('challenges') as { nonce?: string; is_used?: number; expires_at?: number; message?: string; address?: string; chain?: string; domain?: string; did?: string; ip?: string; created_at?: number }[];
            return (rows.find((r) => r.nonce === args[0]) ?? null) as T | null;
          }
          return null;
        },
        all: async <T>(): Promise<{ results: T[] }> => {
          return { results: [] as T[] };
        },
      }),
    }),
  } as unknown as D1Database;
}

/** Default mock Env */
export function createMockEnv(overrides?: Partial<Env>): Env {
  return {
    DID_CACHE: createMockKV(),
    DID_DB: createMockD1(),
    DID_CACHE_TTL: '300',
    CHALLENGE_TTL: '300',
    SESSION_TTL: '86400',
    JWT_SECRET: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    JWT_ISSUER: 'did-gateway.test',
    ...overrides,
  };
}
