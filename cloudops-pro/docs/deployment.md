# CloudOps Pro Deployment Guide

## Overview

This guide covers deploying CloudOps Pro across different environments, from local development to production. The platform supports multiple deployment strategies including Docker, cloud platforms, and traditional server deployments.

## Prerequisites

### Required Tools

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Git
- Cloud provider accounts (AWS, GCP, Azure)
- OpenAI API key

### Required Accounts

- GitHub (for CI/CD)
- Vercel (for frontend deployment)
- Render/Railway (for backend deployment)
- Docker Hub (for container registry)

## Environment Setup

### 1. Local Development

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/cloudops-pro.git
cd cloudops-pro

# Run setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Start development environment
./start-dev.sh
```

#### Manual Setup

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend setup
cd frontend
npm install
npm start

# Mobile setup
cd mobile
npm install
npx expo start
```

### 2. Docker Development

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop services
docker-compose -f docker/docker-compose.yml down
```

## Production Deployment

### 1. Frontend Deployment (Vercel)

#### Automatic Deployment

```bash
# Deploy using script
./scripts/deploy-frontend.sh
```

#### Manual Deployment

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-domain.com/api/v1
```

#### Vercel Configuration

Create `vercel.json` in the frontend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. Backend Deployment (Render)

#### Automatic Deployment

```bash
# Deploy using script
./scripts/deploy-backend.sh
```

#### Manual Deployment

1. **Create Render Service:**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**

   ```
   Name: cloudops-pro-backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Set Environment Variables:**
   ```
   OPENAI_API_KEY=your-openai-api-key
   DATABASE_URL=postgresql://user:pass@host:port/db
   REDIS_URL=redis://host:port
   SECRET_KEY=your-secret-key
   ```

#### Render Configuration

Create `render.yaml` in the backend directory:

```yaml
services:
  - type: web
    name: cloudops-pro-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: OPENAI_API_KEY
        value: $OPENAI_API_KEY
      - key: DATABASE_URL
        value: $DATABASE_URL
      - key: REDIS_URL
        value: $REDIS_URL
      - key: SECRET_KEY
        value: $SECRET_KEY
```

### 3. Database Deployment

#### PostgreSQL (Render)

1. Create PostgreSQL service in Render
2. Note the connection string
3. Update backend environment variables

#### Redis (Redis Cloud)

1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a new database
3. Get connection details
4. Update backend environment variables

### 4. Mobile App Deployment

#### Expo Build Service

```bash
cd mobile

# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Submit to app stores
npx expo upload:android
npx expo upload:ios
```

#### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## CI/CD Pipeline

### GitHub Actions Setup

1. **Repository Secrets:**

   ```
   VERCEL_TOKEN=your-vercel-token
   VERCEL_ORG_ID=your-org-id
   VERCEL_PROJECT_ID=your-project-id
   OPENAI_API_KEY=your-openai-key
   DOCKER_USERNAME=your-docker-username
   DOCKER_PASSWORD=your-docker-password
   ```

2. **Workflow Triggers:**
   - Push to `main` branch → Deploy to production
   - Push to `develop` branch → Deploy to staging
   - Pull requests → Run tests and security scans

### Pipeline Stages

1. **Code Quality:**

   - Linting (ESLint, Flake8, Black)
   - Type checking (TypeScript, MyPy)
   - Security scanning (Trivy)

2. **Testing:**

   - Unit tests
   - Integration tests
   - End-to-end tests

3. **Building:**

   - Frontend build
   - Backend build
   - Docker image creation

4. **Deployment:**
   - Staging deployment
   - Production deployment
   - Database migrations

## Environment Configuration

### Development Environment

```env
# Frontend
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/cloudops_pro
REDIS_URL=redis://localhost:6379
SECRET_KEY=dev-secret-key
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Mobile
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
```

### Staging Environment

```env
# Frontend
REACT_APP_API_URL=https://staging-api.cloudopspro.com/api/v1
REACT_APP_ENVIRONMENT=staging

# Backend
DATABASE_URL=postgresql://user:pass@staging-db:5432/cloudops_pro
REDIS_URL=redis://staging-redis:6379
SECRET_KEY=staging-secret-key
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=https://staging.cloudopspro.com

