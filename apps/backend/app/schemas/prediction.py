"""Prediction Pydantic schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.prediction import Priority, DiseaseStatus


class PredictionBase(BaseModel):
    """Base prediction schema."""
    ripeness: float = Field(..., ge=0, le=100)
    fruit_count: int = Field(..., ge=0)
    disease: DiseaseStatus = DiseaseStatus.HEALTHY
    confidence: float = Field(..., ge=0, le=1)


class PredictionCreate(PredictionBase):
    """Schema for creating a new prediction."""
    farm_id: int


class PredictionResponse(PredictionBase):
    """Schema for prediction response."""
    id: int
    farm_id: int
    recommendation: Optional[str] = None
    priority: Optional[Priority] = None
    reason: Optional[str] = None
    harvest_readiness: Optional[float] = None
    disease_risk: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionWithFarm(PredictionResponse):
    """Schema for prediction with farm details."""
    farm_name: Optional[str] = None
    farm_latitude: Optional[float] = None
    farm_longitude: Optional[float] = None