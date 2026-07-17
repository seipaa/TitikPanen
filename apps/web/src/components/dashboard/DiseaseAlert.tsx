"use client";

import { AlertTriangle } from "lucide-react";
import { Prediction } from "@/types";
import { formatPercentage } from "@/lib/utils";

interface DiseaseAlertProps {
    predictions: Prediction[];
}

export function DiseaseAlert({ predictions }: DiseaseAlertProps) {
    const diseaseAlerts = predictions.filter(
        (p) => p.disease && p.disease !== "HEALTHY"
    );

    if (diseaseAlerts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Disease Alerts
                    </h3>
                    <div className="bg-green-50 p-2 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <p className="text-gray-500 text-center py-4">
                    No disease detected
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Disease Alerts
                </h3>
                <div className="bg-red-50 p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
            </div>

            <div className="space-y-3">
                {diseaseAlerts.slice(0, 5).map((prediction, idx) => (
                    <div
                        key={idx}
                        className="border border-red-200 bg-red-50 rounded-lg p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-700">
                                {prediction.disease}
                            </span>
                            {prediction.disease_risk && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                    {prediction.disease_risk} Risk
                                </span>
                            )}
                        </div>
                        {prediction.reason && (
                            <p className="text-xs text-red-600 mt-1">
                                {prediction.reason}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {diseaseAlerts.length > 5 && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                    +{diseaseAlerts.length - 5} more alerts
                </p>
            )}
        </div>
    );
}