"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Prediction, Recommendation } from "@/types";
import { HarvestReadinessChart } from "@/components/analytics/HarvestReadinessChart";
import { DiseaseTrendChart } from "@/components/analytics/DiseaseTrendChart";
import { WeatherTrendChart } from "@/components/analytics/WeatherTrendChart";
import { HarvestPriorityChart } from "@/components/analytics/HarvestPriorityChart";
import { Weather } from "@/types";

export default function AnalyticsPage() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [weatherHistory, setWeatherHistory] = useState<Weather[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [predRes, recRes, weatherRes] = await Promise.all([
                    api.get<Prediction[]>("/ai/predictions"),
                    api.get<Recommendation[]>("/recommendation"),
                    api.get<Weather[]>("/weather/history")
                ]);
                setPredictions(predRes.data);
                setRecommendations(recRes.data);
                setWeatherHistory(weatherRes.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500">Analisis tren dan statistik panen cabai</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HarvestReadinessChart predictions={predictions} />
                <DiseaseTrendChart predictions={predictions} />
                <WeatherTrendChart weatherData={weatherHistory} />
                <HarvestPriorityChart recommendations={recommendations} />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Total Predictions</p>
                    <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Avg Readiness</p>
                    <p className="text-2xl font-bold text-green-600">
                        {predictions.length > 0
                            ? (
                                predictions.reduce((acc, p) => acc + (p.harvest_readiness || 0), 0) /
                                predictions.length
                            ).toFixed(1)
                            : "0"}%
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Avg Fruit Count</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {predictions.length > 0
                            ? (
                                predictions.reduce((acc, p) => acc + (p.fruit_count || 0), 0) /
                                predictions.length
                            ).toFixed(1)
                            : "0"}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Disease Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                        {predictions.length > 0
                            ? (
                                (predictions.filter((p) => p.disease !== "HEALTHY").length /
                                    predictions.length) *
                                100
                            ).toFixed(1)
                            : "0"}%
                    </p>
                </div>
            </div>
        </div>
    );
}