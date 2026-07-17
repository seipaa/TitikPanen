import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Priority, MapStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatPercentage(value: number | null | undefined): string {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(1)}%`;
}

export function getMarkerColor(status: MapStatus | string): string {
    const colors: Record<string, string> = {
        healthy: "#22c55e",
        near: "#eab308",
        ready: "#ef4444",
        disease: "#1f2937",
    };
    return colors[status] || "#6b7280";
}

export function getPriorityColor(priority: Priority | string | null): string {
    const colors: Record<string, string> = {
        LOW: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-orange-100 text-orange-800",
        CRITICAL: "bg-red-100 text-red-800",
    };
    return colors[priority || "LOW"] || colors.LOW;
}

export function getDiseaseRiskColor(risk: string | null): string {
    if (!risk) return "bg-gray-100 text-gray-800";
    const colors: Record<string, string> = {
        LOW: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-red-100 text-red-800",
    };
    return colors[risk] || "bg-gray-100 text-gray-800";
}