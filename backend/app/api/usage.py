from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timedelta
import random

from app.schemas.usage import UsageResponse, CloudResource, UsageMetricsResponse, ResourceMetrics

router = APIRouter()

# Mock data for cloud resources
mock_aws_resources = [
    CloudResource(
        id="aws-vm1",
        name="Web Server",
        type="server",
        status="running",
        provider="aws",
        region="us-east-1",
        cost=120.0,
        created_at=datetime.now() - timedelta(days=30),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="aws-db1",
        name="Primary DB",
        type="database",
        status="running",
        provider="aws",
        region="us-east-1",
        cost=340.0,
        created_at=datetime.now() - timedelta(days=45),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="aws-s3",
        name="File Storage",
        type="storage",
        status="running",
        provider="aws",
        region="us-east-1",
        cost=45.0,
        created_at=datetime.now() - timedelta(days=20),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="aws-lb",
        name="Load Balancer",
        type="network",
        status="running",
        provider="aws",
        region="us-east-1",
        cost=18.0,
        created_at=datetime.now() - timedelta(days=15),
        updated_at=datetime.now()
    )
]

mock_gcp_resources = [
    CloudResource(
        id="gcp-vm1",
        name="App Server",
        type="server",
        status="running",
        provider="gcp",
        region="us-central1",
        cost=95.0,
        created_at=datetime.now() - timedelta(days=25),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="gcp-db1",
        name="Analytics DB",
        type="database",
        status="running",
        provider="gcp",
        region="us-central1",
        cost=280.0,
        created_at=datetime.now() - timedelta(days=40),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="gcp-k8s",
        name="Kubernetes",
        type="container",
        status="running",
        provider="gcp",
        region="us-central1",
        cost=156.0,
        created_at=datetime.now() - timedelta(days=35),
        updated_at=datetime.now()
    )
]

mock_azure_resources = [
    CloudResource(
        id="azure-vm1",
        name="Backup Server",
        type="server",
        status="stopped",
        provider="azure",
        region="eastus",
        cost=0.0,
        created_at=datetime.now() - timedelta(days=50),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="azure-db1",
        name="Cache DB",
        type="database",
        status="running",
        provider="azure",
        region="eastus",
        cost=78.0,
        created_at=datetime.now() - timedelta(days=28),
        updated_at=datetime.now()
    ),
    CloudResource(
        id="azure-storage",
        name="Archive Storage",
        type="storage",
        status="running",
        provider="azure",
        region="eastus",
        cost=23.0,
        created_at=datetime.now() - timedelta(days=22),
        updated_at=datetime.now()
    )
]

@router.get("/", response_model=UsageResponse)
async def get_usage():
    """
    Get current cloud resource usage across all providers
    """
    try:
        total_cost = sum(r.cost for r in mock_aws_resources + mock_gcp_resources + mock_azure_resources)
        
        return UsageResponse(
            aws=mock_aws_resources,
            gcp=mock_gcp_resources,
            azure=mock_azure_resources,
            total_cost=total_cost,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch usage data: {str(e)}")

@router.get("/aws", response_model=List[CloudResource])
async def get_aws_usage():
    """
    Get AWS resource usage
    """
    return mock_aws_resources

@router.get("/gcp", response_model=List[CloudResource])
async def get_gcp_usage():
    """
    Get GCP resource usage
    """
    return mock_gcp_resources

@router.get("/azure", response_model=List[CloudResource])
async def get_azure_usage():
    """
    Get Azure resource usage
    """
    return mock_azure_resources

@router.get("/metrics/{resource_id}", response_model=UsageMetricsResponse)
async def get_resource_metrics(resource_id: str, time_range: str = "1h"):
    """
    Get metrics for a specific resource
    """
    # Mock metrics data
    mock_metrics = []
    base_time = datetime.now()
    
    for i in range(24):  # Last 24 hours
        mock_metrics.append(ResourceMetrics(
            resource_id=resource_id,
            metric_name="cpu_usage",
            value=random.uniform(20, 90),
            unit="percent",
            timestamp=base_time - timedelta(hours=i)
        ))
        
        mock_metrics.append(ResourceMetrics(
            resource_id=resource_id,
            metric_name="memory_usage",
            value=random.uniform(30, 85),
            unit="percent",
            timestamp=base_time - timedelta(hours=i)
        ))
    
    return UsageMetricsResponse(
        metrics=mock_metrics,
        time_range=time_range,
        aggregation="hourly"
    )

@router.get("/cost-summary")
async def get_cost_summary():
    """
    Get cost summary across all providers
    """
    aws_cost = sum(r.cost for r in mock_aws_resources)
    gcp_cost = sum(r.cost for r in mock_gcp_resources)
    azure_cost = sum(r.cost for r in mock_azure_resources)
    total_cost = aws_cost + gcp_cost + azure_cost
    
    return {
        "total_cost": total_cost,
        "aws_cost": aws_cost,
        "gcp_cost": gcp_cost,
        "azure_cost": azure_cost,
        "currency": "USD",
        "period": "monthly",
        "last_updated": datetime.now()
    }