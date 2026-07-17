export type UserRole = "FARMER" | "COOPERATIVE" | "FOOD_AUTHORITY";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type DiseaseStatus = "HEALTHY" | "ANTHRACNOSE" | "PHYTOPHTHORA" | "POWDERY_MILDEW" | "OTHER";
export type MapStatus = "healthy" | "near" | "ready" | "disease";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    farm_id: number | null;
    created_at: string;
}

export interface Farm {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    variety: string;
    owner: string;
    user_id: number | null;
    created_at: string;
}

export interface Prediction {
    id: number;
    farm_id: number;
    ripeness: number;
    fruit_count: number;
    disease: DiseaseStatus;
    confidence: number;
    recommendation: string | null;
    priority: Priority | null;
    reason: string | null;
    harvest_readiness: number | null;
    disease_risk: string | null;
    created_at: string;
}

export interface Weather {
    temperature: number | null;
    humidity: number | null;
    rain: number | null;
    wind: number | null;
    warning: string | null;
    weather_desc: string | null;
    location: string | null;
    timestamp: string | null;
}

export interface MapMarker {
    farm_id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: MapStatus | string;
    priority: Priority | string | null;
    latest_prediction: {
        ripeness: number | null;
        fruit_count: number | null;
        harvest_readiness: number | null;
        disease_risk: string | null;
    } | null;
}

export interface DashboardData {
    total_farms: number;
    ready_harvest_count: number;
    near_harvest_count: number;
    disease_alerts: number;
    weather_alerts: number;
    predictions: Prediction[];
    recommendations: Recommendation[];
    map_markers: MapMarker[];
}

export interface Recommendation {
    farm_id: number;
    farm_name: string;
    priority: Priority;
    recommendation: string;
    reason: string;
    harvest_readiness: number;
    disease_risk: string | null;
    created_at: string;
}

export interface FarmDetail {
    farm: Farm;
    latest_prediction: Prediction | null;
    predictions_history: Prediction[];
    images: Image[];
}

export interface Image {
    id: number;
    farm_id: number;
    image_url: string;
    captured_at: string | null;
    created_at: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}