from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
import random
import openai
from app.core.config import settings

from app.schemas.ai_cost import (
    CostAnalysisResponse, 
    CostDataPoint, 
    OptimizationSuggestion, 
    CostAnalysisRequest,
    CostSummary
)

router = APIRouter()

# Initialize OpenAI client
if settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY

# Mock cost data
mock_cost_data = [
    CostDataPoint(date="2024-01-15", cost=2847, predicted=2900),
    CostDataPoint(date="2024-01-16", cost=2923, predicted=2950),
    CostDataPoint(date="2024-01-17", cost=3105, predicted=3000),
    CostDataPoint(date="2024-01-18", cost=2987, predicted=3050),
    CostDataPoint(date="2024-01-19", cost=3123, predicted=3100),
    CostDataPoint(date="2024-01-20", cost=3056, predicted=3150),
    CostDataPoint(date="2024-01-21", cost=3189, predicted=3200)
]

mock_optimizations = [
    OptimizationSuggestion(
        id="1",
        title="Right-size EC2 instances",
        description="Switch from m5.large to m5.medium for non-production workloads",
        potential_savings=340.0,
        impact="high",
        category="Compute",
        implementation_effort="low",
        confidence_score=0.92
    ),
    OptimizationSuggestion(
        id="2",
        title="Enable S3 Intelligent Tiering",
        description="Move infrequently accessed data to cheaper storage tiers",
        potential_savings=120.0,
        impact="medium",
        category="Storage",
        implementation_effort="low",
        confidence_score=0.88
    ),
    OptimizationSuggestion(
        id="3",
        title="Reserve instances for predictable workloads",
        description="Purchase 1-year reserved instances for production databases",
        potential_savings=450.0,
        impact="high",
        category="Compute",
        implementation_effort="medium",
        confidence_score=0.95
    ),
    OptimizationSuggestion(
        id="4",
        title="Optimize database queries",
        description="Reduce RDS query execution time by 15% through indexing",
        potential_savings=85.0,
        impact="medium",
        category="Database",
        implementation_effort="high",
        confidence_score=0.78
    ),
    OptimizationSuggestion(
        id="5",
        title="Implement auto-scaling",
        description="Add auto-scaling groups to handle traffic spikes efficiently",
        potential_savings=200.0,
        impact="medium",
        category="Compute",
        implementation_effort="medium",
        confidence_score=0.85
    ),
    OptimizationSuggestion(
        id="6",
        title="Use spot instances for batch jobs",
        description="Replace on-demand instances with spot instances for non-critical workloads",
        potential_savings=180.0,
        impact="medium",
        category="Compute",
        implementation_effort="high",
        confidence_score=0.82
    )
]

