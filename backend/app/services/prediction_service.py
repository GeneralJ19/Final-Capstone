import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List, Optional, Any
import joblib
import os
import openai
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from app.models.predictions import Prediction
from app.services.analytics_service import AnalyticsService
from app.services.data_service import DataService

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self, db: Session):
        self.db = db
        self.analytics_service = AnalyticsService(db)
        self.data_service = DataService(db)
        self.models = {}
        self.model_path = "models"
        os.makedirs(self.model_path, exist_ok=True)
        
        # Initialize OpenAI client with environment variable
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
            logger.info("OpenAI API key loaded successfully")
        else:
            logger.warning("OpenAI API key not found in environment variables")

    def train_model(self, sport: str, training_data: pd.DataFrame):
        """
        Train a model for a specific sport
        """
        # TODO: Implement proper feature engineering
        X = training_data.drop(['result'], axis=1)
        y = training_data['result']
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Save the model
        model_path = os.path.join(self.model_path, f"{sport}_model.joblib")
        joblib.dump(model, model_path)
        self.models[sport] = model
        
        return {"message": f"Model trained successfully for {sport}"}

    def predict_game(self, sport: str, game_features: Dict) -> Dict:
        """
        Make a prediction for a specific game
        """
        if sport not in self.models:
            # Load model if not in memory
            model_path = os.path.join(self.model_path, f"{sport}_model.joblib")
            if os.path.exists(model_path):
                self.models[sport] = joblib.load(model_path)
            else:
                return {"error": f"No model available for {sport}"}

        # Convert features to numpy array
        features = np.array([list(game_features.values())])
        
        # Make prediction
        prediction = self.models[sport].predict_proba(features)[0]
        
        # Get AI reasoning for the prediction
        reasoning = self.get_ai_reasoning(sport, game_features, prediction)
        
        return {
            "sport": sport,
            "prediction": {
                "home_win_probability": float(prediction[1]),
                "away_win_probability": float(prediction[0]),
                "confidence": float(max(prediction))
            },
            "reasoning": reasoning
        }

    def get_ai_reasoning(self, sport: str, features: Dict, prediction: np.ndarray) -> str:
        """
        Get AI reasoning for the prediction using OpenAI's API
        """
        if not self.openai_api_key:
            return "AI reasoning unavailable: API key not configured"

        try:
            # Prepare the prompt for OpenAI
            prompt = f"""
            Analyze this {sport} match prediction:
            
            Home Team Rating: {features['home_team_rating']}
            Away Team Rating: {features['away_team_rating']}
            Home Team Form: {features['home_team_form']}
            Away Team Form: {features['away_team_form']}
            
            Prediction:
            - Home Win Probability: {prediction[1]:.2%}
            - Away Win Probability: {prediction[0]:.2%}
            - Confidence: {max(prediction):.2%}
            
            Provide a detailed analysis of why this prediction was made, considering:
            1. Team form and recent performance
            2. Historical matchups
            3. Key factors influencing the prediction
            4. Potential risks or uncertainties
            
            Format the response in a clear, professional manner suitable for a sports betting platform.
            """

            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert sports analyst providing detailed match predictions and analysis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )

            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"Error getting AI reasoning: {str(e)}")
            return "AI reasoning unavailable at this time."

    def get_model_performance(self, sport: str) -> Dict:
        """
        Get performance metrics for a specific model
        """
        # TODO: Implement model performance tracking
        return {
            "sport": sport,
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "f1_score": 0.0
        }

    async def generate_player_prediction(
        self,
        player_name: str,
        team: str,
        opponent: str,
        game_date: datetime,
        prop_type: str,
        prop_value: float,
        user_id: int
    ) -> Prediction:
        """
        Generate a prediction for a player's performance in a specific game.
        """
        # Get player's recent performance data
        recent_performance = await self.data_service.get_player_recent_performance(
            player_name=player_name,
            team=team,
            prop_type=prop_type
        )

        # Get matchup data
        matchup_data = await self.data_service.get_matchup_data(
            team=team,
            opponent=opponent,
            prop_type=prop_type
        )

        # Generate prediction using analytics service
        prediction_result = await self.analytics_service.predict_player_performance(
            player_name=player_name,
            recent_performance=recent_performance,
            matchup_data=matchup_data,
            prop_type=prop_type,
            prop_value=prop_value
        )

        # Create prediction record
        prediction = Prediction(
            user_id=user_id,
            player_name=player_name,
            team=team,
            opponent=opponent,
            game_date=game_date,
            prop_type=prop_type,
            prop_value=prop_value,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            odds=prediction_result["odds"],
            features=prediction_result["features"],
            recent_performance=recent_performance
        )

        self.db.add(prediction)
        self.db.commit()
        self.db.refresh(prediction)

        return prediction

    async def get_user_predictions(
        self,
        user_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        prop_type: Optional[str] = None
    ) -> List[Prediction]:
        """
        Get predictions for a specific user with optional filters.
        """
        query = self.db.query(Prediction).filter(Prediction.user_id == user_id)

        if start_date:
            query = query.filter(Prediction.game_date >= start_date)
        if end_date:
            query = query.filter(Prediction.game_date <= end_date)
        if prop_type:
            query = query.filter(Prediction.prop_type == prop_type)

        return query.order_by(Prediction.game_date.desc()).all()

    async def update_prediction_result(
        self,
        prediction_id: int,
        actual_result: float
    ) -> Prediction:
        """
        Update a prediction with the actual result and determine if it was correct.
        """
        prediction = self.db.query(Prediction).filter(Prediction.id == prediction_id).first()
        if not prediction:
            raise ValueError("Prediction not found")

        prediction.actual_result = actual_result
        prediction.prediction_correct = (
            (prediction.prediction > prediction.prop_value and actual_result > prediction.prop_value) or
            (prediction.prediction < prediction.prop_value and actual_result < prediction.prop_value)
        )

        self.db.commit()
        self.db.refresh(prediction)

        return prediction

    async def get_prediction_stats(self, user_id: int) -> Dict[str, Any]:
        """
        Get statistics about a user's predictions.
        """
        predictions = self.db.query(Prediction).filter(Prediction.user_id == user_id).all()
        
        total_predictions = len(predictions)
        correct_predictions = sum(1 for p in predictions if p.prediction_correct)
        
        # Calculate accuracy by prop type
        prop_type_stats = {}
        for prediction in predictions:
            if prediction.prop_type not in prop_type_stats:
                prop_type_stats[prediction.prop_type] = {
                    "total": 0,
                    "correct": 0
                }
            prop_type_stats[prediction.prop_type]["total"] += 1
            if prediction.prediction_correct:
                prop_type_stats[prediction.prop_type]["correct"] += 1

        # Calculate average confidence
        avg_confidence = sum(p.confidence for p in predictions) / total_predictions if total_predictions > 0 else 0

        return {
            "total_predictions": total_predictions,
            "correct_predictions": correct_predictions,
            "accuracy": correct_predictions / total_predictions if total_predictions > 0 else 0,
            "average_confidence": avg_confidence,
            "prop_type_stats": {
                prop_type: {
                    "total": stats["total"],
                    "correct": stats["correct"],
                    "accuracy": stats["correct"] / stats["total"] if stats["total"] > 0 else 0
                }
                for prop_type, stats in prop_type_stats.items()
            }
        }

# Example usage
if __name__ == "__main__":
    # Create sample data
    data = pd.DataFrame({
        'home_team_rating': [0.8, 0.7, 0.9],
        'away_team_rating': [0.6, 0.8, 0.7],
        'home_team_form': [0.7, 0.6, 0.8],
        'away_team_form': [0.5, 0.7, 0.6],
        'result': [1, 0, 1]
    })
    
    service = PredictionService()
    service.train_model("football", data)
    
    # Make a prediction
    game_features = {
        'home_team_rating': 0.8,
        'away_team_rating': 0.7,
        'home_team_form': 0.75,
        'away_team_form': 0.65
    }
    
    prediction = service.predict_game("football", game_features)
    print(prediction) 