# Mobile
EXPO_PUBLIC_API_URL=https://staging-api.cloudopspro.com/api/v1
EXPO_PUBLIC_ENVIRONMENT=staging
```

### Production Environment

```env
# Frontend
REACT_APP_API_URL=https://api.cloudopspro.com/api/v1
REACT_APP_ENVIRONMENT=production

# Backend
DATABASE_URL=postgresql://user:pass@prod-db:5432/cloudops_pro
REDIS_URL=redis://prod-redis:6379
SECRET_KEY=production-secret-key
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=https://cloudopspro.com,https://www.cloudopspro.com

# Mobile
EXPO_PUBLIC_API_URL=https://api.cloudopspro.com/api/v1
EXPO_PUBLIC_ENVIRONMENT=production
```

## Docker Deployment

### Production Docker Compose

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend/Dockerfile
    environment:
      - REACT_APP_API_URL=https://api.cloudopspro.com/api/v1

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/cloudops_pro
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=production-secret-key
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: cloudops_pro
      POSTGRES_USER: cloudops_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Deployment

#### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cloudops-pro
```

#### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudops-pro-config
  namespace: cloudops-pro
data:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/cloudops_pro"
  REDIS_URL: "redis://redis:6379"
  ALLOWED_ORIGINS: "https://cloudopspro.com"
```

#### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudops-pro-secrets
  namespace: cloudops-pro
type: Opaque
data:
  SECRET_KEY: <base64-encoded-secret>
  OPENAI_API_KEY: <base64-encoded-key>
```

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudops-pro-backend
  namespace: cloudops-pro
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cloudops-pro-backend
  template:
    metadata:
      labels:
        app: cloudops-pro-backend
    spec:
      containers:
        - name: backend
          image: cloudops-pro/backend:latest
          ports:
            - containerPort: 8000
          envFrom:
            - configMapRef:
                name: cloudops-pro-config
            - secretRef:
                name: cloudops-pro-secrets
```

## Monitoring and Logging

### Application Monitoring

- **Frontend**: Vercel Analytics
- **Backend**: Render Metrics
- **Database**: PostgreSQL monitoring
- **Cache**: Redis monitoring

### Logging

- **Application Logs**: Structured JSON logging
- **Access Logs**: Nginx access logs
- **Error Logs**: Centralized error tracking
- **Audit Logs**: User activity tracking

### Health Checks

```bash
# Frontend health check
curl -f https://cloudopspro.com/health

# Backend health check
curl -f https://api.cloudopspro.com/health

# Database health check
pg_isready -h postgres -p 5432

# Redis health check
redis-cli -h redis ping
```

## Security Considerations

### SSL/TLS

- Use Let's Encrypt for free SSL certificates
- Configure HTTPS redirects
- Implement HSTS headers
- Use secure cookie settings

### Network Security

- Configure firewall rules
- Use VPC for cloud deployments
- Implement rate limiting
- Enable DDoS protection

### Data Security

- Encrypt sensitive data at rest
- Use secure environment variable management
- Implement proper backup strategies
- Regular security audits

## Troubleshooting

### Common Issues

#### Frontend Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Backend Connection Issues

```bash
# Check database connection
python -c "import psycopg2; print('DB OK')"

# Check Redis connection
python -c "import redis; r=redis.Redis(); print(r.ping())"
```

#### Docker Issues

```bash
# Clean up Docker
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Performance Optimization

#### Frontend

- Enable gzip compression
- Implement lazy loading
- Use CDN for static assets
- Optimize bundle size

#### Backend

- Enable database connection pooling
- Implement Redis caching
- Use async/await patterns
- Optimize database queries

#### Database

- Create proper indexes
- Regular VACUUM and ANALYZE
- Monitor query performance
- Implement read replicas

## Backup and Recovery

### Database Backups

```bash
# Create backup
pg_dump -h postgres -U cloudops_user cloudops_pro > backup.sql

# Restore backup
psql -h postgres -U cloudops_user cloudops_pro < backup.sql
```

### Application Backups

- Code repository (Git)
- Environment configurations
- SSL certificates
- Database dumps

### Recovery Procedures

1. Restore database from backup
2. Deploy application code
3. Update environment variables
4. Verify service health
5. Test critical functionality

This deployment guide provides comprehensive instructions for deploying CloudOps Pro across different environments while maintaining security, performance, and reliability.
