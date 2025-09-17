from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
import random

from app.schemas.alerts import AlertsResponse, Alert, AlertSeverity, AlertStatus, AlertUpdate, AlertCreate

router = APIRouter()

# Mock alerts data
mock_alerts = [
    Alert(
        id="1",
        title="High CPU Usage",
        description="Web server CPU usage has exceeded 90% for the last 15 minutes",
        severity=AlertSeverity.CRITICAL,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now() - timedelta(minutes=2),
        resource="aws-web-server-01",
        category="Performance",
        metadata={"cpu_usage": 92.5, "threshold": 90}
    ),
    Alert(
        id="2",
        title="Database Connection Pool Exhausted",
        description="PostgreSQL connection pool is at 95% capacity",
        severity=AlertSeverity.WARNING,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now() - timedelta(minutes=5),
        resource="gcp-postgres-primary",
        category="Database",
        metadata={"connection_count": 95, "max_connections": 100}
    ),
    Alert(
        id="3",
        title="SSL Certificate Expiring",
        description="SSL certificate for api.cloudopspro.com expires in 7 days",
        severity=AlertSeverity.WARNING,
        status=AlertStatus.ACKNOWLEDGED,
        timestamp=datetime.now() - timedelta(hours=4),
        resource="api.cloudopspro.com",
        category="Security",
        metadata={"expiry_date": "2024-01-28", "days_remaining": 7}
    ),
    Alert(
        id="4",
        title="Backup Job Completed",
        description="Daily backup job completed successfully",
        severity=AlertSeverity.INFO,
        status=AlertStatus.RESOLVED,
        timestamp=datetime.now() - timedelta(hours=8),
        resource="backup-service",
        category="Backup",
        metadata={"backup_size": "2.3GB", "duration": "15 minutes"}
    ),
    Alert(
        id="5",
        title="Memory Usage High",
        description="Application server memory usage is at 85%",
        severity=AlertSeverity.WARNING,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now() - timedelta(minutes=15),
        resource="azure-app-server-02",
        category="Performance",
        metadata={"memory_usage": 85.2, "threshold": 80}
    ),
    Alert(
        id="6",
        title="Disk Space Low",
        description="Storage volume is 95% full",
        severity=AlertSeverity.CRITICAL,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now() - timedelta(minutes=30),
        resource="aws-storage-volume-01",
        category="Storage",
        metadata={"disk_usage": 95.1, "free_space": "2.1GB"}
    ),
    Alert(
        id="7",
        title="Network Latency High",
        description="Average network latency has increased to 200ms",
        severity=AlertSeverity.WARNING,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now() - timedelta(minutes=45),
        resource="gcp-load-balancer",
        category="Network",
        metadata={"latency": 200, "threshold": 150}
    )
]

@router.get("/", response_model=AlertsResponse)
async def get_alerts(
    severity: Optional[AlertSeverity] = Query(None, description="Filter by severity"),
    status: Optional[AlertStatus] = Query(None, description="Filter by status"),
    limit: int = Query(50, description="Maximum number of alerts to return"),
    offset: int = Query(0, description="Number of alerts to skip")
):
    """
    Get all alerts with optional filtering
    """
    try:
        filtered_alerts = mock_alerts.copy()
        
        # Apply filters
        if severity:
            filtered_alerts = [alert for alert in filtered_alerts if alert.severity == severity]
        
        if status:
            filtered_alerts = [alert for alert in filtered_alerts if alert.status == status]
        
        # Apply pagination
        total_count = len(filtered_alerts)
        paginated_alerts = filtered_alerts[offset:offset + limit]
        
        # Count by severity
        critical_count = len([a for a in filtered_alerts if a.severity == AlertSeverity.CRITICAL])
        warning_count = len([a for a in filtered_alerts if a.severity == AlertSeverity.WARNING])
        info_count = len([a for a in filtered_alerts if a.severity == AlertSeverity.INFO])
        
        return AlertsResponse(
            alerts=paginated_alerts,
            total_count=total_count,
            critical_count=critical_count,
            warning_count=warning_count,
            info_count=info_count,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alerts: {str(e)}")

@router.get("/{alert_id}", response_model=Alert)
async def get_alert(alert_id: str):
    """
    Get a specific alert by ID
    """
    alert = next((alert for alert in mock_alerts if alert.id == alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}", response_model=Alert)
async def update_alert(alert_id: str, alert_update: AlertUpdate):
    """
    Update an alert status
    """
    alert_index = next((i for i, alert in enumerate(mock_alerts) if alert.id == alert_id), None)
    if alert_index is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Update the alert
    mock_alerts[alert_index].status = alert_update.status
    mock_alerts[alert_index].updated_at = datetime.now()
    
    return mock_alerts[alert_index]

@router.post("/", response_model=Alert)
async def create_alert(alert_create: AlertCreate):
    """
    Create a new alert
    """
    new_alert = Alert(
        id=str(len(mock_alerts) + 1),
        title=alert_create.title,
        description=alert_create.description,
        severity=alert_create.severity,
        status=AlertStatus.ACTIVE,
        timestamp=datetime.now(),
        resource=alert_create.resource,
        category=alert_create.category,
        metadata=alert_create.metadata
    )
    
    mock_alerts.append(new_alert)
    return new_alert

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    """
    Delete an alert
    """
    alert_index = next((i for i, alert in enumerate(mock_alerts) if alert.id == alert_id), None)
    if alert_index is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    deleted_alert = mock_alerts.pop(alert_index)
    return {"message": f"Alert {deleted_alert.title} deleted successfully"}

@router.get("/summary/stats")
async def get_alert_stats():
    """
    Get alert statistics summary
    """
    active_alerts = [a for a in mock_alerts if a.status == AlertStatus.ACTIVE]
    critical_alerts = [a for a in active_alerts if a.severity == AlertSeverity.CRITICAL]
    warning_alerts = [a for a in active_alerts if a.severity == AlertSeverity.WARNING]
    
    return {
        "total_alerts": len(mock_alerts),
        "active_alerts": len(active_alerts),
        "critical_alerts": len(critical_alerts),
        "warning_alerts": len(warning_alerts),
        "resolved_today": len([a for a in mock_alerts if a.status == AlertStatus.RESOLVED and a.timestamp.date() == datetime.now().date()]),
        "last_updated": datetime.now()
    }

@router.post("/bulk-acknowledge")
async def bulk_acknowledge_alerts(alert_ids: List[str]):
    """
    Acknowledge multiple alerts at once
    """
    updated_count = 0
    for alert_id in alert_ids:
        alert_index = next((i for i, alert in enumerate(mock_alerts) if alert.id == alert_id), None)
        if alert_index is not None:
            mock_alerts[alert_index].status = AlertStatus.ACKNOWLEDGED
            updated_count += 1
    
    return {
        "message": f"Successfully acknowledged {updated_count} alerts",
        "updated_count": updated_count
    }