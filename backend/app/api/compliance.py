from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta

from app.schemas.compliance import (
    ComplianceResponse, 
    ComplianceStandard, 
    ComplianceStatus, 
    ComplianceIssue, 
    IssueSeverity,
    ComplianceCheckRequest
)

router = APIRouter()

# Mock compliance data
mock_compliance_standards = [
    ComplianceStandard(
        id="soc2",
        name="SOC 2 Type II",
        description="Security, availability, and confidentiality controls",
        status=ComplianceStatus.PASS,
        score=94,
        last_checked=datetime.now() - timedelta(hours=2),
        issues=[
            ComplianceIssue(
                id="soc2-1",
                title="Access logging incomplete",
                severity=IssueSeverity.MEDIUM,
                description="Some admin actions are not being logged",
                remediation="Enable comprehensive audit logging for all admin operations",
                status="open"
            )
        ]
    ),
    ComplianceStandard(
        id="hipaa",
        name="HIPAA",
        description="Health Insurance Portability and Accountability Act",
        status=ComplianceStatus.PASS,
        score=98,
        last_checked=datetime.now() - timedelta(hours=5),
        issues=[
            ComplianceIssue(
                id="hipaa-1",
                title="Data encryption at rest",
                severity=IssueSeverity.LOW,
                description="Some backup files are not encrypted",
                remediation="Enable encryption for all backup storage",
                status="open"
            )
        ]
    ),
    ComplianceStandard(
        id="pci",
        name="PCI DSS",
        description="Payment Card Industry Data Security Standard",
        status=ComplianceStatus.WARNING,
        score=87,
        last_checked=datetime.now() - timedelta(hours=1),
        issues=[
            ComplianceIssue(
                id="pci-1",
                title="Network segmentation insufficient",
                severity=IssueSeverity.HIGH,
                description="Payment processing network not properly isolated",
                remediation="Implement proper network segmentation for cardholder data environment",
                status="open"
            ),
            ComplianceIssue(
                id="pci-2",
                title="Vulnerability scanning outdated",
                severity=IssueSeverity.MEDIUM,
                description="Last vulnerability scan was 45 days ago",
                remediation="Schedule monthly vulnerability scans and implement automated scanning",
                status="open"
            )
        ]
    ),
    ComplianceStandard(
        id="iso27001",
        name="ISO 27001",
        description="Information Security Management System",
        status=ComplianceStatus.PASS,
        score=92,
        last_checked=datetime.now() - timedelta(hours=3),
        issues=[
            ComplianceIssue(
                id="iso-1",
                title="Security awareness training overdue",
                severity=IssueSeverity.MEDIUM,
                description="Employee security training is 6 months overdue",
                remediation="Schedule and complete security awareness training for all employees",
                status="open"
            )
        ]
    ),
    ComplianceStandard(
        id="gdpr",
        name="GDPR",
        description="General Data Protection Regulation",
        status=ComplianceStatus.WARNING,
        score=89,
        last_checked=datetime.now() - timedelta(hours=4),
        issues=[
            ComplianceIssue(
                id="gdpr-1",
                title="Data retention policy not enforced",
                severity=IssueSeverity.HIGH,
                description="Personal data is being retained beyond the specified retention period",
                remediation="Implement automated data retention policies and cleanup procedures",
                status="open"
            ),
            ComplianceIssue(
                id="gdpr-2",
                title="Consent management incomplete",
                severity=IssueSeverity.MEDIUM,
                description="Some data processing activities lack proper consent records",
                remediation="Audit and update consent management system",
                status="open"
            )
        ]
    )
]

