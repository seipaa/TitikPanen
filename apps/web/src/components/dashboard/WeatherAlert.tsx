"use client";

import { CloudRain, AlertTriangle, Thermometer, Droplets } from "lucide-react";
import { Weather } from "@/types";

interface WeatherAlertProps {
    weather: Weather | null;
}

export function WeatherAlert({ weather }: WeatherAlertProps) {
    if (!weather) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-600 text-sm">Loading weather data...</p>
            </div>
        );
    }

    const hasWarning = weather.warning && weather.warning.length > 0;
    const isHighTemp = weather.temperature && weather.temperature > 35;
    const isHighHumidity = weather.humidity && weather.humidity > 85;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cuaca Saat Ini</h3>
                {hasWarning && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
            </div>

            {hasWarning && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-medium text-red-700">{weather.warning}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Thermometer className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Suhu</p>
                        <p className={`text-lg font-semibold ${isHighTemp ? "text-red-600" : "text-gray-900"}`}>
                            {weather.temperature ? `${weather.temperature}°C` : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Kelembaban</p>
                        <p className={`text-lg font-semibold ${isHighHumidity ? "text-red-600" : "text-gray-900"}`}>
                            {weather.humidity ? `${weather.humidity}%` : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <CloudRain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Curah Hujan</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {weather.rain !== null ? `${weather.rain} mm` : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <CloudRain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Kecepatan Angin</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {weather.wind !== null ? `${weather.wind} m/s` : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {weather.location && (
                <p className="text-xs text-gray-400 mt-4 text-right">{weather.location}</p>
            )}
        </div>
    );
}