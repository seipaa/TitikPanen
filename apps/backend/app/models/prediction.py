"""Prediction database model."""
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class Priority(str, enum.Enum):
    """Priority enumeration for harvest recommendations."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class DiseaseStatus(str, enum.Enum):
    """Disease status enumeration."""
    HEALTHY = "HEALTHY"
    ANTHRACNOSE = "ANTHRACNOSE"
    PHYTOPHTHORA = "PHYTOPHTHORA"
    POWDERY_MILDEW = "POWDERY_MILDEW"
    OTHER = "OTHER"


class Prediction(Base):
    """Prediction model for AI harvest analysis results."""
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    ripeness = Column(Float, nullable=False)  # 0-100 percentage
    fruit_count = Column(Integer, nullable=False)
    disease = Column(SQLEnum(DiseaseStatus), nullable=False, default=DiseaseStatus.HEALTHY)
    confidence = Column(Float, nullable=False)  # 0-1 AI confidence score
    recommendation = Column(String(500), nullable=True)
    priority = Column(SQLEnum(Priority), nullable=True)
    reason = Column(String(500), nullable=True)
    harvest_readiness = Column(Float, nullable=True)  # Calculated by HIE
    disease_risk = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    farm = relationship("Farm", back_populates="predictions")