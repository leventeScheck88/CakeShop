#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start PostgreSQL
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

# Wait for DB
until docker exec cakestore-db pg_isready -U cakestore -q 2>/dev/null; do
  sleep 1
done

if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
  npm --prefix "$ROOT_DIR/backend" install
fi

# Seed if empty
PRODUCT_COUNT=$(docker exec cakestore-db psql -U cakestore -d cakestore -tAc "SELECT count(*) FROM products" 2>/dev/null || echo "0")
if [ "$PRODUCT_COUNT" = "0" ] || [ "$PRODUCT_COUNT" = "" ]; then
  cd "$ROOT_DIR/backend" && npm run seed
  cd "$ROOT_DIR"
fi

# Free port 3000 if in use
if lsof -ti:3000 >/dev/null 2>&1; then
  kill -9 $(lsof -ti:3000) 2>/dev/null || true
  sleep 1
fi

cd "$ROOT_DIR/backend" && exec npm run start:dev
