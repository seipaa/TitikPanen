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
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-primary">AgroMesh AI</h1>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}