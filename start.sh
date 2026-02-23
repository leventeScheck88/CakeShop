#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[CakeStore]${NC} $1"; }
warn() { echo -e "${YELLOW}[CakeStore]${NC} $1"; }

cleanup() {
  log "Stopping services..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  log "Done."
}
trap cleanup EXIT

# 1. Start PostgreSQL
log "Starting PostgreSQL..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

# Wait for DB to be ready
log "Waiting for database..."
until docker exec cakestore-db pg_isready -U cakestore -q 2>/dev/null; do
  sleep 1
done
log "Database is ready."

# 2. Install dependencies if needed
if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
  log "Installing backend dependencies..."
  npm --prefix "$ROOT_DIR/backend" install
fi

if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  log "Installing frontend dependencies..."
  npm --prefix "$ROOT_DIR/frontend" install
fi

# 3. Seed database (only if products table is empty)
PRODUCT_COUNT=$(docker exec cakestore-db psql -U cakestore -d cakestore -tAc "SELECT count(*) FROM products" 2>/dev/null || echo "0")
if [ "$PRODUCT_COUNT" = "0" ] || [ "$PRODUCT_COUNT" = "" ]; then
  warn "Database appears empty — running seed..."
  cd "$ROOT_DIR/backend" && npm run seed
  cd "$ROOT_DIR"
fi

# 4. Free port 3000 if in use, then start backend
if lsof -ti:3000 >/dev/null 2>&1; then
  warn "Port 3000 is in use — killing existing process..."
  kill -9 $(lsof -ti:3000) 2>/dev/null || true
  sleep 1
fi
log "Starting backend on http://localhost:3000..."
cd "$ROOT_DIR/backend" && npm run start:dev &
BACKEND_PID=$!

# 5. Start frontend
log "Starting frontend on http://localhost:5173..."
cd "$ROOT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

log "All services running. Press Ctrl+C to stop."
wait
