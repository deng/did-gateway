#!/bin/bash
# Generate Flutter SDK from live OpenAPI spec
# Usage: ./scripts/generate-flutter-sdk.sh [spec_url]

SPEC_URL="${1:-https://did.bithub.pro/openapi.json}"
OUTPUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/did-gateway-flutter"

openapi-generator generate \
  -i "$SPEC_URL" \
  -g dart \
  -o "$OUTPUT_DIR" \
  --additional-properties=pubName=did_gateway,pubVersion=0.1.0,pubDescription="ZeroWallet DID Authentication Gateway API client for Flutter",useJsonKey=true,sortParamsByRequiredFlag=true
