#!/bin/bash

# Deploy Frontend to Vercel
# This script builds and deploys the React frontend to Vercel

set -e

echo "🚀 Starting frontend deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')

echo "✅ Frontend deployed successfully!"
echo "🌐 Deployment URL: https://$DEPLOYMENT_URL"

# Set environment variables in Vercel
echo "🔧 Setting environment variables..."
vercel env add REACT_APP_API_URL production <<< "https://your-backend-domain.com/api/v1"

echo "🎉 Frontend deployment completed!"