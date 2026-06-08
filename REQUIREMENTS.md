# DID Service — 需求分析 (标准驱动)

## 0. 涉及的标准一览

| 功能 | 标准 | 状态 |
|------|------|------|
| DID Document 格式 | **W3C DID Core v1.0** (REC) | 稳定，生产就绪 |
| DID 解析接口 | **W3C DID Resolution v0.3** (WD) | 工作草案，接口稳定 |
| `did:pkh` 方法 | **CAIP-10 + did:pkh method draft** | 社区标准，广泛采用 |
| `did:key` 方法 | **W3C CCG did:key draft** | 社区草案，实现稳定 |
| 挑战消息格式 | **EIP-4361 (SIWE)** — EVM 链 | Final，ERC 状态 |
| 跨链挑战格式 | **CAIP-122 (SIWx)** — 通用 | 链无关抽象层 |
| EVM 验签 | **EIP-191** (personal_sign) + **EIP-1271** (合约) | Final |
| Solana 验签 | **Ed25519** 标准验签 | 原生 |
| 登录态 Token | **RFC 7519 JWT** + **RFC 7515 JWS** | IETF 标准 |
| Token 安全 | **RFC 8725bis** (JWT BCP 2025) | 草案，最佳实践 |

---

## 1. 项目背景

DID (Decentralized Identifier) 是 W3C 标准化的去中心化身份标识，格式为 `did:method:identifier`。
对于 ZeroWallet 这种多链钱包，DID 可以将"钱包地址"升级为"链上身份"。

### 核心认证链路

本服务的四大功能遵循 **SIWx (Sign-In With X)** 标准流程：

```
┌─────────┐                    ┌──────────────┐
│  Wallet  │                    │  DID Service  │
│  (Client)│                    │  (Gateway)    │
└────┬─────┘                    └──────┬───────┘
     │                                 │
     │  ① 请求挑战 (CAIP-122)         │
     │  POST /auth/challenge           │
     │  { address, chain }            │
     │──────────────────────────────►  │
     │  ← { nonce, message,           │
     │      expiresAt }               │
     │                                 │
     │  ② 钱包弹窗签名                │
     │  (EIP-191 / Ed25519)           │
     │                                 │
     │  ③ 提交验证                    │
     │  POST /auth/verify              │
     │  { nonce, signature, did,      │
     │    chain }                      │
     │──────────────────────────────►  │
     │    │ DID 解析 (did:pkh/key)     │
     │    │ → DID Document             │
     │    │ → 提取 verificationMethod  │
     │    │ → 按 type 路由验签算法     │
     │    │ → EIP-191 / Ed25519 验签   │
     │    │ → 验证通过                 │
     │  ← { token (JWT), did,         │
     │      expiresAt }                │
     │                                 │
     │  ④ JWT 访问受保护资源           │
     │  Authorization: Bearer <jwt>    │
     │──────────────────────────────►  │
```

---

## 2. 标准方案详解

### 2.1 挑战消息格式 — CAIP-122 (SIWx) + EIP-4361 (SIWE)

**消息模板（EIP-4361 格式，EVM 链）：**
```
${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${uri}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}
Expiration Time: ${expirationTime}
Not Before: ${notBefore}
Request ID: ${requestId}
Resources:
- ${resources[0]}
- ${resources[1]}
```

**链无关版本（CAIP-122 格式，Solana 等）：**
```
${domain} wants you to sign in with your Solana account:
${address}

${statement}

URI: ${uri}
Version: 1
Nonce: ${nonce}
Issued At: ${issuedAt}
Chain ID: ${chainId}
Resources:
- ${resources[0]}
```

**必填字段：**
| 字段 | 标准来源 | 说明 |
|------|---------|------|
| `domain` | EIP-4361 §ABNF | 请求来源域名，防钓鱼 |
| `address` | EIP-4361 + CAIP-10 | 钱包地址 |
| `uri` | EIP-4361 | 声明主题 URI |
| `version` | EIP-4361 | 固定 `1` |
| `chain-id` | EIP-4361 / CAIP-122 | CAIP-2 链标识 |
| `nonce` | EIP-4361 | ≥8 位字母数字，防重放 |
| `issued-at` | EIP-4361 | RFC 3339 时间戳 |

