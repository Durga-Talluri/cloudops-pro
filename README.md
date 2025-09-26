# CloudOps Pro

A comprehensive cloud infrastructure management platform with AI-powered cost optimization, compliance monitoring, and real-time alerting.

![CloudOps Pro](https://img.shields.io/badge/CloudOps-Pro-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Features

### 📊 Dashboard & Visualization

- **Real-time Infrastructure Topology** - Interactive 2D/3D visualization of AWS, GCP, and Azure resources
- **AI-Powered Cost Dashboard** - Smart cost analysis with optimization suggestions
- **Compliance Monitor** - SOC2, HIPAA, PCI DSS compliance tracking
- **Alert Management** - Real-time alerts with severity-based filtering
- **GitOps Workflow** - Visual CI/CD pipeline representation

### 📱 Mobile DevOps Console

- **Mobile Alerts** - Push notifications for critical infrastructure issues
- **Cost Monitoring** - Mobile-optimized cost analysis and trends
- **Pull-to-Refresh** - Real-time data synchronization
- **Offline Support** - Cached data for offline viewing

### 🤖 AI Integration

- **Cost Optimization** - OpenAI-powered cost reduction suggestions
- **Predictive Analytics** - AI-driven cost and usage predictions
- **Smart Recommendations** - Automated infrastructure optimization
- **Natural Language Insights** - AI-generated cost analysis reports

### 🔒 Security & Compliance

- **Multi-Standard Compliance** - SOC2, HIPAA, PCI DSS monitoring
- **Security Scanning** - Automated vulnerability detection
- **Access Control** - Role-based permissions
- **Audit Logging** - Comprehensive activity tracking

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │  React Native   │    │   FastAPI       │
│   Dashboard     │◄──►│   Mobile App    │◄──►│   Backend       │
│   (Port 3000)   │    │   (Expo)        │    │   (Port 8000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Microservices │
                    │   (Node.js)     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Cloud APIs    │
                    │  AWS/GCP/Azure  │
                    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **React Query** - Server state management
- **Zustand** - Client state management

### Mobile

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Chart Kit** - Mobile charts
- **React Query** - Data fetching

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **OpenAI API** - AI integration

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Local development
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend deployment
- **Render/Railway** - Backend deployment
- **Nginx** - Reverse proxy

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cloudops-pro.git
   cd cloudops-pro
   ```

2. **Run the setup script**

   ```bash
   chmod +x scripts/setup-dev.sh
   ./scripts/setup-dev.sh
   ```

3. **Configure environment variables**

   ```bash
   # Update the .env files with your API keys
   cp backend/env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp mobile/.env.example mobile/.env
   ```

4. **Start the development environment**

   ```bash
   ./start-dev.sh
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Mobile: Use Expo Go app to scan QR code

### Manual Setup

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

#### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

## 🐳 Docker Deployment

### Local Development

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Production Deployment

```bash
# Build and deploy
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render/Railway)

```bash
cd backend
./scripts/deploy-backend.sh
```

### Using Scripts

```bash
# Deploy frontend
./scripts/deploy-frontend.sh

# Deploy backend
./scripts/deploy-backend.sh
```

## 📚 API Documentation

### Core Endpoints

#### Usage & Resources

- `GET /api/v1/usage/` - Get all cloud resources
- `GET /api/v1/usage/aws` - Get AWS resources
- `GET /api/v1/usage/gcp` - Get GCP resources
- `GET /api/v1/usage/azure` - Get Azure resources

#### Alerts

- `GET /api/v1/alerts/` - Get all alerts
- `POST /api/v1/alerts/` - Create new alert
- `PUT /api/v1/alerts/{id}` - Update alert
- `DELETE /api/v1/alerts/{id}` - Delete alert

#### Compliance

- `GET /api/v1/compliance/` - Get compliance status
- `GET /api/v1/compliance/{standard_id}` - Get specific standard
- `POST /api/v1/compliance/check` - Run compliance check

#### AI Cost Analysis

- `GET /api/v1/ai-cost/` - Get cost analysis
- `GET /api/v1/ai-cost/summary` - Get cost summary
- `GET /api/v1/ai-cost/optimizations` - Get optimization suggestions

### Interactive API Documentation

Visit http://localhost:8000/docs for interactive API documentation with Swagger UI.

## 🧪 Testing

### Run All Tests

```bash
./test-all.sh
```

### Individual Test Suites

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test

# Mobile tests
cd mobile
npm test
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost/cloudops_pro
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
GCP_PROJECT_ID=your-gcp-project
AZURE_SUBSCRIPTION_ID=your-azure-subscription
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
```

Note: The frontend components now fetch live data from the backend API. Ensure `REACT_APP_API_URL` points to your backend (for local development use `http://localhost:8000/api/v1`).

#### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
```

## 📱 Mobile App

### Development

```bash
cd mobile
npx expo start
```

### Building

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

### Features

- Real-time alerts with push notifications
- Cost analysis and trends
- Pull-to-refresh functionality
- Offline data caching
- Dark mode support

## 🤖 AI Integration

### OpenAI Configuration

1. Get your OpenAI API key from https://platform.openai.com/
2. Add it to your backend `.env` file
3. The AI will automatically provide:
   - Cost optimization suggestions
   - Predictive cost analysis
   - Natural language insights

### AI Features

- **Cost Optimization**: Smart recommendations for reducing cloud costs
- **Predictive Analytics**: Forecast future costs and usage
- **Natural Language**: AI-generated reports and insights
- **Smart Alerts**: Context-aware alert prioritization

## 🔒 Security

### Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- Session management

### Data Protection

- Encryption at rest and in transit
- Secure API endpoints
- Input validation and sanitization
- CORS configuration

### Compliance

- SOC2 Type II compliance monitoring
- HIPAA compliance tracking
- PCI DSS compliance validation
- GDPR data protection

## 📊 Monitoring & Observability

### Metrics

- Application performance metrics
- Infrastructure health monitoring
- Cost tracking and optimization
- User activity analytics

### Logging

- Structured logging with JSON format
- Centralized log aggregation
- Error tracking and alerting
- Audit trail maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass

### Documentation

- [API Documentation](http://localhost:8000/docs)
- [Architecture Guide](docs/architecture.md)
- [Deployment Guide](docs/deployment.md)

### Professional Support

For enterprise support and custom implementations, contact us at support@cloudopspro.com.

## 🗺️ Roadmap

### Version 1.1

- [ ] Advanced 3D topology visualization
- [ ] Multi-cloud cost optimization
- [ ] Enhanced mobile features
- [ ] Real-time collaboration

### Version 1.2

- [ ] Machine learning cost predictions
- [ ] Advanced compliance automation
- [ ] Custom dashboard builder
- [ ] API rate limiting and quotas

### Version 2.0

- [ ] Multi-tenant architecture
- [ ] Advanced analytics and reporting
- [ ] Integration marketplace
- [ ] Enterprise SSO support

## Acknowledgments

- OpenAI for AI integration capabilities
- The React and FastAPI communities
- All contributors and testers
- Cloud providers (AWS, GCP, Azure) for their APIs

---
