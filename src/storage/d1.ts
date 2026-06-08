// ---------------------------------------------------------------------------
// D1 helper — typed queries for did-db
// ---------------------------------------------------------------------------

import type {
  AuthChallengeRow,
  AuthSessionRow,
  DidRegistryRow,
} from '../types';

export function createDb(db: D1Database) {
  return {
    // --- auth_challenges ---

    async insertChallenge(challenge: Omit<AuthChallengeRow, 'id'>): Promise<void> {
      await db.prepare(
        `INSERT INTO auth_challenges (nonce, address, chain, did, domain, message, expires_at, is_used, ip, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          challenge.nonce, challenge.address, challenge.chain,
          challenge.did, challenge.domain, challenge.message,
          challenge.expires_at, challenge.is_used, challenge.ip,
          challenge.created_at,
        )
        .run();
    },

    async getChallenge(nonce: string): Promise<AuthChallengeRow | null> {
      return db.prepare(
        'SELECT * FROM auth_challenges WHERE nonce = ?',
      ).bind(nonce).first() as Promise<AuthChallengeRow | null>;
    },

    async markChallengeUsed(nonce: string): Promise<void> {
      await db.prepare(
        "UPDATE auth_challenges SET is_used = 1 WHERE nonce = ?",
      ).bind(nonce).run();
    },

    // --- auth_sessions ---

    async insertSession(session: Omit<AuthSessionRow, 'id'>): Promise<void> {
      await db.prepare(
        `INSERT INTO auth_sessions (jti, did, address, chain, caip10, issued_at, expires_at, revoked, last_used)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          session.jti, session.did, session.address,
          session.chain, session.caip10,
          session.issued_at, session.expires_at,
          session.revoked, session.last_used,
        )
        .run();
    },

    async getSessionByJti(jti: string): Promise<AuthSessionRow | null> {
      return db.prepare(
        'SELECT * FROM auth_sessions WHERE jti = ?',
      ).bind(jti).first() as Promise<AuthSessionRow | null>;
    },

    async revokeSession(jti: string): Promise<void> {
      await db.prepare(
        'UPDATE auth_sessions SET revoked = 1 WHERE jti = ?',
      ).bind(jti).run();
    },

    async updateSessionLastUsed(jti: string): Promise<void> {
      await db.prepare(
        'UPDATE auth_sessions SET last_used = ? WHERE jti = ?',
      ).bind(Date.now(), jti).run();
    },

    // --- did_registry ---

    async insertRegistry(entry: Omit<DidRegistryRow, 'id'>): Promise<void> {
      await db.prepare(
        `INSERT INTO did_registry (did, controller, method, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
        .bind(entry.did, entry.controller, entry.method, entry.status, entry.created_at, entry.updated_at)
        .run();
    },

    async getRegistryByDid(did: string): Promise<DidRegistryRow | null> {
      return db.prepare(
        'SELECT * FROM did_registry WHERE did = ?',
      ).bind(did).first() as Promise<DidRegistryRow | null>;
    },

    async getRegistryByController(controller: string): Promise<DidRegistryRow[]> {
      const result = await db.prepare(
        'SELECT * FROM did_registry WHERE controller = ? ORDER BY created_at DESC',
      ).bind(controller).all<DidRegistryRow>();
      return result.results;
    },

    async updateRegistryStatus(did: string, status: string): Promise<void> {
      await db.prepare(
        'UPDATE did_registry SET status = ?, updated_at = ? WHERE did = ?',
      ).bind(status, Date.now(), did).run();
    },

    // --- did_operations ---

    async logOperation(op: {
      did?: string;
      opType: string;
      detail?: string;
      requester?: string;
      ip?: string;
    }): Promise<void> {
      await db.prepare(
        `INSERT INTO did_operations (did, op_type, detail, requester, ip, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
        .bind(op.did ?? null, op.opType, op.detail ?? null, op.requester ?? null, op.ip ?? null, Date.now())
        .run();
    },

    db,
  };
}

export type Db = ReturnType<typeof createDb>;
