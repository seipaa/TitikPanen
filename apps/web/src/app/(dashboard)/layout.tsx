"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navbar with Hamburger */}
            <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌶️</span>
                            <div>
                                <h1 className="font-bold text-gray-900">AgroMesh AI</h1>
                                <p className="text-xs text-gray-500">Harvest Intelligence Platform</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="hidden sm:inline">Cianjur, Jawa Barat</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            📡 BMKG
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 min-h-[calc(100vh-60px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}