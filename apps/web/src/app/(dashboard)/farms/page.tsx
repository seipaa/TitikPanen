"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Farm, Prediction } from "@/types";
import { Sprout, MapPin, Calendar } from "lucide-react";

export default function FarmsPage() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await api.get<Farm[]>("/farms");
                setFarms(response.data);
            } catch (error) {
                console.error("Failed to fetch farms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarms();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Daftar Lahan</h1>
                <p className="text-gray-500">Kelola lahan cabai Anda</p>
            </div>

            <div className="bg-white rounded-lg shadow">
                {farms.length === 0 ? (
                    <div className="p-8 text-center">
                        <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data lahan</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {farms.map((farm) => (
                            <div key={farm.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <Sprout className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{farm.name}</h3>
                                            <p className="text-sm text-gray-500">{farm.variety}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Pemilik: {farm.owner}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}