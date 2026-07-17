"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Weather } from "@/types";

interface WeatherTrendChartProps {
    weatherData: Weather[];
    title?: string;
}

export function WeatherTrendChart({
    weatherData,
    title = "Weather Trend",
}: WeatherTrendChartProps) {
    const data = weatherData
        .filter((w) => w.temperature !== null || w.humidity !== null)
        .slice(0, 20)
        .map((w, idx) => ({
            name: `Day ${idx + 1}`,
            date: w.timestamp
                ? new Date(w.timestamp).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                })
                : `Day ${idx + 1}`,
            temperature: w.temperature,
            humidity: w.humidity,
        }))
        .reverse();

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {title}
                </h3>
                <p className="text-gray-500 text-center py-8">
                    No weather data available
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}°C`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === "temperature"
                                    ? `${value}°C`
                                    : `${value}%`,
                                name === "temperature"
                                    ? "Temperature"
                                    : "Humidity",
                            ]}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="Temperature (°C)"
                            dot={{ fill: "#ef4444" }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="humidity"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Humidity (%)"
                            dot={{ fill: "#3b82f6" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}