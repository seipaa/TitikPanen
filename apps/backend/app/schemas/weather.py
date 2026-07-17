"""Weather Pydantic schemas."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WeatherResponse(BaseModel):
    """Schema for weather response."""
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rain: Optional[float] = None
    wind: Optional[float] = None
    warning: Optional[str] = None
    weather_code: Optional[str] = None
    weather_desc: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True


class WeatherCacheResponse(BaseModel):
    """Schema for cached weather data."""
    id: int
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rain: Optional[float] = None
    wind: Optional[float] = None
    warning: Optional[str] = None
    weather_desc: Optional[str] = None
    location: Optional[str] = None
    timestamp: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True