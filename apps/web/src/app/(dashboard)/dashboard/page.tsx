"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardData, Weather, MapMarker, Farm } from "@/types";
import { DynamicMap } from "@/components/map/DynamicMap";
import Link from "next/link";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [weather, setWeather] = useState<Weather | null>(null);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFarm, setSelectedFarm] = useState<MapMarker | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashboardRes, weatherRes, farmsRes] = await Promise.all([
                    api.get<DashboardData>("/dashboard"),
                    api.get<Weather>("/weather"),
                    api.get<Farm[]>("/farms")
                ]);
                setData(dashboardRes.data);
                setWeather(weatherRes.data);
                setFarms(farmsRes.data);

                // Select first farm by default
                if (dashboardRes.data.map_markers.length > 0) {
                    setSelectedFarm(dashboardRes.data.map_markers[0]);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium text-sm">Mempersiapkan Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center p-8 bg-white border rounded-xl shadow-sm">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-gray-500 font-semibold mt-2">Gagal memuat data dashboard.</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            healthy: "bg-green-500",
            near: "bg-yellow-500",
            ready: "bg-red-500",
            disease: "bg-gray-800"
        };
        return colors[status] || colors.healthy;
    };

    const selectedFarmInfo = selectedFarm ? farms.find(f => f.id === selectedFarm.farm_id) : null;

    const totalFarms = data.total_farms;
    const readyCount = data.ready_harvest_count;
    const nearCount = data.near_harvest_count;
    const diseaseCount = data.disease_alerts;

    // Status Kesehatan
    const healthyCount = data.map_markers.filter(m => m.status === "healthy").length;
    const infectedCount = data.map_markers.filter(m => m.status === "disease").length;
    const nearHarvestCount = data.map_markers.filter(m => m.status === "near").length;

    // Distribusi Varietas
    const rawitCount = farms.filter(f => f.variety?.toLowerCase().includes("rawit")).length || 0;
    const keritingCount = farms.filter(f => f.variety?.toLowerCase().includes("keriting")).length || 0;
    const besarCount = farms.filter(f => f.variety?.toLowerCase().includes("besar") || (!f.variety?.toLowerCase().includes("rawit") && !f.variety?.toLowerCase().includes("keriting"))).length || 0;

    // Prioritas Tindakan
    const highPriorityCount = data.map_markers.filter(m => m.priority === "HIGH" || m.priority === "CRITICAL").length;
    const mediumPriorityCount = data.map_markers.filter(m => m.priority === "MEDIUM").length;
    const lowPriorityCount = data.map_markers.filter(m => m.priority === "LOW").length;

    return (
        <div className="relative w-full h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden bg-gray-50 flex flex-col lg:block">
            {/* Custom CSS overrides for Leaflet controls and scrollbars */}
            <style>{`
                .leaflet-top.leaflet-left {
                    margin-left: 336px !important;
                    margin-top: 12px !important;
                    transition: margin-left 0.3s ease-in-out;
                }
                @media (max-width: 1024px) {
                    .leaflet-top.leaflet-left {
                        margin-left: 12px !important;
                        margin-top: 12px !important;
                    }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Fullscreen Map Layer */}
            <div className="h-[40vh] lg:h-full lg:absolute lg:inset-0 lg:w-full lg:z-0">
                <DynamicMap
                    markers={data.map_markers}
                    onMarkerClick={(marker) => setSelectedFarm(marker)}
                    zoom={15}
                    height="h-full"
                    selectedFarmId={selectedFarm?.farm_id}
                />

                {/* Custom Legend - Floating Top Center */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-full shadow-md px-4 py-2 z-[1000] border border-gray-100 hidden sm:flex items-center gap-4">
                    <span className="font-bold text-[10px] text-gray-700 uppercase tracking-wider">Status Lahan:</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                        <span className="text-green-500">🌱</span> Sehat
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                        <span className="text-yellow-500">🌿</span> Mendekati Panen
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                        <span className="text-red-500">🌶️</span> Siap Panen
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                        <span className="text-gray-800">⚠️</span> Hama
                    </div>
                </div>
            </div>

            {/* Left Column (Floating) */}
            <div className="flex flex-col gap-4 p-4 lg:p-0 lg:absolute lg:left-4 lg:top-4 lg:bottom-4 lg:w-80 lg:z-10 lg:overflow-y-auto lg:pr-1 no-scrollbar pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-4">
                    {/* Card 1: Selected Farm Detail */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md flex flex-col justify-between min-h-[160px]">
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 uppercase tracking-wide text-base leading-tight">
                                {selectedFarm?.name || "PILIH LAHAN PADA PETA"}
                            </h3>
                            {selectedFarm ? (
                                <div className="space-y-1 text-xs text-gray-600">
                                    <p className="flex items-center gap-1">
                                        <span className="text-gray-400">📍</span>
                                        <span>{selectedFarm.latitude.toFixed(4)}, {selectedFarm.longitude.toFixed(4)}</span>
                                    </p>
                                    <p>Pemilik: <span className="font-medium text-gray-800">{selectedFarmInfo?.owner || "Bpk. Petani"}</span></p>
                                    <p>Varietas: <span className="font-medium text-gray-800">{selectedFarmInfo?.variety || "Cabe Rawit Domba"}</span></p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">Silakan klik salah satu lahan pada peta untuk melihat detail informasi.</p>
                            )}
                        </div>
                        {selectedFarm && (
                            <div className="mt-4 flex items-center justify-between border-t pt-3">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider ${getStatusColor(selectedFarm.status)}`}>
                                    {selectedFarm.status === "healthy" ? "SEHAT" : selectedFarm.status === "near" ? "MENDEKATI PANEN" : selectedFarm.status === "ready" ? "SIAP PANEN" : "ALERT HAMA"}
                                </span>
                                <Link
                                    href={`/farms/${selectedFarm.farm_id}`}
                                    className="text-xs font-bold text-green-600 hover:text-green-700 transition flex items-center gap-1"
                                >
                                    Detail Selengkapnya →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Card 2: PREDIKSI PANEN & STATUS */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md flex-1 flex flex-col min-h-[220px]">
                        <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest border-b pb-2 mb-3">
                            PREDIKSI PANEN & STATUS
                        </h3>
                        {selectedFarm ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jumlah Buah</p>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                                        {selectedFarm.latest_prediction?.fruit_count || 0} <span className="text-xs font-normal text-gray-500">buah</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kesiapan Panen</p>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                                        {selectedFarm.latest_prediction?.harvest_readiness?.toFixed(0) || 0}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kematangan</p>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                                        {selectedFarm.latest_prediction?.ripeness?.toFixed(0) || 0}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Risiko Penyakit</p>
                                    <p className={`text-lg font-bold mt-0.5 ${selectedFarm.latest_prediction?.disease_risk === 'HIGH' ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedFarm.latest_prediction?.disease_risk || 'LOW'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Akurasi AI</p>
                                    <p className="text-lg font-bold text-gray-900 mt-0.5">
                                        {selectedFarm.latest_prediction ? '89%' : '0%'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deteksi Hama</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                                        {selectedFarm.status === 'disease' ? 'Layu / Antraknosa' : 'Aman / Sehat'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 text-center py-6">
                                Pilih salah satu lahan untuk melihat hasil prediksi AI.
                            </div>
                        )}
                    </div>

                    {/* Card 3 (Only visible on screens smaller than xl): Status Kesehatan Lahan */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md xl:hidden">
                        <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                            STATUS KESEHATAN LAHAN
                        </h4>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Sehat / Normal</span>
                                <span className="text-sm font-bold text-gray-900">{healthyCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Mendekati Panen</span>
                                <span className="text-sm font-bold text-gray-900">{nearHarvestCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Serangan Hama</span>
                                <span className="text-sm font-bold text-red-600">{infectedCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row (Floating - Only visible on xl screens) */}
            <div className="absolute bottom-4 left-[352px] right-[352px] z-10 hidden xl:grid grid-cols-3 gap-4 pointer-events-auto">
                {/* Card A: Status Kesehatan Lahan */}
                <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md">
                    <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                        STATUS KESEHATAN LAHAN
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Sehat / Normal</span>
                            <span className="text-sm font-bold text-gray-900">{healthyCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Mendekati Panen</span>
                            <span className="text-sm font-bold text-gray-900">{nearHarvestCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Serangan Hama</span>
                            <span className="text-sm font-bold text-red-600">{infectedCount}</span>
                        </div>
                    </div>
                </div>

                {/* Card B: Distribusi Varietas */}
                <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md">
                    <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                        DISTRIBUSI VARIETAS
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Rawit Domba</span>
                            <span className="text-sm font-bold text-gray-900">{rawitCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Merah Keriting</span>
                            <span className="text-sm font-bold text-gray-900">{keritingCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Cabe Merah Besar</span>
                            <span className="text-sm font-bold text-gray-900">{besarCount}</span>
                        </div>
                    </div>
                </div>

                {/* Card C: Tingkat Prioritas HIE */}
                <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md">
                    <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                        TINGKAT PRIORITAS TINDAKAN
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Prioritas Tinggi (High)</span>
                            <span className="text-sm font-bold text-red-600">{highPriorityCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Prioritas Sedang (Medium)</span>
                            <span className="text-sm font-bold text-yellow-600">{mediumPriorityCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Prioritas Rendah (Low)</span>
                            <span className="text-sm font-bold text-green-600">{lowPriorityCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column (Floating) */}
            <div className="flex flex-col gap-4 p-4 lg:p-0 lg:absolute lg:right-4 lg:top-4 lg:bottom-4 lg:w-80 lg:z-10 lg:overflow-y-auto lg:pr-1 no-scrollbar pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-4">
                    {/* Card 1: Ringkasan Lahan */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md flex-shrink-0">
                        <h3 className="text-xs font-bold text-gray-850 uppercase tracking-widest border-b pb-2 mb-3">
                            RINGKASAN LAHAN
                        </h3>
                        <div className="grid grid-cols-4 gap-1 text-center">
                            <div>
                                <p className="text-2xl font-black text-gray-950">{totalFarms}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">TOTAL</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-green-600">{readyCount}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">SIAP PANEN</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-yellow-600">{nearCount}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">MENDEKATI</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-red-600">{diseaseCount}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">ALERT HAMA</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Antrean Rekomendasi */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md flex flex-col min-h-[220px] max-h-[300px] overflow-hidden flex-shrink-0">
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                                ANTREAN REKOMENDASI
                            </h3>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold">
                                {data.recommendations.length} Rekomendasi
                            </span>
                        </div>
                        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                            {data.recommendations.map((rec, index) => (
                                <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-start gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                                            rec.priority === 'HIGH' || rec.priority === 'CRITICAL' 
                                                ? 'bg-red-500' 
                                                : rec.priority === 'MEDIUM' 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-green-500'
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 leading-tight">
                                                {rec.recommendation}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-0.5 leading-snug font-medium">
                                                {rec.reason || "Kondisi lahan terpantau aman."}
                                            </p>
                                            <div className="flex items-center justify-between mt-1 text-[9px] text-gray-400 font-bold">
                                                <span className="truncate max-w-[120px]">Lahan: {rec.farm_name}</span>
                                                <span>HIE • {new Date(rec.created_at).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.recommendations.length === 0 && (
                                <div className="flex-1 flex items-center justify-center text-xs text-gray-400 py-6">
                                    Tidak ada rekomendasi aktif.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Parameter & Kondisi Lahan */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md flex-1 flex flex-col min-h-[220px]">
                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
                                PARAMETER LAHAN & CUACA
                            </h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-bold">
                                12 Parameter
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1 flex-shrink-0">
                            <div className="flex justify-between">
                                <span>PARAMETER</span>
                                <span>NILAI/ACUAN</span>
                            </div>
                            <div className="flex justify-between">
                                <span>PARAMETER</span>
                                <span>NILAI/ACUAN</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1 overflow-y-auto pr-1">
                            {/* Column 1 */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Suhu Udara</span>
                                    <span className="font-semibold text-gray-900">{weather?.temperature ?? 27}°C <span className="text-[10px] font-normal text-gray-400">/ 30</span></span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Kelembaban</span>
                                    <span className="font-semibold text-gray-900">{weather?.humidity ?? 75}% <span className="text-[10px] font-normal text-gray-400">/ 80</span></span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Curah Hujan</span>
                                    <span className={`font-semibold ${weather?.rain && weather.rain > 50 ? 'text-red-600' : 'text-gray-900'}`}>{weather?.rain ?? 10}mm <span className="text-[10px] font-normal text-gray-400">/ 50</span></span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Kec. Angin</span>
                                    <span className="font-semibold text-gray-900">{weather?.wind ?? 8}km <span className="text-[10px] font-normal text-gray-400">/ 15</span></span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">pH Tanah</span>
                                    <span className="font-semibold text-green-600">6.5 <span className="text-[10px] font-normal text-gray-400">/ 6.0</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-[11px]">Klorofil Daun</span>
                                    <span className="font-semibold text-green-600">82% <span className="text-[10px] font-normal text-gray-400">/ 70</span></span>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Risiko Hama</span>
                                    <span className={`font-semibold ${selectedFarm?.latest_prediction?.disease_risk === 'HIGH' ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedFarm?.latest_prediction?.disease_risk === 'HIGH' ? '100/0' : '0/100'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Air Tanah</span>
                                    <span className="font-semibold text-green-600">100/0</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Logistik Panen</span>
                                    <span className="font-semibold text-green-600">100/0</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Tenaga Panen</span>
                                    <span className="font-semibold text-green-600">100/0</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                    <span className="text-gray-500 text-[11px]">Pupuk Organik</span>
                                    <span className="font-semibold text-green-600">100/0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-[11px]">Pasar Distribusi</span>
                                    <span className="font-semibold text-green-600">100/0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 (Only visible on screens smaller than xl): Distribusi Varietas */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md xl:hidden mt-4">
                        <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                            DISTRIBUSI VARIETAS
                        </h4>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Rawit Domba</span>
                                <span className="text-sm font-bold text-gray-900">{rawitCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Merah Keriting</span>
                                <span className="text-sm font-bold text-gray-900">{keritingCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Cabe Merah Besar</span>
                                <span className="text-sm font-bold text-gray-900">{besarCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 5 (Only visible on screens smaller than xl): Tingkat Prioritas Tindakan */}
                    <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-md xl:hidden mt-4">
                        <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest border-b pb-1.5 mb-2">
                            TINGKAT PRIORITAS TINDAKAN
                        </h4>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Prioritas Tinggi (High)</span>
                                <span className="text-sm font-bold text-red-600">{highPriorityCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Prioritas Sedang (Medium)</span>
                                <span className="text-sm font-bold text-yellow-600">{mediumPriorityCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Prioritas Rendah (Low)</span>
                                <span className="text-sm font-bold text-green-600">{lowPriorityCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}