@router.get("/", response_model=ComplianceResponse)
async def get_compliance_status():
    """
    Get current compliance status for all standards
    """
    try:
        # Calculate overall score
        total_score = sum(standard.score for standard in mock_compliance_standards)
        overall_score = total_score // len(mock_compliance_standards)
        
        return ComplianceResponse(
            standards=mock_compliance_standards,
            overall_score=overall_score,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch compliance data: {str(e)}")

@router.get("/{standard_id}", response_model=ComplianceStandard)
async def get_compliance_standard(standard_id: str):
    """
    Get compliance status for a specific standard
    """
    standard = next((s for s in mock_compliance_standards if s.id == standard_id), None)
    if not standard:
        raise HTTPException(status_code=404, detail="Compliance standard not found")
    return standard

@router.post("/check", response_model=ComplianceResponse)
async def run_compliance_check(request: ComplianceCheckRequest):
    """
    Run compliance check for specified standards
    """
    try:
        # Simulate compliance check
        standards_to_check = mock_compliance_standards
        
        if request.standard_ids:
            standards_to_check = [
                s for s in mock_compliance_standards 
                if s.id in request.standard_ids
            ]
        
        # Update last_checked timestamp
        for standard in standards_to_check:
            standard.last_checked = datetime.now()
            
            # Simulate some random changes in scores/issues
            if request.force_refresh:
                # Randomly adjust scores slightly
                score_change = random.randint(-2, 2)
                standard.score = max(0, min(100, standard.score + score_change))
                
                # Update status based on score
                if standard.score >= 95:
                    standard.status = ComplianceStatus.PASS
                elif standard.score >= 85:
                    standard.status = ComplianceStatus.WARNING
                else:
                    standard.status = ComplianceStatus.FAIL
        
        # Calculate overall score
        total_score = sum(standard.score for standard in standards_to_check)
        overall_score = total_score // len(standards_to_check) if standards_to_check else 0
        
        return ComplianceResponse(
            standards=standards_to_check,
            overall_score=overall_score,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run compliance check: {str(e)}")

@router.get("/summary/stats")
async def get_compliance_stats():
    """
    Get compliance statistics summary
    """
    total_standards = len(mock_compliance_standards)
    passing_standards = len([s for s in mock_compliance_standards if s.status == ComplianceStatus.PASS])
    warning_standards = len([s for s in mock_compliance_standards if s.status == ComplianceStatus.WARNING])
    failing_standards = len([s for s in mock_compliance_standards if s.status == ComplianceStatus.FAIL])
    
    total_issues = sum(len(s.issues) for s in mock_compliance_standards)
    critical_issues = sum(
        len([i for i in s.issues if i.severity == IssueSeverity.CRITICAL]) 
        for s in mock_compliance_standards
    )
    high_issues = sum(
        len([i for i in s.issues if i.severity == IssueSeverity.HIGH]) 
        for s in mock_compliance_standards
    )
    
    return {
        "total_standards": total_standards,
        "passing_standards": passing_standards,
        "warning_standards": warning_standards,
        "failing_standards": failing_standards,
        "total_issues": total_issues,
        "critical_issues": critical_issues,
        "high_issues": high_issues,
        "overall_score": sum(s.score for s in mock_compliance_standards) // total_standards,
        "last_updated": datetime.now()
    }

@router.get("/issues/summary")
async def get_issues_summary():
    """
    Get summary of all compliance issues across standards
    """
    all_issues = []
    for standard in mock_compliance_standards:
        for issue in standard.issues:
            all_issues.append({
                "id": issue.id,
                "title": issue.title,
                "severity": issue.severity,
                "standard": standard.name,
                "standard_id": standard.id,
                "status": issue.status
            })
    
    # Group by severity
    issues_by_severity = {
        "critical": [i for i in all_issues if i["severity"] == IssueSeverity.CRITICAL],
        "high": [i for i in all_issues if i["severity"] == IssueSeverity.HIGH],
        "medium": [i for i in all_issues if i["severity"] == IssueSeverity.MEDIUM],
        "low": [i for i in all_issues if i["severity"] == IssueSeverity.LOW]
    }
    
    return {
        "total_issues": len(all_issues),
        "issues_by_severity": issues_by_severity,
        "issues_by_standard": {
            standard.id: len(standard.issues) 
            for standard in mock_compliance_standards
        },
        "last_updated": datetime.now()
    }