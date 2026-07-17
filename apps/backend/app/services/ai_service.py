"""AI service for harvest prediction integration."""
import random
from typing import Dict, Any
import requests

from app.config import settings


def call_ai_api(image_url: str) -> Dict[str, Any]:
    """
    Call the AI service to get harvest predictions.
    
    This function is designed to be replaced with a real AI integration.
    Currently returns realistic mock data for demo purposes.
    
    Returns:
        Dict containing: ripeness, fruit_count, disease, confidence
    """
    # Check if we have a real AI endpoint configured
    if settings.ai_api_url and settings.ai_api_url != "http://localhost:8001/predict":
        try:
            response = requests.post(
                settings.ai_api_url,
                json={"image_url": image_url},
                headers={"Authorization": f"Bearer {settings.ai_api_key}"} if settings.ai_api_key else {},
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"AI API call failed, using mock data: {e}")
    
    # Return realistic mock data for demo
    # In production, this would be replaced with actual AI inference
    return generate_mock_prediction()


def generate_mock_prediction() -> Dict[str, Any]:
    """Generate realistic mock prediction data for demo."""
    # Simulate different harvest scenarios
    scenarios = [
        {"ripeness": 87.5, "fruit_count": 18, "disease": "HEALTHY", "confidence": 0.94},
        {"ripeness": 72.3, "fruit_count": 15, "disease": "HEALTHY", "confidence": 0.91},
        {"ripeness": 45.8, "fruit_count": 22, "disease": "HEALTHY", "confidence": 0.88},
        {"ripeness": 91.2, "fruit_count": 12, "disease": "HEALTHY", "confidence": 0.96},
        {"ripeness": 78.6, "fruit_count": 19, "disease": "ANTHRACNOSE", "confidence": 0.89},
        {"ripeness": 65.4, "fruit_count": 16, "disease": "POWDERY_MILDEW", "confidence": 0.85},
        {"ripeness": 55.2, "fruit_count": 20, "disease": "HEALTHY", "confidence": 0.92},
        {"ripeness": 83.7, "fruit_count": 14, "disease": "HEALTHY", "confidence": 0.95},
    ]
    
    return random.choice(scenarios)