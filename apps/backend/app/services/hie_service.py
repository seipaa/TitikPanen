"""Harvest Intelligence Engine (HIE) - Rule-Based Expert System."""

from typing import Dict, Any, Optional
from app.models.prediction import Priority, DiseaseStatus


def run_hie(
    ripeness: float,
    fruit_count: int,
    disease: str,
    confidence: float,
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    rain_forecast: Optional[float] = None,
    weather_warning: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Run the Harvest Intelligence Engine rule-based system.
    
    This function processes AI predictions and weather data to generate
    harvest recommendations and priority levels.
    
    Args:
        ripeness: Ripeness percentage (0-100)
        fruit_count: Number of fruits detected
        disease: Disease status string
        confidence: AI confidence score (0-1)
        temperature: Current temperature in Celsius
        humidity: Current humidity percentage
        rain_forecast: Rain probability (0-1)
        weather_warning: Weather warning text
        
    Returns:
        Dict with harvest_readiness, harvest_priority, disease_risk, 
        recommendation, and reason
    """
    # Calculate base harvest readiness
    harvest_readiness = calculate_harvest_readiness(ripeness, fruit_count)
    
    # Determine priority and recommendation based on rules
    priority = Priority.MEDIUM
    recommendation = "Continue Monitoring"
    reason = "No specific conditions detected"
    disease_risk = "LOW"
    
    # Track all applicable rules for detailed reasoning
    rule_reasons = []
    
    # === RULE R1: High Readiness + Heavy Rain ===
    # IF harvest_readiness > 80 AND (weather_warning == "heavy_rain" OR rain_forecast > 0.7)
    if harvest_readiness > 80 and (
        weather_warning and "rain" in weather_warning.lower()
    ) or (rain_forecast is not None and rain_forecast > 0.7):
        priority = Priority.HIGH
        recommendation = "Harvest Earlier"
        reason = "Heavy rain predicted within 24 hours"
        rule_reasons.append(reason)
    
    # === RULE R2: Low Readiness ===
    # IF harvest_readiness < 50
    elif harvest_readiness < 50:
        priority = Priority.LOW
        recommendation = "Continue Monitoring"
        reason = "Plant not yet ready for harvest"
        rule_reasons.append(reason)
    
    # === RULE R3: Disease Detection ===
    # IF disease == "ANTHRACNOSE" OR "PHYTOPHTHORA"
    if disease in ["ANTHRACNOSE", "PHYTOPHTHORA"]:
        priority = Priority.HIGH
        recommendation = "Disease Alert"
        reason = f"Disease detected: {disease}. Immediate action required."
        disease_risk = "HIGH"
        rule_reasons.append(f"Disease: {disease}")
    
    # === RULE R4: High Humidity + Disease Risk ===
    # IF humidity > 90 AND disease != "HEALTHY"
    elif humidity is not None and humidity > 90 and disease != "HEALTHY":
        priority = Priority.HIGH
        recommendation = "Inspect Field"
        reason = "High humidity increases disease spread risk"
        disease_risk = "HIGH"
        rule_reasons.append("High humidity risk")
    
    # === RULE R5: Optimal Conditions ===
    # IF harvest_readiness > 70 AND weather is good
    elif harvest_readiness > 70:
        weather_ok = weather_warning is None or weather_warning == ""
        if weather_ok:
            priority = Priority.MEDIUM
            recommendation = "Ready for Harvest"
            reason = "Optimal conditions for harvesting"
            rule_reasons.append("Optimal conditions")
    
    # === RULE R7: Rain Forecast + Medium Readiness ===
    # IF rain_forecast > 0.7 AND readiness > 60
    if (
        rain_forecast is not None 
        and rain_forecast > 0.7 
        and harvest_readiness > 60
        and priority != Priority.HIGH
    ):
        priority = Priority.HIGH
        recommendation = "Harvest Earlier"
        reason = f"Rain forecast ({rain_forecast*100:.0f}%) - harvest now to avoid damage"
        rule_reasons.append("Rain forecast warning")
    
    # === RULE R6: Low AI Confidence ===
    # IF confidence < 0.6, reduce priority and add warning
    if confidence < 0.6:
        reason += " (Low AI confidence - manual inspection recommended)"
        # Reduce priority by one level (if not already HIGH)
        if priority == Priority.MEDIUM:
            priority = Priority.LOW
        elif priority == Priority.LOW:
            priority = Priority.LOW  # Already lowest
    
    # === RULE R8: Heat Stress ===
    # IF temperature > 35
    if temperature is not None and temperature > 35:
        if reason:
            reason += f". Heat stress warning: {temperature}°C"
        else:
            reason = f"Heat stress warning: {temperature}°C"
        rule_reasons.append("Heat stress")
    
    # === Calculate Disease Risk ===
    if disease == "HEALTHY":
        disease_risk = "LOW"
    elif disease in ["ANTHRACNOSE", "PHYTOPHTHORA"]:
        disease_risk = "HIGH"
    elif disease in ["POWDERY_MILDEW", "OTHER"]:
        disease_risk = "MEDIUM"
    
    # High humidity with disease
    if humidity is not None and humidity > 85 and disease != "HEALTHY":
        disease_risk = "HIGH"
    
    # Final recommendation if none matched
    if recommendation == "Continue Monitoring" and not rule_reasons:
        if harvest_readiness > 60:
            recommendation = "Near Harvest"
            reason = f"Harvest readiness at {harvest_readiness:.1f}%"
        else:
            reason = f"Harvest readiness at {harvest_readiness:.1f}%. Continue monitoring."
    
    return {
        "harvest_readiness": round(harvest_readiness, 1),
        "harvest_priority": priority.value,
        "disease_risk": disease_risk,
        "recommendation": recommendation,
        "reason": reason,
    }


def calculate_harvest_readiness(ripeness: float, fruit_count: int) -> float:
    """
    Calculate harvest readiness based on ripeness and fruit count.
    
    Formula:
    - Base readiness from ripeness (weighted 70%)
    - Fruit count factor (weighted 30%)
    """
    # Base ripeness contributes 70%
    ripeness_factor = ripeness * 0.7
    
    # Fruit count factor: optimal count is 15-25
    # Below 10 = low, Above 25 = high but may indicate overripe
    if fruit_count < 10:
        count_factor = fruit_count * 2  # Max 20% contribution
    elif fruit_count > 25:
        count_factor = 30 - (fruit_count - 25) * 2  # Penalty for too many
        count_factor = max(count_factor, 15)
    else:
        count_factor = 30  # Optimal range
    
    # Combine factors
    readiness = ripeness_factor + (count_factor * 0.3)
    
    # Cap at 100
    return min(readiness, 100)