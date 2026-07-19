"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

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