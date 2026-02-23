#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  npm --prefix "$ROOT_DIR/frontend" install
fi

cd "$ROOT_DIR/frontend" && exec npm run dev
