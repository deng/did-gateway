// ---------------------------------------------------------------------------
// KV-backed cache helper
// Provides consistent get/set/delete wrapping a KV namespace.
// ---------------------------------------------------------------------------

const DEFAULT_TTL = 300; // 5 minutes

export function createCache(kv: KVNamespace, defaultTtl = DEFAULT_TTL) {
  return {
    async get<T>(key: string): Promise<T | null> {
      return kv.get(key, 'json') as Promise<T | null>;
    },

    async set(key: string, value: unknown, ttl?: number): Promise<void> {
      await kv.put(key, JSON.stringify(value), {
        expirationTtl: ttl ?? defaultTtl,
      });
    },

    async setPermanent(key: string, value: unknown): Promise<void> {
      await kv.put(key, JSON.stringify(value));
    },

    async delete(key: string): Promise<void> {
      await kv.delete(key);
    },

    kv,
  };
}

export type Cache = ReturnType<typeof createCache>;

// --- Key helpers ---

export function didCacheKey(did: string): string {
  return `did:${did}`;
}

export function addrCacheKey(caip10: string): string {
  return `addr:${caip10}`;
}

export function sessionCacheKey(jti: string): string {
  return `session:${jti}`;
}

export function challengeCacheKey(nonce: string): string {
  return `challenge:${nonce}`;
}
