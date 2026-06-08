-- DID Gateway — 001_init.sql
-- Cloudflare D1 database: did-db

CREATE TABLE IF NOT EXISTS did_registry (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL UNIQUE,
  controller  TEXT NOT NULL,       -- CAIP-10
  method      TEXT NOT NULL,       -- pkh / key / zw
  status      TEXT DEFAULT 'active',  -- active / deactivated / revoked
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_did_registry_controller ON did_registry(controller);

CREATE TABLE IF NOT EXISTS did_document_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL,
  version     INTEGER NOT NULL,
  document    TEXT NOT NULL,
  updated_by  TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_did_doc_history_did ON did_document_history(did);

CREATE TABLE IF NOT EXISTS did_addresses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL,
  caip10      TEXT NOT NULL,
  chain       TEXT NOT NULL,
  address     TEXT NOT NULL,
  label       TEXT,
  created_at  INTEGER NOT NULL,
  UNIQUE(did, caip10)
);
CREATE INDEX IF NOT EXISTS idx_did_addresses_did ON did_addresses(did);
CREATE INDEX IF NOT EXISTS idx_did_addresses_caip10 ON did_addresses(caip10);

CREATE TABLE IF NOT EXISTS auth_challenges (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nonce       TEXT NOT NULL UNIQUE,
  address     TEXT NOT NULL,
  chain       TEXT NOT NULL,
  did         TEXT,
  domain      TEXT,
  message     TEXT NOT NULL,       -- CAIP-122 / EIP-4361 消息原文
  expires_at  INTEGER NOT NULL,
  is_used     INTEGER DEFAULT 0,
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_challenges_nonce ON auth_challenges(nonce);
CREATE INDEX IF NOT EXISTS idx_auth_challenges_address ON auth_challenges(address);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  jti         TEXT NOT NULL UNIQUE,     -- JWT ID
  did         TEXT NOT NULL,
  address     TEXT NOT NULL,
  chain       TEXT NOT NULL,
  caip10      TEXT NOT NULL,
  issued_at   INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,
  revoked     INTEGER DEFAULT 0,
  last_used   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_jti ON auth_sessions(jti);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_did ON auth_sessions(did);

CREATE TABLE IF NOT EXISTS did_operations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT,
  op_type     TEXT NOT NULL,     -- create / update / deactivate / verify_success / verify_fail / resolve
  detail      TEXT,
  requester   TEXT,
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_did_operations_did ON did_operations(did);
CREATE INDEX IF NOT EXISTS idx_did_operations_type ON did_operations(op_type);
