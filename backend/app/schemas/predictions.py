from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional

class PredictionBase(BaseModel):
    player_name: str
    team: str
    opponent: str
    game_date: datetime
    prop_type: str
    prop_value: float

class PredictionCreate(PredictionBase):
    pass

class PredictionUpdate(BaseModel):
    actual_result: float

class PredictionResponse(PredictionBase):
    id: int
    user_id: int
    prediction: float
    confidence: float
    odds: Dict[str, float]
    features: Dict[str, Any]
    recent_performance: Dict[str, Any]
    actual_result: Optional[float] = None
    prediction_correct: Optional[bool] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PredictionStats(BaseModel):
    total_predictions: int
    correct_predictions: int
    accuracy: float
    average_confidence: float
    prop_type_stats: Dict[str, Dict[str, Any]] 