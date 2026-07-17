"use client";

import { Sprout, CheckCircle, MapPin, AlertTriangle } from "lucide-react";

interface HarvestSummaryProps {
    totalFarms: number;
    readyHarvest: number;
    nearHarvest: number;
    diseaseAlerts: number;
}

export function HarvestSummary({
    totalFarms,
    readyHarvest,
    nearHarvest,
    diseaseAlerts,
}: HarvestSummaryProps) {
    const items = [
        {
            title: "Total Lahan",
            value: totalFarms,
            icon: Sprout,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Siap Panen",
            value: readyHarvest,
            icon: CheckCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Mendekati Panen",
            value: nearHarvest,
            icon: MapPin,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Disease Alert",
            value: diseaseAlerts,
            icon: AlertTriangle,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {item.value}
                            </p>
                        </div>
                        <div className={`${item.bgColor} p-3 rounded-lg`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}