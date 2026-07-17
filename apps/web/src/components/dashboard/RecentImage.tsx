"use client";

import { Camera, Calendar } from "lucide-react";
import { Image as ImageType } from "@/types";

interface RecentImageProps {
    image: ImageType | null;
    farmName?: string;
}

export function RecentImage({ image, farmName }: RecentImageProps) {
    if (!image) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Foto Terbaru
                    </h3>
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <Camera className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <p className="text-gray-500 text-center py-8">
                    No recent image captured
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Foto Terbaru
                </h3>
                <div className="bg-green-50 p-2 rounded-lg">
                    <Camera className="w-5 h-5 text-green-600" />
                </div>
            </div>

            <div className="relative">
                <img
                    src={image.image_url}
                    alt="Recent capture"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
                    }}
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {farmName || "Farm"}
                </div>
            </div>

            <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                    {image.captured_at
                        ? new Date(image.captured_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "Unknown date"}
                </span>
            </div>
        </div>
    );
}