**挑战存储（D1 `auth_challenges`）+ KV 缓存防重放**

### 2.2 DID 解析 — W3C DID Core v1.0

**支持的 DID Method：**

| Method | 规范 | 解析方式 | 实现 |
|--------|------|---------|------|
| `did:pkh` | CAIP-10 + did:pkh draft | 从 DID 字符串提取 CAIP-10 → 确定推导 DID Document | 纯本地，无网络调用 |
| `did:key` | W3C CCG did:key draft | 从 multicodec 编码解码公钥 → 构建 DID Document | 纯本地 |
| `did:zw` | 自定义 | 从 KV 读取 DID Document | KV 主存储 |

`did:pkh` DID Document 格式（规范）：注意这里 chain_id 在 @ 符号之后
```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    {
      "blockchainAccountId": "https://w3id.org/security#blockchainAccountId"
    }
  ],
  "id": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "verificationMethod": [{
    "id": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a#blockchainAccountId",
    "type": "EcdsaSecp256k1RecoveryMethod2020",
    "controller": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
    "blockchainAccountId": "0xb9c5714089478a327f09197987f16f9e5d936e8a@eip155:1"
  }],
  "authentication": ["did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a#blockchainAccountId"],
  "assertionMethod": ["did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a#blockchainAccountId"]
}
```

`did:key` 格式：
```
did:key:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH
                │                                                │
                └─────────── base58btc(multicodec(pubkey)) ──────┘
```

解码流程：
```
base58btc decode → multicodec varint prefix + raw pubkey bytes
                        ↓
             secp256k1 (0xe701) / Ed25519 (0xed01) / ...
```

### 2.3 密码学验签 — EIP-191 / EIP-1271 / Ed25519

**EVM 链 (EIP-191):**
```
待签名原文 = \x19Ethereum Signed Message:\n${len(message)}${message}
验签算法 = ecrecover(keccak256(待签名原文), signature) == address
```

**支持 EIP-1271 合约验签：**
- 适用于智能合约钱包（Gnosis Safe 等）
- 调用 `ISignatureValidator.isValidSignature(hash, signature)` 静态调用

**Solana (Ed25519):**
```
验签算法 = ed25519.verify(message, signature, publicKey)
```

**验签流程标准定义：**
```
① 从 DID Document 的 verificationMethod 提取 publicKeyMultibase / blockchainAccountId
② 根据 verificationMethod.type 确定验签算法：
   - "EcdsaSecp256k1RecoveryMethod2020" → EIP-191
   - "Ed25519VerificationKey2018"       → Ed25519
   - "Multikey"                          → 从 publicKeyMultibase 的 multicodec 前缀判断
③ 对 SIWx 标准消息按对应算法验签
④ 结果记录 D1(did_operations)
```

### 2.4 登录态颁发 — RFC 7519 JWT

**JWT Claims 设计：**
```json
{
  "sub": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "iss": "did-service.zerowallet.io",
  "aud": "zerowallet",
  "iat": 1717833600,
  "exp": 1717920000,
  "chain_id": "eip155:1",
  "address": "0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "caip10": "eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a"
}
```

**签名算法：** HS256 (HMAC-SHA256) 或 EdDSA

**安全措施（参照 RFC 8725bis）：**
- `sub` 必须是 DID，不能是可变标识
- `iat` 和 `exp` 必须校验
- 算法白名单（拒绝 `alg: none`）
- 支持 refresh 机制（旧 token 吊销 + 新 token 颁发）

**JWT 也存一份到 KV 做快速吊销检查：**
- `KV(session:{jti} → {revoked, expiresAt})`
- 白名单模式：每次请求查 KV 确认 token 未被吊销

---

## 3. 技术栈

