"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Map,
    Leaf,
    AlertTriangle,
    BarChart3,
    X
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/map", label: "Peta", icon: Map },
    { href: "/farms", label: "Daftar Lahan", icon: Leaf },
    { href: "/recommendations", label: "Rekomendasi", icon: AlertTriangle },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                bg-white border-r shadow-xl
                transform transition-all duration-300 ease-in-out
                ${isOpen 
                    ? "translate-x-0 w-72 opacity-100 lg:translate-x-0 lg:w-72 lg:opacity-100" 
                    : "-translate-x-full w-72 lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-r-0 lg:shadow-none"
                }
            `}>
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-green-600 to-emerald-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🌶️</span>
                            <div>
                                <h2 className="font-bold text-white">AgroMesh AI</h2>
                                <p className="text-xs text-green-100">Harvest Intelligence</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-white/20 rounded"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${isActive
                                        ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                    <div className="text-xs text-gray-500 text-center">
                        🌶️ AgroMesh AI v1.0
                        <br />
                        <span className="text-blue-600">Data: BMKG Indonesia</span>
                    </div>
                </div>
            </div>
        </>
    );
}