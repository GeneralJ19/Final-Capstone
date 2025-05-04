from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.user import User
from ..services.analytics_service import AnalyticsService
from ..services.auth_service import auth_service

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

def get_analytics_service(db: Session = Depends(get_db)) -> AnalyticsService:
    return AnalyticsService(db)

@router.get("/model/{sport}")
async def get_model_performance(
    sport: str,
    time_period: Optional[int] = 30,  # days
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get performance metrics for a specific model
    """
    analytics_service = get_analytics_service(db)
    return analytics_service.calculate_model_performance(
        db=db,
        sport=sport,
        time_period=timedelta(days=time_period) if time_period else None
    )

@router.get("/user/{user_id}")
async def get_user_performance(
    user_id: int,
    time_period: Optional[int] = 30,  # days
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get performance metrics for a specific user
    """
    # Only allow users to view their own stats or admins to view any stats
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view other users' performance"
        )
    
    analytics_service = get_analytics_service(db)
    return analytics_service.get_user_performance(
        db=db,
        user_id=user_id,
        time_period=timedelta(days=time_period) if time_period else None
    )

@router.get("/sport/{sport}/insights")
async def get_sport_insights(
    sport: str,
    time_period: Optional[int] = 30,  # days
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed insights for a specific sport
    """
    analytics_service = get_analytics_service(db)
    return analytics_service.get_sport_insights(
        db=db,
        sport=sport,
        time_period=timedelta(days=time_period) if time_period else None
    ) 