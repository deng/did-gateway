// ---------------------------------------------------------------------------
// OpenAPI 3.0.3 spec for DID Gateway
// ---------------------------------------------------------------------------

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'DID Gateway',
    description: `DID Authentication Gateway — compliant with W3C DID Core v1.0, CAIP-122 (SIWx), EIP-4361 (SIWE), and RFC 7519 (JWT).

Provides DID resolution (did:pkh, did:key), cryptographic challenge generation, EIP-191/Ed25519 signature verification, and JWT session management for ZeroWallet.`,
    version: '0.1.0',
  },
  servers: [
    { url: 'https://did.bithub.pro', description: 'Production' },
    { url: 'http://localhost:8787', description: 'Local dev' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } },
          },
        },
      },
    },
    '/api/v1/methods': {
      get: {
        summary: 'List supported DID methods',
        tags: ['DID'],
        responses: {
          '200': {
            description: 'Supported DID methods',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MethodsResponse' } } },
          },
        },
      },
    },
    '/api/v1/auth/challenge': {
      post: {
        summary: 'Generate authentication challenge (CAIP-122 / EIP-4361)',
        description: 'Generates a nonce and a structured sign-in message. The client signs this message with their blockchain private key.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChallengeRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Challenge generated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChallengeResponse' } } },
          },
          '400': { description: 'Invalid request' },
        },
      },
    },
    '/api/v1/auth/verify': {
      post: {
        summary: 'Verify signature and issue JWT',
        description: `Validates the nonce, resolves the DID to get the verification method, verifies the cryptographic signature (EIP-191 for EVM, Ed25519 for Solana), and issues a JWT session token.`,
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Verification successful, JWT issued',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyResponse' } } },
          },
          '400': { description: 'Invalid request or DID resolution failure' },
          '401': { description: 'Invalid signature, expired or replayed nonce' },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        summary: 'Refresh JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token refreshed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyResponse' } } },
          },
          '401': { description: 'Invalid or expired token' },
        },
      },
    },
    '/api/v1/auth/revoke': {
      post: {
        summary: 'Revoke JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Token revoked' },
          '401': { description: 'Invalid token' },
        },
      },
    },
    '/api/v1/resolve/{did}': {
      get: {
        summary: 'Resolve DID to DID Document',
        description: 'Resolves a DID (e.g. did:pkh:eip155:1:0x...) to its W3C DID Document.',
        tags: ['DID'],
        parameters: [
          { name: 'did', in: 'path', required: true, schema: { type: 'string' }, example: 'did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a' },
        ],
        responses: {
          '200': {
            description: 'DID Document',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ResolveResponse' } } },
          },
          '400': { description: 'Invalid or unsupported DID' },
        },
      },
    },
    '/api/v1/resolve': {
      post: {
        summary: 'Batch resolve DIDs',
        tags: ['DID'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['dids'],
                properties: {
                  dids: { type: 'array', items: { type: 'string' }, example: ['did:pkh:eip155:1:0x...', 'did:key:z6Mk...'] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Batch resolve results',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { type: 'object' } } } } } },
          },
        },
      },
    },
    '/api/v1/resolve-by-address/{caip10}': {
      get: {
        summary: 'Resolve CAIP-10 address to did:pkh',
        description: 'Convenience endpoint: converts a CAIP-10 address to a did:pkh DID Document.',
        tags: ['DID'],
        parameters: [
          { name: 'caip10', in: 'path', required: true, schema: { type: 'string' }, example: 'eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a' },
        ],
        responses: {
          '200': { description: 'DID Document' },
          '400': { description: 'Invalid address' },
        },
      },
    },
    '/api/v1/dids': {
      post: {
        summary: 'Register a new DID',
        description: 'Requires a valid JWT (Authorization: Bearer). The authenticated user becomes the DID controller.',
        tags: ['Management'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['did'],
                properties: { did: { type: 'string', example: 'did:zw:0x...' } },
              },
            },
          },
        },
        responses: {
          '201': { description: 'DID registered' },
          '401': { description: 'Unauthorized' },
          '409': { description: 'DID already exists' },
        },
      },
      get: {
        summary: 'List DIDs by controller',
        tags: ['Management'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'controller', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'DID list' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/dids/{did}': {
      delete: {
        summary: 'Deactivate a DID',
        tags: ['Management'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'did', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'DID deactivated' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden (not controller)' },
          '404': { description: 'DID not found' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string', example: '0.1.0' },
        },
      },
      ChallengeRequest: {
        type: 'object',
        required: ['address', 'chain'],
        properties: {
          address: { type: 'string', example: '0xb9c5714089478a327f09197987f16f9e5d936e8a' },
          chain: { type: 'string', example: 'eip155:1' },
          domain: { type: 'string', example: 'app.zerowallet.io' },
          uri: { type: 'string', example: 'https://app.zerowallet.io/login' },
          statement: { type: 'string', example: 'Sign in to ZeroWallet' },
          resources: { type: 'array', items: { type: 'string' } },
        },
      },
      ChallengeResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              nonce: { type: 'string', example: 'a1b2c3d4e5f6g7h8' },
              message: { type: 'string', example: 'app.zerowallet.io wants you to sign in...' },
              expiresAt: { type: 'integer', example: 1717833900000 },
            },
          },
        },
      },
      VerifyRequest: {
        type: 'object',
        required: ['nonce', 'signature', 'did', 'chain'],
        properties: {
          nonce: { type: 'string', example: 'a1b2c3d4e5f6g7h8' },
          signature: { type: 'string', example: '0x...' },
          did: { type: 'string', example: 'did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a' },
          chain: { type: 'string', example: 'eip155:1' },
        },
      },
      VerifyResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              did: { type: 'string', example: 'did:pkh:eip155:1:0x...' },
              expiresAt: { type: 'integer', example: 1717920000000 },
            },
          },
        },
      },
      TokenRequest: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        },
      },
      MethodsResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'pkh' },
                description: { type: 'string' },
              },
            },
          },
        },
      },
      ResolveResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              '@context': { type: 'object' },
              id: { type: 'string' },
              verificationMethod: { type: 'array', items: { type: 'object' } },
              authentication: { type: 'array', items: { type: 'string' } },
              assertionMethod: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  },
} as const;
