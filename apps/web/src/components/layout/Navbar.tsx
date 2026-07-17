"use client";

import { useAuth } from "@/lib/auth";
import { Sprout, LogOut } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/dashboard" className="flex items-center space-x-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">AgroMesh AI</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                            <p className="text-xs text-gray-500">{user?.role || "Role"}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}