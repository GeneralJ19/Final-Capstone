from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Player and game information
    player_name = Column(String)
    team = Column(String)
    opponent = Column(String)
    game_date = Column(DateTime)
    
    # Prop bet information
    prop_type = Column(String)  # e.g., "Points", "Rebounds", "Passing Yards", "Strikeouts"
    prop_value = Column(Float)
    prediction = Column(Float)
    confidence = Column(Float)
    
    # Odds information
    odds = Column(JSON)  # Store as {"over": 1.91, "under": 1.91}
    
    # Performance tracking
    actual_result = Column(Float, nullable=True)
    prediction_correct = Column(Boolean, nullable=True)
    
    # Additional data
    features = Column(JSON)  # Store player stats, matchup data, etc.
    recent_performance = Column(JSON)  # Store last 5 games performance
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="predictions") 