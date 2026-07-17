"""User Pydantic schemas."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

from app.models.user import UserRole


class UserBase(BaseModel):
    """Base user schema."""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.FARMER
    farm_id: Optional[int] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    role: UserRole
    farm_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: Optional[int] = None