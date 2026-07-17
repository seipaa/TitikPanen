"""Image database model."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Image(Base):
    """Image model for captured plant photos."""
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    object_name = Column(String(500), nullable=True)  # MinIO object name
    captured_at = Column(DateTime, nullable=True)  # When the photo was taken
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farm = relationship("Farm", back_populates="images")