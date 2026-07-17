"use client";

import { AlertCircle, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Recommendation } from "@/types";
import { formatPercentage, getPriorityColor } from "@/lib/utils";

interface RecommendationCardProps {
    recommendations: Recommendation[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
    if (recommendations.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rekomendasi Terbaru
                </h3>
                <p className="text-gray-500 text-center py-8">
                    Belum ada rekomendasi
                </p>
            </div>
        );
    }

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "HIGH":
            case "CRITICAL":
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case "MEDIUM":
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            default:
                return <Clock className="w-4 h-4 text-green-600" />;
        }
    };

    const getRecommendationColor = (rec: string) => {
        if (rec.includes("Alert") || rec.includes("Inspect")) {
            return "text-red-700";
        }
        if (rec.includes("Ready") || rec.includes("Harvest")) {
            return "text-green-700";
        }
        return "text-yellow-700";
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rekomendasi DSS (Decision Support System)
            </h3>
            <div className="space-y-3">
                {recommendations.slice(0, 5).map((rec, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                {getPriorityIcon(rec.priority)}
                                <span className="font-medium text-gray-900">
                                    {rec.farm_name}
                                </span>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                    rec.priority
                                )}`}
                            >
                                {rec.priority}
                            </span>
                        </div>
                        <p className={`text-sm font-semibold ${getRecommendationColor(rec.recommendation)}`}>
                            {rec.recommendation}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {rec.reason}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                                Readiness: {formatPercentage(rec.harvest_readiness)}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(rec.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {recommendations.length > 5 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                    +{recommendations.length - 5} more recommendations
                </p>
            )}
        </div>
    );
}