"""AgroMesh AI - FastAPI Backend Application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, seed_default_data
from app.routers import (
    auth_router,
    upload_router,
    ai_router,
    weather_router,
    recommendation_router,
    dashboard_router,
    farms_router,
    map_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    print(f"Starting {settings.app_name} v{settings.app_version}")
    init_db()
    print("Database initialized")
    seed_default_data()
    yield
    # Shutdown
    print("Shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Regional Harvest Intelligence Platform - Decision Support System for Smart Chili Harvest Management",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(ai_router)
app.include_router(weather_router)
app.include_router(recommendation_router)
app.include_router(dashboard_router)
app.include_router(farms_router)
app.include_router(map_router)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": "Regional Harvest Intelligence Platform",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }