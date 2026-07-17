"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { FarmDetail, Weather, MapMarker } from "@/types";
import { DynamicMap } from "@/components/map/DynamicMap";
import Link from "next/link";
import { ArrowLeft, Droplets, Thermometer, Wind, AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";

export default function FarmDetailPage() {
    const params = useParams();
    const farmId = params.id as string;
    const [farmDetail, setFarmDetail] = useState<FarmDetail | null>(null);
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmDetail = async () => {
            try {
                const [farmRes, weatherRes] = await Promise.all([
                    api.get<FarmDetail>(`/farms/${farmId}`),
                    api.get<Weather>("/weather")
                ]);
                setFarmDetail(farmRes.data);
                setWeather(weatherRes.data);
            } catch (error) {
                console.error("Failed to fetch farm detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmDetail();
    }, [farmId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading Farm Details...</p>
                </div>
            </div>
        );
    }

    if (!farmDetail) {
        return <div className="text-center text-gray-500 p-8">Farm not found</div>;
    }

    const { farm, latest_prediction, predictions_history, images } = farmDetail;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            healthy: "bg-green-500",
            near: "bg-yellow-500",
            ready: "bg-red-500",
            disease: "bg-gray-800"
        };
        return colors[status] || colors.healthy;
    };

    const getStatusEmoji = (status: string) => {
        const emojis: Record<string, string> = {
            healthy: "🌱",
            near: "🌿",
            ready: "🌶️",
            disease: "⚠️"
        };
        return emojis[status] || emojis.healthy;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            healthy: "Healthy",
            near: "Near Harvest",
            ready: "Ready Harvest",
            disease: "Disease Alert"
        };
        return labels[status] || labels.healthy;
    };

    const determineStatus = () => {
        if (!latest_prediction) return "healthy";
        if (latest_prediction.disease_risk === "HIGH") return "disease";
        if (latest_prediction.harvest_readiness && latest_prediction.harvest_readiness > 70) return "ready";
        if (latest_prediction.harvest_readiness && latest_prediction.harvest_readiness >= 50) return "near";
        return "healthy";
    };

    const status = determineStatus();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">🌶️ {farm.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{farm.variety} • {farm.owner}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-white font-bold ${getStatusColor(status)}`}>
                        {getStatusEmoji(status)} {getStatusLabel(status)}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Top Row: Map + Images */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-bold">📍 Lokasi Lahan</h2>
                            </div>
                            <div className="h-64">
                                <DynamicMap
                                    markers={[{
                                        farm_id: farm.id,
                                        name: farm.name,
                                        latitude: farm.latitude,
                                        longitude: farm.longitude,
                                        status: status,
                                        priority: latest_prediction?.priority || "LOW",
                                        latest_prediction: latest_prediction ? {
                                            ripeness: latest_prediction.ripeness,
                                            fruit_count: latest_prediction.fruit_count,
                                            harvest_readiness: latest_prediction.harvest_readiness,
                                            disease_risk: latest_prediction.disease_risk
                                        } : null
                                    }]}
                                    center={[farm.latitude, farm.longitude]}
                                    zoom={17}
                                    height="h-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-bold">📷 Foto Terbaru</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {images.length > 0 ? (
                                    images.slice(0, 4).map((img, idx) => (
                                        <div key={img.id || idx} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={img.image_url}
                                                alt={`Farm image ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            {img.captured_at && (
                                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {new Date(img.captured_at).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400">No images available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center border-2 border-green-200">
                        <div className="text-4xl font-bold text-green-600">
                            {latest_prediction?.harvest_readiness?.toFixed(0) || 0}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Harvest Readiness</div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${latest_prediction?.harvest_readiness || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 text-center border-2 border-blue-200">
                        <div className="text-4xl font-bold text-blue-600">
                            {latest_prediction?.fruit_count || 0}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Fruit Count</div>
                    </div>

                    <div className={`rounded-xl shadow-sm p-4 text-center border-2 ${latest_prediction?.disease_risk === "HIGH"
                            ? "bg-red-50 border-red-200"
                            : "bg-green-50 border-green-200"
                        }`}>
                        <div className={`text-4xl font-bold ${latest_prediction?.disease_risk === "HIGH" ? "text-red-600" : "text-green-600"
                            }`}>
                            {latest_prediction?.disease_risk || "LOW"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Disease Risk</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 text-center border-2 border-purple-200">
                        <div className="text-4xl font-bold text-purple-600">
                            {latest_prediction?.ripeness?.toFixed(0) || 0}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Ripeness</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 text-center border-2 border-gray-200">
                        <div className="text-4xl font-bold text-gray-700">
                            {(latest_prediction?.confidence || 0) * 100}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Confidence %</div>
                    </div>
                </div>

                {/* Weather + Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weather */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-bold">🌤️ Weather Info</h2>
                            <span className="text-xs text-blue-600 font-medium">📡 BMKG Indonesia</span>
                        </div>
                        <div className="p-6">
                            {weather ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Thermometer className="text-blue-600" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold">{weather.temperature}°C</div>
                                            <div className="text-xs text-gray-500">Temperature</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                                        <Droplets className="text-cyan-600" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold">{weather.humidity}%</div>
                                            <div className="text-xs text-gray-500">Humidity</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                                        <Wind className="text-gray-600" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold">{weather.wind} m/s</div>
                                            <div className="text-xs text-gray-500">Wind Speed</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-3xl">
                                            {weather.rain && weather.rain > 50 ? "🌧️" : weather.rain && weather.rain > 20 ? "🌦️" : "☀️"}
                                        </span>
                                        <div>
                                            <div className="text-2xl font-bold">{weather.rain || 0}%</div>
                                            <div className="text-xs text-gray-500">Rain Chance</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">No weather data available</div>
                            )}
                            {weather?.warning && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="text-yellow-600" size={20} />
                                    <span className="text-sm text-yellow-800">{weather.warning}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="font-bold">💡 Harvest Intelligence Engine</h2>
                        </div>
                        <div className="p-6">
                            {latest_prediction?.recommendation ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full font-bold text-white ${latest_prediction.priority === "HIGH" ? "bg-red-500" :
                                                latest_prediction.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
                                            }`}>
                                            {latest_prediction.priority} PRIORITY
                                        </span>
                                        <span className="text-xl font-bold">{latest_prediction.recommendation}</span>
                                    </div>
                                    <p className="text-gray-600">{latest_prediction.reason}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={16} />
                                        <span>Last updated: {latest_prediction.created_at ? new Date(latest_prediction.created_at).toLocaleString('id-ID') : 'N/A'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">No recommendations available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Disease Info */}
                {latest_prediction?.disease && latest_prediction.disease !== "HEALTHY" && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-red-600" size={32} />
                            <div>
                                <h3 className="text-xl font-bold text-red-800">Disease Detected</h3>
                                <p className="text-red-600">{latest_prediction.disease}</p>
                            </div>
                        </div>
                        <p className="text-red-700">Immediate inspection recommended. Contact agricultural extension officer for treatment options.</p>
                    </div>
                )}

                {/* Prediction History */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="font-bold">📊 Prediction History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Readiness</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Fruit Count</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Ripeness</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Disease</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-500">Priority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {predictions_history.slice(0, 10).map((pred, idx) => (
                                    <tr key={pred.id || idx} className={idx === 0 ? "bg-green-50" : ""}>
                                        <td className="px-4 py-3 text-sm">
                                            {idx === 0 && <span className="mr-2 text-green-600">●</span>}
                                            {new Date(pred.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold">{pred.harvest_readiness?.toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-sm">{pred.fruit_count}</td>
                                        <td className="px-4 py-3 text-sm">{pred.ripeness?.toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${pred.disease === "HEALTHY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {pred.disease}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${pred.priority === "HIGH" ? "bg-red-100 text-red-700" :
                                                    pred.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                                                }`}>
                                                {pred.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}