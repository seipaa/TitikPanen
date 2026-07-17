"""Farm Pydantic schemas."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.models.prediction import Prediction


class FarmBase(BaseModel):
    """Base farm schema."""
    name: str = Field(..., min_length=1, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    variety: str = Field(default="Cabai", max_length=100)
    owner: str = Field(..., min_length=1, max_length=255)


class FarmCreate(FarmBase):
    """Schema for creating a new farm."""
    user_id: Optional[int] = None


class FarmUpdate(BaseModel):
    """Schema for updating a farm."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    variety: Optional[str] = Field(None, max_length=100)
    owner: Optional[str] = Field(None, min_length=1, max_length=255)


class FarmResponse(FarmBase):
    """Schema for farm response."""
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FarmWithPrediction(FarmResponse):
    """Schema for farm with latest prediction."""
    latest_prediction: Optional["PredictionResponse"] = None
    total_predictions: int = 0