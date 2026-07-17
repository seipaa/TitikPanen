"""Weather router for BMKG weather data."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.weather import WeatherResponse, WeatherCacheResponse
from app.services.weather_service import (
    fetch_bmkg_weather, cache_weather, get_latest_weather
)
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/weather", tags=["Weather"])


@router.get("", response_model=WeatherCacheResponse)
def get_weather(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get cached weather data.
    Falls back to fetching from BMKG if no cached data.
    """
    weather = get_latest_weather(db)
    if weather:
        return weather
    
    # If no cached data, return empty response
    return {
        "id": 0,
        "temperature": None,
        "humidity": None,
        "rain": None,
        "wind": None,
        "warning": None,
        "weather_desc": "No data available",
        "location": None,
        "timestamp": None,
        "created_at": None,
    }


@router.get("/refresh", response_model=WeatherResponse)
def refresh_weather(
    lat: Optional[float] = Query(default=-6.2, description="Latitude"),
    lon: Optional[float] = Query(default=106.8, description="Longitude"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Force refresh weather data from BMKG API.
    
    Source: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia)
    API: https://api.bmkg.go.id
    """
    # Fetch fresh data from BMKG
    weather_data = fetch_bmkg_weather(lat, lon)
    
    # Cache the weather data
    weather = cache_weather(db, weather_data, lat, lon)
    
    return weather


@router.get("/current", response_model=WeatherResponse)
def get_current_weather(
    lat: float = Query(default=-6.2, description="Latitude"),
    lon: float = Query(default=106.8, description="Longitude"),
):
    """
    Get current weather from BMKG without caching.
    
    Source: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia)
    API: https://api.bmkg.go.id
    """
    return fetch_bmkg_weather(lat, lon)