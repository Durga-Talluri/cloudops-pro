#!/bin/bash
set -e

echo "🚀 Starting CloudOps Pro development environment..."

# Start all Docker services
# This will build and run your backend, frontend, postgres, and redis containers
docker-compose -f docker/docker-compose.yml up -d --build

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"