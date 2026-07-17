"""AI router for harvest prediction endpoint."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.farm import Farm
from app.models.prediction import Prediction, Priority, DiseaseStatus
from app.models.image import Image
from app.schemas.prediction import PredictionResponse
from app.schemas.common import HIEOutput
from app.services.ai_service import call_ai_api
from app.services.hie_service import run_hie
from app.services.weather_service import get_latest_weather
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["AI"])


class AIPredictRequest(BaseModel):
    farm_id: int
    image_url: str


@router.post("/predict", response_model=PredictionResponse)
def predict_harvest(
    request: AIPredictRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run AI prediction on an uploaded image.
    
    This endpoint:
    1. Calls the AI service to analyze the image
    2. Gets weather data
    3. Runs the HIE rule engine
    4. Saves the prediction to the database
    5. Returns the full recommendation
    """
    # Verify farm exists
    farm = db.query(Farm).filter(Farm.id == request.farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    try:
        # Step 1: Call AI service
        ai_result = call_ai_api(request.image_url)
        
        # Step 2: Get weather data
        weather = get_latest_weather(db)
        temperature = weather.temperature if weather else None
        humidity = weather.humidity if weather else None
        
        # Step 3: Run HIE rule engine
        hie_result = run_hie(
            ripeness=ai_result.get("ripeness", 50),
            fruit_count=ai_result.get("fruit_count", 0),
            disease=ai_result.get("disease", "HEALTHY"),
            confidence=ai_result.get("confidence", 0.5),
            temperature=temperature,
            humidity=humidity,
        )
        
        # Step 4: Save prediction to database
        prediction = Prediction(
            farm_id=request.farm_id,
            ripeness=ai_result.get("ripeness", 50),
            fruit_count=ai_result.get("fruit_count", 0),
            disease=DiseaseStatus(ai_result.get("disease", "HEALTHY")),
            confidence=ai_result.get("confidence", 0.5),
            recommendation=hie_result.get("recommendation"),
            priority=Priority(hie_result.get("harvest_priority")),
            reason=hie_result.get("reason"),
            harvest_readiness=hie_result.get("harvest_readiness"),
            disease_risk=hie_result.get("disease_risk"),
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return prediction
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/health")
def ai_health_check():
    """Health check endpoint for AI service."""
    return {"status": "healthy", "service": "ai"}