async def get_ai_insights(cost_data: List[CostDataPoint], optimizations: List[OptimizationSuggestion]) -> str:
    """
    Get AI insights using OpenAI API
    """
    if not settings.OPENAI_API_KEY:
        return "AI insights unavailable - OpenAI API key not configured"
    
    try:
        # Prepare context for AI
        current_cost = cost_data[-1].cost if cost_data else 0
        total_savings = sum(opt.potential_savings for opt in optimizations)
        
        prompt = f"""
        Analyze the following cloud infrastructure cost data and provide insights:
        
        Current daily cost: ${current_cost}
        Total potential savings: ${total_savings}/month
        
        Cost trend (last 7 days):
        {[f"{point.date}: ${point.cost}" for point in cost_data]}
        
        Top optimization opportunities:
        {[f"- {opt.title}: ${opt.potential_savings}/month savings ({opt.impact} impact)" for opt in optimizations[:3]]}
        
        Provide 2-3 key insights and recommendations for cost optimization.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cloud cost optimization expert. Provide concise, actionable insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"AI analysis temporarily unavailable: {str(e)}"

@router.get("/", response_model=CostAnalysisResponse)
async def get_cost_analysis(
    time_range: str = Query("7d", description="Time range for analysis"),
    include_predictions: bool = Query(True, description="Include AI predictions"),
    include_optimizations: bool = Query(True, description="Include optimization suggestions")
):
    """
    Get AI-powered cost analysis and optimization suggestions
    """
    try:
        # Filter cost data based on time range
        filtered_data = mock_cost_data.copy()
        if time_range == "30d":
            # Generate more data points for 30 days
            filtered_data = []
            base_date = datetime.now() - timedelta(days=30)
            for i in range(30):
                date = base_date + timedelta(days=i)
                cost = 2800 + random.randint(-200, 400)
                predicted = cost + random.randint(-50, 100)
                filtered_data.append(CostDataPoint(
                    date=date.strftime("%Y-%m-%d"),
                    cost=cost,
                    predicted=predicted if include_predictions else None
                ))
        elif time_range == "90d":
            # Generate data for 90 days
            filtered_data = []
            base_date = datetime.now() - timedelta(days=90)
            for i in range(90):
                date = base_date + timedelta(days=i)
                cost = 2800 + random.randint(-300, 500)
                predicted = cost + random.randint(-100, 150)
                filtered_data.append(CostDataPoint(
                    date=date.strftime("%Y-%m-%d"),
                    cost=cost,
                    predicted=predicted if include_predictions else None
                ))
        
        current_cost = filtered_data[-1].cost if filtered_data else 0
        previous_cost = filtered_data[-2].cost if len(filtered_data) > 1 else current_cost
        change_percent = ((current_cost - previous_cost) / previous_cost * 100) if previous_cost > 0 else 0
        
        # Get optimization suggestions
        optimizations = mock_optimizations if include_optimizations else []
        total_savings = sum(opt.potential_savings for opt in optimizations)
        
        # Get AI insights
        ai_insights = await get_ai_insights(filtered_data, optimizations)
        
        return CostAnalysisResponse(
            cost_data=filtered_data,
            current_cost=current_cost,
            previous_cost=previous_cost,
            change_percent=change_percent,
            total_savings=total_savings,
            optimization_suggestions=optimizations,
            ai_insights=ai_insights,
            last_updated=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate cost analysis: {str(e)}")

@router.get("/summary", response_model=CostSummary)
async def get_cost_summary():
    """
    Get cost summary with AI predictions
    """
    try:
        current_cost = mock_cost_data[-1].cost
        previous_cost = mock_cost_data[-2].cost if len(mock_cost_data) > 1 else current_cost
        change = current_cost - previous_cost
        change_percent = (change / previous_cost * 100) if previous_cost > 0 else 0
        
        # Calculate monthly projection
        monthly_projection = current_cost * 30
        
        # Calculate total potential savings
        total_savings = sum(opt.potential_savings for opt in mock_optimizations)
        
        return CostSummary(
            current_cost=current_cost,
            previous_cost=previous_cost,
            change=change,
            change_percent=change_percent,
            total_savings=total_savings,
            monthly_projection=monthly_projection
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cost summary: {str(e)}")

@router.get("/optimizations", response_model=List[OptimizationSuggestion])
async def get_optimization_suggestions(
    category: Optional[str] = Query(None, description="Filter by category"),
    impact: Optional[str] = Query(None, description="Filter by impact level"),
    limit: int = Query(10, description="Maximum number of suggestions")
):
    """
    Get AI-generated optimization suggestions
    """
    try:
        filtered_optimizations = mock_optimizations.copy()
        
        if category:
            filtered_optimizations = [opt for opt in filtered_optimizations if opt.category.lower() == category.lower()]
        
        if impact:
            filtered_optimizations = [opt for opt in filtered_optimizations if opt.impact == impact]
        
        # Sort by potential savings (descending)
        filtered_optimizations.sort(key=lambda x: x.potential_savings, reverse=True)
        
        return filtered_optimizations[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get optimization suggestions: {str(e)}")

@router.post("/analyze", response_model=CostAnalysisResponse)
async def analyze_cost_data(request: CostAnalysisRequest):
    """
    Analyze cost data with custom parameters
    """
    try:
        # This would typically analyze real usage data
        # For now, we'll use mock data with the requested parameters
        
        filtered_data = mock_cost_data.copy()
        if request.time_range == "30d":
            # Generate 30 days of data
            filtered_data = []
            base_date = datetime.now() - timedelta(days=30)
            for i in range(30):
                date = base_date + timedelta(days=i)
                cost = 2800 + random.randint(-200, 400)
                predicted = cost + random.randint(-50, 100) if request.include_predictions else None
                filtered_data.append(CostDataPoint(
                    date=date.strftime("%Y-%m-%d"),
                    cost=cost,
                    predicted=predicted
                ))
        
        current_cost = filtered_data[-1].cost if filtered_data else 0
        previous_cost = filtered_data[-2].cost if len(filtered_data) > 1 else current_cost
        change_percent = ((current_cost - previous_cost) / previous_cost * 100) if previous_cost > 0 else 0
        
        optimizations = mock_optimizations if request.include_optimizations else []
        total_savings = sum(opt.potential_savings for opt in optimizations)
        
        ai_insights = await get_ai_insights(filtered_data, optimizations)
        
        return CostAnalysisResponse(
            cost_data=filtered_data,
            current_cost=current_cost,
            previous_cost=previous_cost,
            change_percent=change_percent,
            total_savings=total_savings,
            optimization_suggestions=optimizations,
            ai_insights=ai_insights,
            last_updated=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze cost data: {str(e)}")

@router.get("/predictions/next-week")
async def get_next_week_predictions():
    """
    Get AI predictions for the next week
    """
    try:
        # Generate predictions for next 7 days
        predictions = []
        base_date = datetime.now() + timedelta(days=1)
        current_cost = mock_cost_data[-1].cost
        
        for i in range(7):
            date = base_date + timedelta(days=i)
            # Add some trend and randomness
            trend_factor = 1 + (i * 0.02)  # Slight upward trend
            random_factor = random.uniform(0.95, 1.05)
            predicted_cost = current_cost * trend_factor * random_factor
            
            predictions.append({
                "date": date.strftime("%Y-%m-%d"),
                "predicted_cost": round(predicted_cost, 2),
                "confidence": round(random.uniform(0.75, 0.95), 2)
            })
        
        return {
            "predictions": predictions,
            "average_daily_cost": round(sum(p["predicted_cost"] for p in predictions) / len(predictions), 2),
            "total_weekly_cost": round(sum(p["predicted_cost"] for p in predictions), 2),
            "generated_at": datetime.now()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate predictions: {str(e)}")