"""Weather database model."""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime

from app.database import Base


class Weather(Base):
    """Weather model for BMKG weather data cache."""
    __tablename__ = "weather"

    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=True)  # Celsius
    humidity = Column(Float, nullable=True)  # Percentage
    rain = Column(Float, nullable=True)  # Rain probability 0-1
    wind = Column(Float, nullable=True)  # Wind speed m/s
    warning = Column(Text, nullable=True)  # Weather warning text
    weather_code = Column(String(50), nullable=True)  # BMKG weather code
    weather_desc = Column(String(255), nullable=True)  # Weather description
    location = Column(String(255), nullable=True)  # Location name
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    timestamp = Column(DateTime, nullable=True)  # When data was fetched
    created_at = Column(DateTime, default=datetime.utcnow)