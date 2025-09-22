#!/bin/bash
set -e

echo "🧪 Running all tests..."

echo "Testing backend..."
cd backend
pytest tests/ -v
cd ..

echo "Testing frontend..."
cd frontend
npm test -- --watchAll=false
cd ..

# Test mobile (uncomment if needed)
# echo "Testing mobile..."
# cd mobile
# npm test
# cd ..

echo "✅ All tests completed!"