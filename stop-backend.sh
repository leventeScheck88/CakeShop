#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

pkill -f "npm run start:dev" 2>/dev/null && echo "Backend stopped." || echo "Backend was not running."
docker compose -f "$ROOT_DIR/docker-compose.yml" down
echo "Done."
