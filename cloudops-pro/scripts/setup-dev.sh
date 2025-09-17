#!/bin/bash

# Development Environment Setup Script
# This script sets up the development environment for CloudOps Pro

set -e

echo "🚀 Setting up CloudOps Pro development environment..."

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

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
EOF
    echo "✅ Created frontend/.env"
fi

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
DATABASE_URL=postgresql://cloudops_user:cloudops_password@localhost:5432/cloudops_pro
REDIS_URL=redis://localhost:6379
SECRET_KEY=dev-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
EOF
    echo "✅ Created backend/.env"
fi

# Mobile .env
if [ ! -f "mobile/.env" ]; then
    cat > mobile/.env << EOF
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
EOF
    echo "✅ Created mobile/.env"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install mobile dependencies
echo "📦 Installing mobile dependencies..."
cd mobile
npm install
cd ..

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose -f docker/docker-compose.yml up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations (if any)
echo "🗄️ Setting up database..."
cd backend
# Add migration commands here when you have them
# alembic upgrade head
cd ..

# Create development scripts
echo "📝 Creating development scripts..."

# Start all services script
cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting CloudOps Pro development environment..."

# Start Docker services
docker-compose -f docker/docker-compose.yml up -d

# Start backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

# Start mobile (optional)
# cd ../mobile
# npm start &
# MOBILE_PID=$!

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"

# Wait for user to stop
echo "Press Ctrl+C to stop all services"
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start-dev.sh

# Stop all services script
cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping CloudOps Pro development environment..."

# Stop Docker services
docker-compose -f docker/docker-compose.yml down

# Kill any running processes
pkill -f "uvicorn app.main:app"
pkill -f "npm start"

echo "✅ All services stopped!"
EOF

chmod +x stop-dev.sh

# Test script
cat > test-all.sh << 'EOF'
#!/bin/bash
echo "🧪 Running all tests..."

# Test backend
echo "Testing backend..."
cd backend
pytest tests/ -v
cd ..

# Test frontend
echo "Testing frontend..."
cd frontend
npm test -- --watchAll=false
cd ..

# Test mobile
echo "Testing mobile..."
cd mobile
npm test
cd ..

echo "✅ All tests completed!"
EOF

chmod +x test-all.sh

echo "🎉 Development environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env files with your actual API keys"
echo "2. Run './start-dev.sh' to start all services"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:8000/docs for the API documentation"
echo ""
echo "🛠️ Available scripts:"
echo "- ./start-dev.sh - Start all development services"
echo "- ./stop-dev.sh - Stop all development services"
echo "- ./test-all.sh - Run all tests"
echo ""
echo "Happy coding! 🚀"