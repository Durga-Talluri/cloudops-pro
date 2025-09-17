# CloudOps Pro API Documentation

## Overview

The CloudOps Pro API provides comprehensive endpoints for managing cloud infrastructure, monitoring alerts, tracking compliance, and analyzing costs with AI-powered insights.

**Base URL:** `https://api.cloudopspro.com/api/v1`

## Authentication

### JWT Token Authentication

All API endpoints require authentication using JWT tokens in the Authorization header.

```http
Authorization: Bearer <your-jwt-token>
```

### Getting an Access Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    "token": "jwt-token-here"
  }
}
```

## Core Endpoints

### 1. Usage & Resources

#### Get All Cloud Resources

```http
GET /usage/
```

**Response:**

```json
{
  "success": true,
  "data": {
    "aws": [
      {
        "id": "aws-vm1",
        "name": "Web Server",
        "type": "server",
        "status": "running",
        "provider": "aws",
        "region": "us-east-1",
        "cost": 120.0,
        "created_at": "2024-01-21T14:30:00Z",
        "updated_at": "2024-01-21T14:30:00Z"
      }
    ],
    "gcp": [...],
    "azure": [...],
    "total_cost": 1155.0,
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Get AWS Resources

```http
GET /usage/aws
```

#### Get GCP Resources

```http
GET /usage/gcp
```

#### Get Azure Resources

```http
GET /usage/azure
```

#### Get Resource Metrics

```http
GET /usage/metrics/{resource_id}?time_range=1h
```

**Parameters:**

- `time_range`: `1h`, `24h`, `7d`, `30d`

**Response:**

```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "resource_id": "aws-vm1",
        "metric_name": "cpu_usage",
        "value": 75.5,
        "unit": "percent",
        "timestamp": "2024-01-21T14:30:00Z"
      }
    ],
    "time_range": "1h",
    "aggregation": "hourly"
  }
}
```

#### Get Cost Summary

```http
GET /usage/cost-summary
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_cost": 1155.0,
    "aws_cost": 523.0,
    "gcp_cost": 531.0,
    "azure_cost": 101.0,
    "currency": "USD",
    "period": "monthly",
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

### 2. Alerts Management

#### Get All Alerts

```http
GET /alerts/?severity=critical&status=active&limit=50&offset=0
```

**Parameters:**

- `severity`: `critical`, `warning`, `info`
- `status`: `active`, `acknowledged`, `resolved`
- `limit`: Number of alerts to return (default: 50)
- `offset`: Number of alerts to skip (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "1",
        "title": "High CPU Usage",
        "description": "Web server CPU usage has exceeded 90%",
        "severity": "critical",
        "status": "active",
        "timestamp": "2024-01-21T14:30:00Z",
        "resource": "aws-web-server-01",
        "category": "Performance",
        "metadata": {
          "cpu_usage": 92.5,
          "threshold": 90
        }
      }
    ],
    "total_count": 7,
    "critical_count": 2,
    "warning_count": 3,
    "info_count": 2,
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Get Specific Alert

```http
GET /alerts/{alert_id}
```

#### Create New Alert

```http
POST /alerts/
Content-Type: application/json

{
  "title": "Disk Space Low",
  "description": "Storage volume is 95% full",
  "severity": "critical",
  "resource": "aws-storage-01",
  "category": "Storage",
  "metadata": {
    "disk_usage": 95.1,
    "free_space": "2.1GB"
  }
}
```

#### Update Alert

```http
PUT /alerts/{alert_id}
Content-Type: application/json

{
  "status": "acknowledged",
  "notes": "Investigating the issue"
}
```

#### Delete Alert

```http
DELETE /alerts/{alert_id}
```

#### Get Alert Statistics

```http
GET /alerts/summary/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_alerts": 7,
    "active_alerts": 5,
    "critical_alerts": 2,
    "warning_alerts": 3,
    "resolved_today": 2,
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Bulk Acknowledge Alerts

```http
POST /alerts/bulk-acknowledge
Content-Type: application/json

{
  "alert_ids": ["1", "2", "3"]
}
```

### 3. Compliance Monitoring

#### Get Compliance Status

```http
GET /compliance/
```

**Response:**

```json
{
  "success": true,
  "data": {
    "standards": [
      {
        "id": "soc2",
        "name": "SOC 2 Type II",
        "description": "Security, availability, and confidentiality controls",
        "status": "pass",
        "score": 94,
        "last_checked": "2024-01-21T12:30:00Z",
        "issues": [
          {
            "id": "soc2-1",
            "title": "Access logging incomplete",
            "severity": "medium",
            "description": "Some admin actions are not being logged",
            "remediation": "Enable comprehensive audit logging",
            "status": "open"
          }
        ]
      }
    ],
    "overall_score": 93,
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Get Specific Compliance Standard

```http
GET /compliance/{standard_id}
```

#### Run Compliance Check

```http
POST /compliance/check
Content-Type: application/json

{
  "standard_ids": ["soc2", "hipaa"],
  "force_refresh": true
}
```

#### Get Compliance Statistics

```http
GET /compliance/summary/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_standards": 5,
    "passing_standards": 3,
    "warning_standards": 2,
    "failing_standards": 0,
    "total_issues": 8,
    "critical_issues": 1,
    "high_issues": 2,
    "overall_score": 93,
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Get Issues Summary

```http
GET /compliance/issues/summary
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_issues": 8,
    "issues_by_severity": {
      "critical": [
        {
          "id": "pci-1",
          "title": "Network segmentation insufficient",
          "severity": "critical",
          "standard": "PCI DSS",
          "standard_id": "pci",
          "status": "open"
        }
      ],
      "high": [...],
      "medium": [...],
      "low": [...]
    },
    "issues_by_standard": {
      "soc2": 1,
      "hipaa": 1,
      "pci": 2,
      "iso27001": 1,
      "gdpr": 3
    },
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

### 4. AI Cost Analysis

#### Get Cost Analysis

```http
GET /ai-cost/?time_range=7d&include_predictions=true&include_optimizations=true
```

**Parameters:**

- `time_range`: `7d`, `30d`, `90d`
- `include_predictions`: `true`/`false`
- `include_optimizations`: `true`/`false`

**Response:**

```json
{
  "success": true,
  "data": {
    "cost_data": [
      {
        "date": "2024-01-15",
        "cost": 2847.0,
        "predicted": 2900.0
      }
    ],
    "current_cost": 3189.0,
    "previous_cost": 3056.0,
    "change_percent": 4.35,
    "total_savings": 1250.0,
    "optimization_suggestions": [
      {
        "id": "1",
        "title": "Right-size EC2 instances",
        "description": "Switch from m5.large to m5.medium for non-production workloads",
        "potential_savings": 340.0,
        "impact": "high",
        "category": "Compute",
        "implementation_effort": "low",
        "confidence_score": 0.92
      }
    ],
    "ai_insights": "Based on your current usage patterns, implementing the suggested optimizations could reduce your monthly costs by approximately 15%. The highest impact recommendations focus on right-sizing compute resources and optimizing storage tiers.",
    "last_updated": "2024-01-21T14:30:00Z"
  }
}
```

#### Get Cost Summary

```http
GET /ai-cost/summary
```

**Response:**

```json
{
  "success": true,
  "data": {
    "current_cost": 3189.0,
    "previous_cost": 3056.0,
    "change": 133.0,
    "change_percent": 4.35,
    "total_savings": 1250.0,
    "monthly_projection": 95670.0
  }
}
```

#### Get Optimization Suggestions

```http
GET /ai-cost/optimizations?category=Compute&impact=high&limit=10
```

**Parameters:**

- `category`: `Compute`, `Storage`, `Database`, `Network`
- `impact`: `low`, `medium`, `high`
- `limit`: Maximum number of suggestions (default: 10)

#### Analyze Cost Data

```http
POST /ai-cost/analyze
Content-Type: application/json

{
  "time_range": "30d",
  "include_predictions": true,
  "include_optimizations": true
}
```

#### Get Next Week Predictions

```http
GET /ai-cost/predictions/next-week
```

**Response:**

```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "date": "2024-01-22",
        "predicted_cost": 3250.0,
        "confidence": 0.89
      }
    ],
    "average_daily_cost": 3200.0,
    "total_weekly_cost": 22400.0,
    "generated_at": "2024-01-21T14:30:00Z"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error message"],
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-21T14:30:00Z"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Invalid credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

