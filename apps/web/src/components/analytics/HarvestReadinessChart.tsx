"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { Prediction } from "@/types";

interface HarvestReadinessChartProps {
    predictions: Prediction[];
    title?: string;
}

export function HarvestReadinessChart({
    predictions,
    title = "Harvest Readiness Trend",
}: HarvestReadinessChartProps) {
    const data = predictions
        .filter((p) => p.harvest_readiness !== null)
        .slice(0, 20)
        .map((p, idx) => ({
            name: `Day ${idx + 1}`,
            readiness: p.harvest_readiness,
            ripeness: p.ripeness,
            date: new Date(p.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            }),
        }))
        .reverse();

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
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="colorReadiness"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#22c55e"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#22c55e"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toFixed(1)}%`, "Readiness"]}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="readiness"
                            stroke="#22c55e"
                            fillOpacity={1}
                            fill="url(#colorReadiness)"
                            name="Harvest Readiness"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}