| 层 | 技术 | 标准依据 |
|----|------|---------|
| 框架 | Hono (TS) | — |
| 运行时 | Cloudflare Workers | — |
| 热缓存 | **Cloudflare KV** | — |
| 持久化 | **Cloudflare D1** | — |
| 密码学 (EVM) | `@noble/curves` (secp256k1) + `@noble/hashes` (keccak256) | EIP-191 |
| 密码学 (Ed25519) | `@noble/curves` (ed25519) | Ed25519 RFC 8032 |
| JWT | `jose` (JWT + JWS) | RFC 7519 / RFC 7515 |
| DID 解析 | 自实现（精简，无外部依赖） | W3C DID Core v1.0 |
| OpenAPI | 内联 spec + Swagger UI | OpenAPI 3.0.3 |
| 测试 | Vitest + vi.spyOn mock | — |
| Flutter SDK | openapi-generator | — |

---

## 4. API 详细设计

### 4.1 认证 API

#### `POST /api/v1/auth/challenge` — 生成挑战码（CAIP-122 / EIP-4361）

```json
// Request
{
  "address": "0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "chain": "eip155:1",
  "domain": "app.zerowallet.io",
  "uri": "https://app.zerowallet.io/login",
  "statement": "登录 ZeroWallet DID 服务",
  "resources": ["did:zw:0x..."]
}

// Response 200
{
  "success": true,
  "data": {
    "nonce": "a1b2c3d4e5f6g7h8",
    "message": "app.zerowallet.io wants you to sign in with your Ethereum account:\n0xb9c5714089478a327f09197987f16f9e5d936e8a\n\n登录 ZeroWallet DID 服务\n\nURI: https://app.zerowallet.io/login\nVersion: 1\nChain ID: eip155:1\nNonce: a1b2c3d4e5f6g7h8\nIssued At: 2026-06-08T12:00:00Z\nExpiration Time: 2026-06-08T12:05:00Z",
    "expiresAt": 1717833900000
  }
}
```

#### `POST /api/v1/auth/verify` — 验签 + 颁发 JWT

```json
// Request
{
  "nonce": "a1b2c3d4e5f6g7h8",
  "signature": "0x...",
  "did": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "chain": "eip155:1"
}

// Response 200
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",  // JWT
    "did": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
    "expiresAt": 1717920000000
  }
}

// Response 401
{
  "success": false,
  "error": "Invalid signature"
}
```

#### `POST /api/v1/auth/refresh` — 刷新 JWT

```json
// Request
{ "token": "eyJ..." }
// Response 200
{ "success": true, "data": { "token": "eyJ...", "expiresAt": 1718006400000 } }
```

#### `POST /api/v1/auth/revoke` — 吊销 JWT

```json
// Request
{ "token": "eyJ..." }
// Response 200
{ "success": true }
```

### 4.2 DID 解析 API

| 方法 | 路径 | 描述 | 标准 |
|------|------|------|------|
| GET | `/api/v1/resolve/:did` | 解析 DID → DID Document | DID Core v1.0 |
| POST | `/api/v1/resolve` | 批量解析 | — |
| GET | `/api/v1/resolve-by-address/:caip10` | 地址反查 DID | — |

**resolve 响应示例：**
```json
// GET /api/v1/resolve/did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a
{
  "success": true,
  "data": {
    "@context": ["https://www.w3.org/ns/did/v1", { ... }],
    "id": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
    "verificationMethod": [{
      "id": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a#blockchainAccountId",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
      "controller": "did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a",
      "blockchainAccountId": "0xb9c5714089478a327f09197987f16f9e5d936e8a@eip155:1"
    }],
    "authentication": ["#blockchainAccountId"],
    "assertionMethod": ["#blockchainAccountId"]
  }
}
```

### 4.3 DID 管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/v1/dids` | 创建 DID（需 Auth） |
| PUT | `/api/v1/dids/:did` | 更新 DID Document（需 Auth） |
| DELETE | `/api/v1/dids/:did` | 停用 DID（需 Auth） |
| GET | `/api/v1/dids?controller=:caip10` | 按 controller 查询 |

### 4.4 系统 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/openapi.json` | OpenAPI 规范 |
| GET | `/docs` | Swagger UI |
| GET | `/api/v1/methods` | 列出支持的 DID 方法 |

---

## 5. 存储设计 — KV + D1

### 5.1 KV Namespace: `DID_CACHE`