### Limits

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour
- **Bulk operations**: 10 requests per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642780800
```

## WebSocket API

### Real-time Updates

Connect to WebSocket for real-time updates:

```javascript
const ws = new WebSocket("wss://api.cloudopspro.com/ws");

ws.onopen = function () {
  // Subscribe to alerts
  ws.send(
    JSON.stringify({
      type: "subscribe",
      channel: "alerts",
    })
  );
};

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Real-time update:", data);
};
```

### WebSocket Message Types

- `alert_created` - New alert created
- `alert_updated` - Alert status changed
- `resource_updated` - Resource status changed
- `cost_updated` - Cost data updated
- `compliance_updated` - Compliance status changed

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @cloudops-pro/api-client
```

```javascript
import { CloudOpsClient } from "@cloudops-pro/api-client";

const client = new CloudOpsClient({
  baseURL: "https://api.cloudopspro.com/api/v1",
  token: "your-jwt-token",
});

// Get alerts
const alerts = await client.alerts.getAll();

// Get cost analysis
const costAnalysis = await client.aiCost.getAnalysis();
```

### Python

```bash
pip install cloudops-pro-api
```

```python
from cloudops_pro import CloudOpsClient

client = CloudOpsClient(
    base_url='https://api.cloudopspro.com/api/v1',
    token='your-jwt-token'
)

# Get alerts
alerts = client.alerts.get_all()

# Get cost analysis
cost_analysis = client.ai_cost.get_analysis()
```

## Postman Collection

Import the CloudOps Pro API collection into Postman:

- Download: [cloudops-pro-api.postman_collection.json](https://api.cloudopspro.com/docs/cloudops-pro-api.postman_collection.json)
- Environment: [cloudops-pro.postman_environment.json](https://api.cloudopspro.com/docs/cloudops-pro.postman_environment.json)

## Interactive Documentation

Visit the interactive API documentation at:

- **Swagger UI**: https://api.cloudopspro.com/docs
- **ReDoc**: https://api.cloudopspro.com/redoc

## Support

For API support and questions:

- **Documentation**: https://docs.cloudopspro.com/api
- **GitHub Issues**: https://github.com/cloudops-pro/api/issues
- **Email**: api-support@cloudopspro.com
- **Discord**: https://discord.gg/cloudops-pro
