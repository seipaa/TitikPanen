"use client";

import { X, MapPin, Sprout, AlertTriangle, Calendar } from "lucide-react";
import { MapMarker } from "@/types";
import { formatPercentage, getPriorityColor } from "@/lib/utils";
import Link from "next/link";

interface FarmSidebarProps {
    marker: MapMarker | null;
    onClose: () => void;
}

export function FarmSidebar({ marker, onClose }: FarmSidebarProps) {
    if (!marker) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Farm Details</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
                {/* Farm Name */}
                <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                        <Sprout className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Farm Name</p>
                        <p className="font-medium text-gray-900">{marker.name}</p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                            {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900 capitalize">
                            {marker.status === "near" ? "Near Harvest" : marker.status}
                        </span>
                        <div
                            className="w-8 h-8 rounded-full"
                            style={{
                                backgroundColor:
                                    marker.status === "healthy"
                                        ? "#22c55e"
                                        : marker.status === "near"
                                            ? "#eab308"
                                            : marker.status === "ready"
                                                ? "#ef4444"
                                                : "#1f2937",
                            }}
                        />
                    </div>
                </div>

                {/* Priority */}
                {marker.priority && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Priority</p>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(marker.priority)}`}
                        >
                            {marker.priority}
                        </span>
                    </div>
                )}

                {/* Latest Prediction */}
                {marker.latest_prediction && (
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-900">Latest Prediction</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500">Harvest Readiness</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {marker.latest_prediction.harvest_readiness?.toFixed(1) || "N/A"}%
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500">Fruit Count</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {marker.latest_prediction.fruit_count || "N/A"}
                                </p>
                            </div>
                        </div>

                        {marker.latest_prediction.disease_risk && (
                            <div className="bg-red-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    <p className="text-sm text-red-700">
                                        Disease Risk: {marker.latest_prediction.disease_risk}
                                    </p>
                                </div>
                            </div>
                        )}

                        {marker.latest_prediction.ripeness !== null && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500">Ripeness</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {marker.latest_prediction.ripeness?.toFixed(1) || "N/A"}%
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="pt-4 space-y-2">
                    <Link
                        href={`/farms/${marker.farm_id}`}
                        className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        View Full Details
                    </Link>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
}