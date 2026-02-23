#!/usr/bin/env bash
pkill -f "vite" 2>/dev/null && echo "Frontend stopped." || echo "Frontend was not running."
