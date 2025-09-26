#!/bin/bash
set -e

echo "🛑 Stopping CloudOps Pro development environment..."

docker-compose -f docker/docker-compose.yml down

pkill -f "uvicorn app.main:app" || true
pkill -f "npm start" || true

echo "✅ All services stopped!"