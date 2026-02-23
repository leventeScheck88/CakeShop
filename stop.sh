#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[CakeStore]${NC} $1"; }
warn() { echo -e "${YELLOW}[CakeStore]${NC} $1"; }

# Stop frontend and backend dev processes
log "Stopping backend and frontend..."
pkill -f "npm run start:dev" 2>/dev/null && log "Backend stopped." || warn "Backend was not running."
pkill -f "npm run dev" 2>/dev/null && log "Frontend stopped." || warn "Frontend was not running."

# Stop PostgreSQL
log "Stopping PostgreSQL..."
docker compose -f "$ROOT_DIR/docker-compose.yml" down
log "Done."
