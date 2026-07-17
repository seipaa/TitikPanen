"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Recommendation } from "@/types";

interface HarvestPriorityChartProps {
    recommendations: Recommendation[];
    title?: string;
}

const COLORS = {
    CRITICAL: "#dc2626",
    HIGH: "#ef4444",
    MEDIUM: "#f59e0b",
    LOW: "#22c55e",
};

export function HarvestPriorityChart({
    recommendations,
    title = "Harvest Priority Distribution",
}: HarvestPriorityChartProps) {
    const priorityCounts = recommendations.reduce((acc, r) => {
        const priority = r.priority || "LOW";
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(priorityCounts)
        .map(([name, value]) => ({
            name,
            value,
            color: COLORS[name as keyof typeof COLORS] || "#6b7280",
        }))
        .sort((a, b) => {
            const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
            return order.indexOf(a.name) - order.indexOf(b.name);
        });

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {title}
                </h3>
                <p className="text-gray-500 text-center py-8">
                    No priority data available
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
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}