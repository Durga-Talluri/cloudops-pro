from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CloudResource(BaseModel):
    id: str
    name: str
    type: str  # server, database, storage, network, container
    status: str  # running, stopped, pending, error
    provider: str  # aws, gcp, azure
    region: str
    cost: float
    created_at: datetime
    updated_at: datetime

class UsageResponse(BaseModel):
    aws: List[CloudResource]
    gcp: List[CloudResource]
    azure: List[CloudResource]
    total_cost: float
    last_updated: datetime

class ResourceMetrics(BaseModel):
    resource_id: str
    metric_name: str
    value: float
    unit: str
    timestamp: datetime

class UsageMetricsResponse(BaseModel):
    metrics: List[ResourceMetrics]
    time_range: str
    aggregation: str