| Key Pattern | Value | TTL | 用途 |
|------------|-------|-----|------|
| `did:{did}` | DID Document (JSON) | 300s | DID Document 缓存 |
| `addr:{caip10}` | `{did, updatedAt}` | 永久 | CAIP-10 → DID 快捷映射 |
| `session:{jti}` | `{revoked, expiresAt}` | token TTL | JWT 吊销检查（白名单） |
| `challenge:{nonce}` | `{address, chain}` | 300s | 挑战码快速去重 |

### 5.2 D1 Database: `did-db`

```sql
-- DID 注册记录
CREATE TABLE did_registry (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL UNIQUE,
  controller  TEXT NOT NULL,       -- CAIP-10
  method      TEXT NOT NULL,       -- pkh / key / zw
  status      TEXT DEFAULT 'active',  -- active / deactivated / revoked
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX idx_did_registry_controller ON did_registry(controller);

-- DID Document 历史版本
CREATE TABLE did_document_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL,
  version     INTEGER NOT NULL,
  document    TEXT NOT NULL,
  updated_by  TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_did_doc_history_did ON did_document_history(did);

-- DID 关联地址
CREATE TABLE did_addresses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT NOT NULL,
  caip10      TEXT NOT NULL,
  chain       TEXT NOT NULL,
  address     TEXT NOT NULL,
  label       TEXT,
  created_at  INTEGER NOT NULL,
  UNIQUE(did, caip10)
);
CREATE INDEX idx_did_addresses_caip10 ON did_addresses(caip10);

-- 认证挑战码
CREATE TABLE auth_challenges (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nonce       TEXT NOT NULL UNIQUE,
  address     TEXT NOT NULL,
  chain       TEXT NOT NULL,
  did         TEXT,
  domain      TEXT,
  message     TEXT NOT NULL,       -- 完整的 SIWx 消息原文
  expires_at  INTEGER NOT NULL,
  is_used     INTEGER DEFAULT 0,
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_auth_challenges_nonce ON auth_challenges(nonce);
CREATE INDEX idx_auth_challenges_address ON auth_challenges(address);

-- 登录会话
CREATE TABLE auth_sessions (
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
CREATE INDEX idx_auth_sessions_jti ON auth_sessions(jti);
CREATE INDEX idx_auth_sessions_did ON auth_sessions(did);

-- DID 操作审计日志
CREATE TABLE did_operations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  did         TEXT,
  op_type     TEXT NOT NULL,     -- create / update / deactivate / verify_success / verify_fail / resolve
  detail      TEXT,
  requester   TEXT,
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_did_operations_did ON did_operations(did);
```

---

## 6. 项目结构

```
gateway/did/
├── src/
│   ├── index.ts                  # Hono app + routes
│   ├── openapi.ts                # OpenAPI 3.0.3 spec
│   ├── types.ts                  # Shared types
│   ├── cache.ts                  # KV-backed cache
│   ├── auth/                     # DID Auth (标准实现)
│   │   ├── challenge.ts          # CAIP-122 挑战生成
│   │   ├── verify.ts             # EIP-191 / Ed25519 验签
│   │   ├── token.ts              # RFC 7519 JWT 颁发+管理
│   │   └── middleware.ts         # JWT Bearer 验证中间件
│   ├── resolvers/                # DID method resolvers
│   │   ├── registry.ts           # Resolver 注册+路由
│   │   ├── pkh.ts                # did:pkh (CAIP-10 → DID Doc)
│   │   ├── key.ts                # did:key (multicodec decode)
│   │   └── zw.ts                 # did:zw (KV 主存储)
│   ├── crypto/                   # 密码学
│   │   ├── secp256k1.ts          # EIP-191 验签 (ecrecover)
│   │   ├── eip1271.ts            # EIP-1271 合约验签
│   │   ├── ed25519.ts            # Ed25519 验签
│   │   └── index.ts              # 统一验证入口
│   ├── storage/
│   │   ├── kv.ts                 # KV helper
│   │   └── d1.ts                 # D1 helper
│   └── schemas/
│       └── migrations/
│           └── 001_init.sql
├── test/
│   ├── server.test.ts
│   ├── auth.challenge.test.ts
│   ├── auth.verify.test.ts
│   ├── auth.token.test.ts
│   ├── resolve.pkh.test.ts
│   ├── resolve.key.test.ts
│   └── mocks.ts
├── .env.example
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── wrangler.toml
└── did-gateway-flutter/
```

