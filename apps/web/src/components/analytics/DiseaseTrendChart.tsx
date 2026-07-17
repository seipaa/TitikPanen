"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Prediction } from "@/types";

interface DiseaseTrendChartProps {
    predictions: Prediction[];
    title?: string;
}

const COLORS = {
    HEALTHY: "#22c55e",
    ANTHRACNOSE: "#ef4444",
    PHYTOPHTHORA: "#f97316",
    POWDERY_MILDEW: "#eab308",
    OTHER: "#6b7280",
};

export function DiseaseTrendChart({
    predictions,
    title = "Disease Distribution",
}: DiseaseTrendChartProps) {
    const diseaseCounts = predictions.reduce((acc, p) => {
        const disease = p.disease || "HEALTHY";
        acc[disease] = (acc[disease] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(diseaseCounts).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name as keyof typeof COLORS] || "#6b7280",
    }));

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {title}
                </h3>
                <p className="text-gray-500 text-center py-8">
                    No data available
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
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}