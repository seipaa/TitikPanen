"""Upload router for handling image uploads from ESP32."""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
import os

from app.database import get_db
from app.models.farm import Farm
from app.models.image import Image
from app.schemas.common import UploadResponse
from app.services.minio_service import upload_image, ensure_bucket_exists
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Upload"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("", response_model=UploadResponse)
async def upload_image_endpoint(
    file: UploadFile = File(...),
    farm_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image from ESP32 or manual upload.
    
    This endpoint:
    1. Saves the image to MinIO
    2. Creates an image record in the database
    3. Returns the image URL and prediction ID
    """
    # Verify farm exists
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    # Read file content
    content = await file.read()
    
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    
    # Validate file size (max 10MB)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    
    try:
        # Ensure MinIO bucket exists
        ensure_bucket_exists()
        
        # Upload to MinIO
        image_url, object_name = upload_image(content, file.filename, farm_id)
        
        # Create image record
        image = Image(
            farm_id=farm_id,
            image_url=image_url,
            object_name=object_name,
            captured_at=datetime.utcnow(),
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        
        return UploadResponse(
            image_url=image_url,
            image_id=image.id,
            message="Image uploaded successfully. Ready for AI prediction."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")