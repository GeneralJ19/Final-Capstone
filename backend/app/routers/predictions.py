from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..database import get_db
from ..models.user import User
from ..models.predictions import Prediction
from ..services.prediction_service import PredictionService
from ..services.auth_service import auth_service
from ..schemas.predictions import (
    PredictionCreate,
    PredictionResponse,
    PredictionUpdate,
    PredictionStats
)
from ..services.openai_service import OpenAIService
from ..core.config import settings

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"]
)

def get_prediction_service(db: Session = Depends(get_db)) -> PredictionService:
    return PredictionService(db)

openai_service = OpenAIService()

@router.get("/{sport}", response_model=List[PredictionResponse], operation_id="get_predictions_by_sport")
async def get_predictions(
    sport: str,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get predictions for a specific sport
    """
    prediction_service = get_prediction_service(db)
    predictions = await prediction_service.get_user_predictions(
        user_id=current_user.id,
        prop_type=sport
    )
    return predictions

@router.post("/", response_model=PredictionResponse, operation_id="create_new_prediction")
async def create_prediction(
    prediction: PredictionCreate,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new prediction
    """
    prediction_service = get_prediction_service(db)
    return await prediction_service.generate_player_prediction(
        player_name=prediction.player_name,
        team=prediction.team,
        opponent=prediction.opponent,
        game_date=prediction.game_date,
        prop_type=prediction.prop_type,
        prop_value=prediction.prop_value,
        user_id=current_user.id
    )

@router.put("/{prediction_id}", response_model=PredictionResponse, operation_id="update_prediction_result")
async def update_prediction(
    prediction_id: int,
    prediction_update: PredictionUpdate,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a prediction with actual results
    """
    prediction_service = get_prediction_service(db)
    return await prediction_service.update_prediction_result(
        prediction_id=prediction_id,
        actual_result=prediction_update.actual_result
    )

@router.get("/stats/me", response_model=PredictionStats, operation_id="get_my_prediction_stats")
async def get_prediction_stats(
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics about the current user's predictions
    """
    prediction_service = get_prediction_service(db)
    return await prediction_service.get_prediction_stats(current_user.id)

@router.get("/match/{sport}/{team1}/{team2}")
async def get_match_prediction(
    sport: str,
    team1: str,
    team2: str,
    match_type: str = "regular season"
) -> Dict[str, Any]:
    """
    Get a prediction for a match between two teams.
    """
    try:
        prediction = await openai_service.get_prediction(
            sport=sport,
            team1=team1,
            team2=team2,
            match_type=match_type
        )
        return prediction
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate prediction: {str(e)}"
        )

@router.get("/player/{sport}/{player_name}")
async def get_player_prediction(
    sport: str,
    player_name: str,
    team: str
) -> Dict[str, Any]:
    """
    Get a prediction for a player's performance.
    """
    try:
        analysis = await openai_service.get_player_analysis(
            player_name=player_name,
            team=team,
            sport=sport
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate player analysis: {str(e)}"
        ) 