#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
APP_DIR="$ROOT_DIR/src/app"
API_DIR="$APP_DIR/api"
# 将备份目录移出 app/，避免被 Next 扫描
BACKUP_DIR="$ROOT_DIR/.api_dev_backup"

echo "==> Static export build (temporarily disabling API routes)"

if [ -d "$BACKUP_DIR" ]; then
  echo "[Error] Backup dir exists. Previous build may have failed. Clean and retry." >&2
  exit 1
fi

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$BACKUP_DIR"
  echo "- Moved src/app/api -> .api_dev_backup/ (repo root)"
fi

trap 'CODE=$?; if [ -d "$BACKUP_DIR" ]; then mv "$BACKUP_DIR" "$API_DIR"; echo "- Restored API routes"; fi; exit $CODE' EXIT

cd "$ROOT_DIR"
npm run build

echo "==> Build completed (out/ ready). Restoring API routes..."
mv "$BACKUP_DIR" "$API_DIR"
trap - EXIT
echo "Done."


