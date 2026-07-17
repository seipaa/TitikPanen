"""Farm database model."""
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Farm(Base):
    """Farm model representing agricultural land."""
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    variety = Column(String(100), nullable=False, default="Cabai")
    owner = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships - Farm doesn't need to know about User
    # The User model has the foreign key pointing to Farm
    predictions = relationship("Prediction", back_populates="farm", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="farm", cascade="all, delete-orphan")