"""API Routers package."""
from app.routers.auth import router as auth_router
from app.routers.upload import router as upload_router
from app.routers.ai import router as ai_router
from app.routers.weather import router as weather_router
from app.routers.recommendation import router as recommendation_router
from app.routers.dashboard import router as dashboard_router
from app.routers.farms import router as farms_router
from app.routers.map import router as map_router

__all__ = [
    "auth_router",
    "upload_router",
    "ai_router",
    "weather_router",
    "recommendation_router",
    "dashboard_router",
    "farms_router",
    "map_router",
]