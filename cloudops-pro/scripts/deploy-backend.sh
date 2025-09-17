#!/bin/bash

# Deploy Backend to Render/Railway
# This script builds and deploys the FastAPI backend

set -e

echo "🚀 Starting backend deployment..."

# Check if required environment variables are set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY environment variable is not set"
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run tests
echo "🧪 Running tests..."
pytest tests/ -v

# Build Docker image (if deploying to Docker-based platform)
if [ "$DEPLOYMENT_PLATFORM" = "docker" ]; then
    echo "🐳 Building Docker image..."
    docker build -t cloudops-pro-backend .
    
    # Tag for registry
    docker tag cloudops-pro-backend $DOCKER_REGISTRY/cloudops-pro-backend:latest
    
    # Push to registry
    echo "📤 Pushing to registry..."
    docker push $DOCKER_REGISTRY/cloudops-pro-backend:latest
fi

# Deploy to Render (if using Render)
if [ "$DEPLOYMENT_PLATFORM" = "render" ]; then
    echo "🚀 Deploying to Render..."
    
    # Create render.yaml if it doesn't exist
    if [ ! -f "render.yaml" ]; then
        cat > render.yaml << EOF
services:
  - type: web
    name: cloudops-pro-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port \$PORT
    envVars:
      - key: OPENAI_API_KEY
        value: \$OPENAI_API_KEY
      - key: DATABASE_URL
        value: \$DATABASE_URL
      - key: REDIS_URL
        value: \$REDIS_URL
      - key: SECRET_KEY
        value: \$SECRET_KEY
EOF
    fi
    
    # Deploy using Render CLI (if available)
    if command -v render &> /dev/null; then
        render deploy
    else
        echo "📝 Please deploy manually using the Render dashboard"
        echo "📄 Configuration saved to render.yaml"
    fi
fi

# Deploy to Railway (if using Railway)
if [ "$DEPLOYMENT_PLATFORM" = "railway" ]; then
    echo "🚀 Deploying to Railway..."
    
    # Install Railway CLI if not available
    if ! command -v railway &> /dev/null; then
        echo "📦 Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login and deploy
    railway login
    railway up
fi

echo "✅ Backend deployment completed!"
echo "🌐 Backend API should be available at your deployment URL"