"""User database model."""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    FARMER = "FARMER"
    COOPERATIVE = "COOPERATIVE"
    FOOD_AUTHORITY = "FOOD_AUTHORITY"


class User(Base):
    """User model for authentication and authorization."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.FARMER)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to Farm - User owns the foreign key
    farm = relationship("Farm", foreign_keys=[farm_id])