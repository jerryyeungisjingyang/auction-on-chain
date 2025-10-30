#!/usr/bin/env bash
set -euo pipefail

echo "==> Auction dApp local setup"

if ! command -v node >/dev/null 2>&1; then
  echo "[Error] Node.js is required. Please install Node 18+." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[Error] npm is required." >&2
  exit 1
fi

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$ROOT_DIR"

echo "==> Installing dependencies"
npm install

CONTRACT_FILE="src/lib/contract.ts"
PLACEHOLDER="0x0000000000000000000000000000000000000001"
echo "==> Skipping contract address setup (current: $PLACEHOLDER)"
echo "    You can manually edit AUCTION_CONTRACT_ADDRESS in $CONTRACT_FILE later."

echo "==> Building static export (API temporarily disabled)"
npm run build:static

echo "\nAll set!"
echo "- Contract address set in: $CONTRACT_FILE"
echo "- Dev: npm run dev"
echo "- Static export ready in: out/ (use npm run build:static next time)"

