from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Profile fields
    balance = Column(Float, default=0.0)
    total_bets = Column(Integer, default=0)
    successful_bets = Column(Integer, default=0)
    win_rate = Column(Float, default=0.0)
    favorite_sport = Column(String, nullable=True)
    betting_preferences = Column(String, nullable=True)  # JSON string of preferences
    
    # Relationships
    predictions = relationship("Prediction", back_populates="user") 