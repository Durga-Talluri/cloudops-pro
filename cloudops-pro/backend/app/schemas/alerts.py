from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class AlertSeverity(str, Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"

class AlertStatus(str, Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"

class Alert(BaseModel):
    id: str
    title: str
    description: str
    severity: AlertSeverity
    status: AlertStatus
    timestamp: datetime
    resource: str
    category: str
    metadata: Optional[dict] = None

class AlertsResponse(BaseModel):
    alerts: List[Alert]
    total_count: int
    critical_count: int
    warning_count: int
    info_count: int
    last_updated: datetime

class AlertUpdate(BaseModel):
    status: AlertStatus
    notes: Optional[str] = None

class AlertCreate(BaseModel):
    title: str
    description: str
    severity: AlertSeverity
    resource: str
    category: str
    metadata: Optional[dict] = None