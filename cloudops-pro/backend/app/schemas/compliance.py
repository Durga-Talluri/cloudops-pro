from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ComplianceStatus(str, Enum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"

class IssueSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ComplianceIssue(BaseModel):
    id: str
    title: str
    severity: IssueSeverity
    description: str
    remediation: str
    status: str = "open"

class ComplianceStandard(BaseModel):
    id: str
    name: str
    description: str
    status: ComplianceStatus
    score: int
    last_checked: datetime
    issues: List[ComplianceIssue]

class ComplianceResponse(BaseModel):
    standards: List[ComplianceStandard]
    overall_score: int
    last_updated: datetime

class ComplianceCheckRequest(BaseModel):
    standard_ids: Optional[List[str]] = None
    force_refresh: bool = False