---

## 7. Env 类型

```typescript
interface Env {
  DID_CACHE: KVNamespace;
  DID_DB: D1Database;

  // Cache TTLs
  DID_CACHE_TTL?: string;          // Default 300

  // Auth config
  CHALLENGE_TTL?: string;          // Default 300 (5min)
  SESSION_TTL?: string;            // Default 86400 (24h)
  JWT_SECRET: string;              // HMAC-SHA256 key for JWT signing
  JWT_ISSUER: string;              // e.g. "did-service.zerowallet.io"

  // Chain RPC config (for EIP-1271)
  ETHR_RPC_URLS?: string;          // JSON: { "eip155:1": "https://..." }
}
```

---

## 8. 验签流程（完整标准版）

```
POST /api/v1/auth/verify
  │
  ├─ Step 1: 验证 nonce（防重放）
  │   ├─ KV(challenge:{nonce}) 检查是否已使用
  │   ├─ D1(auth_challenges) is_used=0 AND expires_at > now
  │   └─ 失败 → 401 "Invalid or expired nonce"
  │
  ├─ Step 2: 标记 nonce 已使用
  │   ├─ KV(challenge:{nonce}) delete
  │   └─ D1(auth_challenges) UPDATE is_used=1
  │
  ├─ Step 3: DID 解析
  │   ├─ resolve(did) → DID Document ← KV 缓存 / Resolver
  │   └─ 提取 verificationMethod[0] → { type, publicKeyMultibase/blockchainAccountId }
  │
  ├─ Step 4: 重建 SIWx 消息原文
  │   ├─ 从 D1(auth_challenges) 读取 message
  │   └─ 确保 message 与签名内容一致
  │
  ├─ Step 5: 算法路由 + 执行验签
  │   ├─ verificationMethod.type:
  │   │   "EcdsaSecp256k1RecoveryMethod2020"
  │   │     → EIP-191: ecrecover(keccak256("\x19Ethereum Signed Message:\n" + len(msg) + msg), sig) == address
  │   │   "Ed25519VerificationKey2018"
  │   │     → Ed25519: ed25519.verify(msg, sig, pubkey)
  │   │   "Multikey"
  │   │     → 从 publicKeyMultibase multicodec 前缀判断算法
  │   │   (EVM 合约钱包)
  │   │     → EIP-1271: 静态调用 contract.isValidSignature(hash, sig)
  │   └─ 结果写 D1(did_operations): op_type=verify_success|verify_fail
  │
  ├─ Step 6: 验签成功 → 颁发 JWT
  │   ├─ jti = uuid()
  │   ├─ JWT Payload:
  │   │   { sub: did, iss: JWT_ISSUER, aud: "zerowallet",
  │   │     iat: now, exp: now + SESSION_TTL,
  │   │     jti, chain_id, address, caip10 }
  │   ├─ KV(session:{jti}) → { revoked: false, expiresAt }
  │   ├─ D1(auth_sessions) INSERT
  │   └─ sign JWT with HS256(JWT_SECRET)
  │
  └─ Response 200: { token: "eyJ...", did, expiresAt }
```

---

## 9. 与 wallet-assets 的关键差异

| 方面 | wallet-assets | DID Service |
|------|-------------|-------------|
| 有无状态 | 纯代理，无持久存储 | **有状态** — KV + D1 |
| 业务复杂度 | 单一数据源 | **四合一**：Challenge + Resolve + Verify + Token |
| 密码学依赖 | 无 | secp256k1 (EIP-191) + ed25519 |
| 中间件 | 仅 CORS | **JWT Auth middleware** |
| 标准依赖 | 无 | W3C DID Core + CAIP-122 + EIP-191 + EIP-4361 + RFC 7519 |
| 数据模型 | AssetItem | DIDDoc + Challenge + Session + Operation |
