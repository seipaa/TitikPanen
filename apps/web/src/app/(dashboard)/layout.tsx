"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex flex-col items-center justify-center p-4">
                <div className="relative flex flex-col items-center">
                    {/* Logo container with pulse & glow animation */}
                    <div className="relative mb-6">
                        {/* Glow background ring */}
                        <div className="absolute inset-0 bg-green-400 rounded-2xl filter blur-xl opacity-40 animate-pulse"></div>
                        {/* Outer rotating/scaling border */}
                        <div className="absolute -inset-1.5 border-2 border-green-600/30 rounded-2xl animate-[spin_6s_linear_infinite] scale-105"></div>
                        {/* The animated Logo card */}
                        <div className="relative bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/40 animate-[bounce_2s_infinite_ease-in-out]">
                            <img src="/logo.png" alt="TitikPanen Logo" className="w-16 h-16 object-contain" />
                        </div>
                    </div>
                    {/* Brand & Tagline */}
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">TitikPanen</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Regional Harvest Intelligence</p>
                    
                    {/* Premium horizontal loading bar */}
                    <div className="w-36 bg-slate-200/60 rounded-full h-1.5 mt-8 overflow-hidden relative">
                        <div className="absolute top-0 bottom-0 bg-green-600 w-1/3 rounded-full animate-loading-bar"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render dashboard if not authenticated (redirect happening)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            {/* Top Navbar */}
            <div className="bg-white border-b shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            id="sidebar-toggle"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="TitikPanen Logo" className="w-8 h-8 object-contain rounded-lg" />
                            <div>
                                <h1 className="font-bold text-gray-900 text-lg leading-tight">TitikPanen</h1>
                                <p className="text-xs text-gray-500">Regional Harvest Intelligence</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 min-w-0 w-full overflow-y-auto relative">
                    {children}
                </main>
            </div>
        </div>
    );
}