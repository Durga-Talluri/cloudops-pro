#!/bin/bash
set -e

echo " Setting up CloudOps Pro development environment..."

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_command "node"
check_command "npm"
check_command "python3"
check_command "pip"
check_command "docker"
check_command "docker-compose"

# Create .env files if they don't exist
echo "📝 Setting up environment files..."
for file in frontend/.env backend/.env mobile/.env; do
    if [ ! -f "$file" ]; then
        cp "$file.example" "$file"
        echo "✅ Created $file"
    fi
done

# Install dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && pip install -r requirements.txt && cd ..

# # Install mobile dependencies (uncomment if needed)
# echo "📦 Installing mobile dependencies..."
# cd mobile && npm install && cd ..

echo "🐳 Starting Docker services..."
docker-compose -f docker/docker-compose.yml up -d postgres redis

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🎉 Development environment setup completed!"