from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import uvicorn
from datetime import datetime, timedelta
from .services.prediction_service import PredictionService
from .services.auth_service import auth_service
from .core.config import settings
from .database import get_db, engine, Base
from .models.user import User
from .schemas.auth import UserCreate, UserResponse, Token, UserUpdate
from .routers import users, predictions, analytics, sports
from . import models
from .routes import prediction

# Comment out database initialization temporarily
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProphetPlay",
    description="AI-powered sports betting prediction platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize prediction service with database session
def get_prediction_service(db: Session = Depends(get_db)) -> PredictionService:
    return PredictionService(db)

# Include routers
app.include_router(users.router)
app.include_router(predictions.router)
app.include_router(analytics.router)
app.include_router(sports.router)
app.include_router(prediction.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to ProphetPlay API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    return auth_service.create_user(db, user)

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(auth_service.get_current_active_user)):
    return current_user

@app.put("/users/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    return auth_service.update_user(db, current_user, user_update)

# Prediction endpoints
@app.get("/predictions/{sport}")
async def get_predictions(
    sport: str,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get predictions for a specific sport
    """
    try:
        prediction_service = get_prediction_service(db)
        predictions = await prediction_service.get_user_predictions(
            user_id=current_user.id,
            prop_type=sport
        )
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions/{sport}/{game_id}")
async def get_game_prediction(
    sport: str,
    game_id: str,
    current_user: User = Depends(auth_service.get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed prediction for a specific game
    """
    try:
        prediction_service = get_prediction_service(db)
        # TODO: Implement actual game prediction logic
        return {"message": "Game prediction endpoint not implemented yet"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development"
    ) 