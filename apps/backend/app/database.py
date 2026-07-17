"""Database configuration and session management."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Create engine based on DATABASE_URL
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=settings.debug,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def seed_default_data():
    """Seed default users, farms, predictions, images, and weather for testing."""
    from app.models.user import User
    from app.models.farm import Farm
    from app.models.prediction import Prediction
    from app.models.image import Image
    from app.models.weather import Weather
    from app.services.auth_service import hash_password
    from datetime import datetime, timedelta

    db = SessionLocal()
    try:
        # Check if farms already exist
        existing_farm = db.query(Farm).first()
        if existing_farm:
            print("Default data already exists, skipping seed.")
            return

        # Create sample farms - all in Cianjur, West Java (agricultural area)
        # Coordinates around Cianjur: -6.80xx to -6.82xx, 107.00xx to 107.03xx
        sample_farms = [
            {
                "name": "Lahan Cabai Pak Budi",
                "latitude": -6.8145,
                "longitude": 107.0275,
                "variety": "Cabai Merah Besar",
                "owner": "Pak Budi Santoso",
            },
            {
                "name": "Kebun Cabai Siti",
                "latitude": -6.8090,
                "longitude": 107.0310,
                "variety": "Cabai Rawit",
                "owner": "Siti Aminah",
            },
            {
                "name": "Lahan Cabai Pak Ahmad",
                "latitude": -6.8180,
                "longitude": 107.0220,
                "variety": "Cabai Merah Keriting",
                "owner": "Pak Ahmad Hidayat",
            },
            {
                "name": "Kebun Cabai Ibu Dewi",
                "latitude": -6.8055,
                "longitude": 107.0285,
                "variety": "Cabai Hijau",
                "owner": "Ibu Dewi Rahayu",
            },
            {
                "name": "Lahan Cabai Pak Hasan",
                "latitude": -6.8120,
                "longitude": 107.0180,
                "variety": "Cabai Merah",
                "owner": "Pak Hasan Wijaya",
            },
        ]

        created_farms = []
        for farm_data in sample_farms:
            farm = Farm(**farm_data)
            db.add(farm)
            created_farms.append(farm)

        db.commit()

        # Refresh to get IDs
        for farm in created_farms:
            db.refresh(farm)

        # Dummy image URLs from Unsplash (free chili/plant images)
        dummy_images = [
            "https://images.unsplash.com/photo-1598511726623-d2194faa8b3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
        ]

        # Create sample images for each farm
        for idx, farm in enumerate(created_farms):
            for img_idx in range(2):  # 2 images per farm
                image = Image(
                    farm_id=farm.id,
                    image_url=dummy_images[idx],
                    captured_at=datetime.now() - timedelta(days=img_idx * 3),
                )
                db.add(image)

        db.commit()

        # Create sample predictions for each farm
        prediction_configs = [
            # Farm 0 - Ready Harvest (89%)
            {"ripeness": 89.0, "fruit_count": 48, "disease": "HEALTHY", "confidence": 0.93},
            # Farm 1 - Near Harvest (67%)
            {"ripeness": 67.0, "fruit_count": 35, "disease": "HEALTHY", "confidence": 0.87},
            # Farm 2 - Ready Harvest (92%) - Heavy rain warning
            {"ripeness": 92.0, "fruit_count": 52, "disease": "HEALTHY", "confidence": 0.95},
            # Farm 3 - Disease Alert - Anthracnose
            {"ripeness": 55.0, "fruit_count": 30, "disease": "ANTHRACNOSE", "confidence": 0.85},
            # Farm 4 - Healthy (42%)
            {"ripeness": 42.0, "fruit_count": 28, "disease": "HEALTHY", "confidence": 0.84},
        ]

        for idx, farm in enumerate(created_farms):
            config = prediction_configs[idx]
            
            # Calculate harvest_readiness based on ripeness
            harvest_readiness = config["ripeness"] * 0.9 + (config["fruit_count"] / 100) * 10
            
            # Determine priority and recommendation
            if config["disease"] != "HEALTHY":
                priority = "HIGH"
                recommendation = "Disease Alert - Inspect Field"
                reason = f"Disease detected: {config['disease']}"
            elif harvest_readiness > 80:
                priority = "HIGH"
                recommendation = "Harvest Earlier"
                reason = "Ready for harvest - Heavy rain forecast tomorrow"
            elif harvest_readiness > 60:
                priority = "MEDIUM"
                recommendation = "Ready for Harvest"
                reason = "Optimal harvest conditions"
            elif harvest_readiness > 40:
                priority = "LOW"
                recommendation = "Continue Monitoring"
                reason = "Plants still developing"
            else:
                priority = "LOW"
                recommendation = "Continue Monitoring"
                reason = "Early growth stage"

            prediction = Prediction(
                farm_id=farm.id,
                ripeness=config["ripeness"],
                fruit_count=config["fruit_count"],
                disease=config["disease"],
                confidence=config["confidence"],
                recommendation=recommendation,
                priority=priority,
                reason=reason,
                harvest_readiness=harvest_readiness,
                disease_risk="HIGH" if config["disease"] != "HEALTHY" else "LOW",
                created_at=datetime.now() - timedelta(days=idx * 2),
            )
            db.add(prediction)

        db.commit()

        # Create sample weather data
        weather = Weather(
            temperature=28.5,
            humidity=78.0,
            rain=45.0,
            wind=12.0,
            warning="Heavy rain forecast tomorrow - Consider early harvest",
            weather_desc="Partly Cloudy",
            location="Cianjur, Jawa Barat",
            latitude=-6.8100,
            longitude=107.0250,
            timestamp=datetime.now().isoformat(),
        )
        db.add(weather)
        db.commit()

        # Create default users
        default_users = [
            {
                "name": "Admin AgroMesh",
                "email": "admin@agromesh.ai",
                "password": "admin123",
                "role": "FARMER",
                "farm_id": created_farms[0].id if len(created_farms) > 0 else None,
            },
            {
                "name": "Petani Cabai Siti",
                "email": "petani@agromesh.ai",
                "password": "petani123",
                "role": "FARMER",
                "farm_id": created_farms[1].id if len(created_farms) > 1 else None,
            },
            {
                "name": "Koperasi Tani Cianjur",
                "email": "koperasi@agromesh.ai",
                "password": "koperasi123",
                "role": "COOPERATIVE",
                "farm_id": None,
            },
            {
                "name": "Dinas Pertanian Cianjur",
                "email": "dinas@agromesh.ai",
                "password": "dinas123",
                "role": "FOOD_AUTHORITY",
                "farm_id": None,
            },
        ]

        for user_data in default_users:
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                hashed_password=hash_password(user_data["password"]),
                role=user_data["role"],
                farm_id=user_data["farm_id"],
            )
            db.add(user)

        db.commit()
        print("Default data seeded successfully!")
        print("Default users:")
        for user_data in default_users:
            print(f"  - {user_data['email']} / {user_data['password']}")
        print(f"Created {len(created_farms)} sample farms with predictions and images")
        print(f"Location: Cianjur, Jawa Barat (agricultural area)")

    except Exception as e:
        print(f"Error seeding data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()