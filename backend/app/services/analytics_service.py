from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import numpy as np
from ..models.user import User
from ..models.predictions import Prediction
import logging
from sklearn.ensemble import RandomForestRegressor

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.models = {}

    def calculate_model_performance(
        self,
        db: Session,
        sport: str,
        time_period: Optional[timedelta] = None
    ) -> Dict:
        """Calculate model performance metrics for a specific sport"""
        query = db.query(Prediction).filter(Prediction.sport == sport)
        
        if time_period:
            cutoff_date = datetime.utcnow() - time_period
            query = query.filter(Prediction.created_at >= cutoff_date)
        
        predictions = query.all()
        if not predictions:
            return {
                "sport": sport,
                "accuracy": 0.0,
                "total_predictions": 0,
                "roi": 0.0
            }

        df = pd.DataFrame([p.to_dict() for p in predictions])
        
        # Calculate accuracy
        accuracy = np.mean(df['was_correct'])
        
        # Calculate ROI
        total_bets = len(df)
        winning_bets = df[df['was_correct']].shape[0]
        total_returns = df[df['was_correct']]['odds'].sum()
        roi = (total_returns - total_bets) / total_bets * 100

        return {
            "sport": sport,
            "accuracy": float(accuracy),
            "total_predictions": total_bets,
            "winning_predictions": winning_bets,
            "roi": float(roi),
            "average_odds": float(df['odds'].mean()),
            "profit_loss": float(total_returns - total_bets)
        }

    def get_user_performance(
        self,
        db: Session,
        user_id: int,
        time_period: Optional[timedelta] = None
    ) -> Dict:
        """Get performance metrics for a specific user"""
        query = db.query(User).filter(User.id == user_id)
        user = query.first()
        
        if not user:
            return None

        bet_query = db.query(Prediction).filter(Prediction.user_id == user_id)
        if time_period:
            cutoff_date = datetime.utcnow() - time_period
            bet_query = bet_query.filter(Prediction.created_at >= cutoff_date)

        bets = bet_query.all()
        if not bets:
            return {
                "user_id": user_id,
                "total_bets": 0,
                "winning_bets": 0,
                "win_rate": 0.0,
                "profit_loss": 0.0,
                "roi": 0.0
            }

        df = pd.DataFrame([b.to_dict() for b in bets])
        
        total_bets = len(df)
        winning_bets = df[df['was_correct']].shape[0]
        win_rate = winning_bets / total_bets
        
        total_stake = df['stake'].sum()
        total_returns = df[df['was_correct']]['stake'].sum() * df[df['was_correct']]['odds']
        profit_loss = total_returns - total_stake
        roi = (profit_loss / total_stake) * 100 if total_stake > 0 else 0

        return {
            "user_id": user_id,
            "total_bets": total_bets,
            "winning_bets": winning_bets,
            "win_rate": float(win_rate),
            "profit_loss": float(profit_loss),
            "roi": float(roi),
            "favorite_sport": self._get_favorite_sport(df),
            "best_sport": self._get_best_performing_sport(df),
            "average_stake": float(df['stake'].mean()),
            "total_stake": float(total_stake),
            "total_returns": float(total_returns)
        }

    def get_sport_insights(
        self,
        db: Session,
        sport: str,
        time_period: Optional[timedelta] = None
    ) -> Dict:
        """Get detailed insights for a specific sport"""
        query = db.query(Prediction).filter(Prediction.sport == sport)
        
        if time_period:
            cutoff_date = datetime.utcnow() - time_period
            query = query.filter(Prediction.created_at >= cutoff_date)

        predictions = query.all()
        if not predictions:
            return {
                "sport": sport,
                "total_games": 0,
                "insights": []
            }

        df = pd.DataFrame([p.to_dict() for p in predictions])
        
        # Analyze home vs away performance
        home_wins = df[df['result'] == 'home'].shape[0]
        away_wins = df[df['result'] == 'away'].shape[0]
        draws = df[df['result'] == 'draw'].shape[0]
        
        # Analyze betting patterns
        favorite_accuracy = df[df['predicted_winner'] == df['result']].shape[0] / len(df)
        underdog_wins = df[
            (df['predicted_winner'] != df['result']) & 
            (df['odds'] > df['odds'].median())
        ].shape[0]

        return {
            "sport": sport,
            "total_games": len(df),
            "home_win_rate": float(home_wins / len(df)),
            "away_win_rate": float(away_wins / len(df)),
            "draw_rate": float(draws / len(df)) if 'draw' in df['result'].unique() else 0.0,
            "favorite_win_rate": float(favorite_accuracy),
            "underdog_wins": underdog_wins,
            "average_odds": float(df['odds'].mean()),
            "highest_odds_win": float(df[df['was_correct']]['odds'].max()),
            "most_common_score": self._get_most_common_score(df),
            "best_betting_time": self._get_best_betting_time(df),
            "value_bets_ratio": self._calculate_value_bets_ratio(df)
        }

    def _get_favorite_sport(self, df: pd.DataFrame) -> str:
        """Get user's most bet on sport"""
        return df['sport'].mode().iloc[0] if not df.empty else None

    def _get_best_performing_sport(self, df: pd.DataFrame) -> Dict:
        """Get user's best performing sport"""
        if df.empty:
            return None
            
        sport_performance = df.groupby('sport').agg({
            'was_correct': 'mean',
            'stake': 'sum',
            'id': 'count'
        }).reset_index()
        
        best_sport = sport_performance.sort_values('was_correct', ascending=False).iloc[0]
        
        return {
            "sport": best_sport['sport'],
            "win_rate": float(best_sport['was_correct']),
            "total_bets": int(best_sport['id'])
        }

    def _get_most_common_score(self, df: pd.DataFrame) -> Dict:
        """Get the most common score for the sport"""
        if 'score' not in df.columns or df.empty:
            return None
            
        return df['score'].mode().iloc[0]

    def _get_best_betting_time(self, df: pd.DataFrame) -> Dict:
        """Analyze best time for placing bets"""
        if df.empty:
            return None
            
        df['hour'] = df['created_at'].dt.hour
        hourly_performance = df.groupby('hour')['was_correct'].mean()
        best_hour = hourly_performance.idxmax()
        
        return {
            "hour": int(best_hour),
            "win_rate": float(hourly_performance[best_hour])
        }

    def _calculate_value_bets_ratio(self, df: pd.DataFrame) -> float:
        """Calculate the ratio of bets that provided value"""
        if df.empty:
            return 0.0
            
        # Value bet: When our predicted probability > implied probability from odds
        df['implied_probability'] = 1 / df['odds']
        value_bets = df[df['confidence'] > df['implied_probability']]
        
        return float(len(value_bets) / len(df))

    async def predict_player_performance(
        self,
        player_name: str,
        recent_performance: Dict[str, Any],
        matchup_data: Dict[str, Any],
        prop_type: str,
        prop_value: float
    ) -> Dict[str, Any]:
        """
        Predict a player's performance for a specific prop bet.
        """
        # Prepare features
        features = self._prepare_features(recent_performance, matchup_data)
        
        # Get or train model for this prop type
        model = await self._get_model(prop_type)
        
        # Make prediction
        prediction = model.predict([features])[0]
        
        # Calculate confidence based on model's prediction variance
        confidence = self._calculate_confidence(model, features)
        
        # Calculate implied odds
        odds = self._calculate_odds(prediction, prop_value, confidence)
        
        return {
            "prediction": float(prediction),
            "confidence": float(confidence),
            "odds": odds,
            "features": features
        }

    def _prepare_features(
        self,
        recent_performance: Dict[str, Any],
        matchup_data: Dict[str, Any]
    ) -> List[float]:
        """
        Prepare features for the prediction model.
        """
        features = []
        
        # Recent performance features
        last_5_games = recent_performance.get("last5Games", [])
        features.extend([
            np.mean(last_5_games),
            np.std(last_5_games),
            np.min(last_5_games),
            np.max(last_5_games),
            last_5_games[0] if last_5_games else 0  # Most recent game
        ])
        
        # Matchup features
        features.extend([
            matchup_data.get("opponent_defense_rating", 0),
            matchup_data.get("home_away_factor", 0),
            matchup_data.get("rest_days", 0),
            matchup_data.get("back_to_back", 0)
        ])
        
        return features

    async def _get_model(self, prop_type: str) -> RandomForestRegressor:
        """
        Get or train a model for the specific prop type.
        """
        if prop_type not in self.models:
            # Train new model using historical data
            historical_data = await self._get_historical_data(prop_type)
            model = self._train_model(historical_data)
            self.models[prop_type] = model
        
        return self.models[prop_type]

    async def _get_historical_data(self, prop_type: str) -> pd.DataFrame:
        """
        Get historical data for training the model.
        """
        # Query predictions with actual results
        predictions = self.db.query(Prediction).filter(
            Prediction.prop_type == prop_type,
            Prediction.actual_result.isnot(None)
        ).all()
        
        # Convert to DataFrame
        data = []
        for pred in predictions:
            features = pred.features
            features["actual_result"] = pred.actual_result
            data.append(features)
        
        return pd.DataFrame(data)

    def _train_model(self, data: pd.DataFrame) -> RandomForestRegressor:
        """
        Train a RandomForest model on the historical data.
        """
        X = data.drop("actual_result", axis=1)
        y = data["actual_result"]
        
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X, y)
        
        return model

    def _calculate_confidence(
        self,
        model: RandomForestRegressor,
        features: List[float]
    ) -> float:
        """
        Calculate prediction confidence based on model's prediction variance.
        """
        # Get predictions from all trees
        predictions = []
        for tree in model.estimators_:
            predictions.append(tree.predict([features])[0])
        
        # Calculate confidence based on variance
        variance = np.var(predictions)
        max_variance = np.var(model.predict([[0] * len(features)]))
        confidence = 1 - (variance / max_variance)
        
        return max(0, min(1, confidence))

    def _calculate_odds(
        self,
        prediction: float,
        prop_value: float,
        confidence: float
    ) -> Dict[str, float]:
        """
        Calculate implied odds for over/under based on prediction and confidence.
        """
        # Base probability on prediction vs prop value
        if prediction > prop_value:
            over_prob = 0.5 + (confidence * 0.4)  # Max 90% probability
            under_prob = 1 - over_prob
        else:
            under_prob = 0.5 + (confidence * 0.4)  # Max 90% probability
            over_prob = 1 - under_prob
        
        # Convert to American odds
        def to_american_odds(prob: float) -> float:
            if prob >= 0.5:
                return -100 * prob / (1 - prob)
            else:
                return 100 * (1 - prob) / prob
        
        return {
            "over": round(to_american_odds(over_prob), 2),
            "under": round(to_american_odds(under_prob), 2)
        } 