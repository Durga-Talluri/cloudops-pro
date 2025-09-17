from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CostDataPoint(BaseModel):
    date: str
    cost: float
    predicted: Optional[float] = None

class OptimizationSuggestion(BaseModel):
    id: str
    title: str
    description: str
    potential_savings: float
    impact: str  # low, medium, high
    category: str
    implementation_effort: str  # low, medium, high
    confidence_score: float

class CostAnalysisRequest(BaseModel):
    time_range: str = "7d"  # 7d, 30d, 90d
    include_predictions: bool = True
    include_optimizations: bool = True

class CostAnalysisResponse(BaseModel):
    cost_data: List[CostDataPoint]
    current_cost: float
    previous_cost: float
    change_percent: float
    total_savings: float
    optimization_suggestions: List[OptimizationSuggestion]
    ai_insights: str
    last_updated: datetime

class CostSummary(BaseModel):
    current_cost: float
    previous_cost: float
    change: float
    change_percent: float
    total_savings: float
    monthly_projection: float