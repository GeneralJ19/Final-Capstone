from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import random

router = APIRouter()

class GameData(BaseModel):
    home_team: str
    away_team: str
    home_team_rating: float
    away_team_rating: float
    home_team_form: float
    away_team_form: float
    home_team_rest_days: float
    away_team_rest_days: float
    home_team_players: List[Dict]
    away_team_players: List[Dict]

class PredictionResponse(BaseModel):
    probability: float
    explanation: str

@router.post("/predict", response_model=PredictionResponse)
async def predict_game(game_data: GameData):
    try:
        # Simple prediction logic based on team ratings and form
        home_strength = (game_data.home_team_rating * 0.4 + 
                        game_data.home_team_form * 0.4 + 
                        game_data.home_team_rest_days * 0.2)
        
        away_strength = (game_data.away_team_rating * 0.4 + 
                        game_data.away_team_form * 0.4 + 
                        game_data.away_team_rest_days * 0.2)
        
        total_strength = home_strength + away_strength
        win_probability = home_strength / total_strength if total_strength > 0 else 0.5
        
        # Add some randomness to make predictions more interesting
        win_probability = min(max(win_probability + random.uniform(-0.1, 0.1), 0.1), 0.9)
        
        explanation = f"Based on team ratings, recent form, and rest days, {game_data.home_team} has a {win_probability:.1%} chance of winning against {game_data.away_team}."
        
        return PredictionResponse(
            probability=win_probability,
            explanation=explanation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train")
async def train_model(training_data: List[GameData]):
    try:
        predictor.train([data.dict() for data in training_data])
        return {"message": "Model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 