"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
    children: ReactNode;
    fallbackUrl?: string;
}

export function AuthGuard({ children, fallbackUrl = "/login" }: AuthGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(fallbackUrl);
        }
    }, [isLoading, isAuthenticated, router, fallbackUrl]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="auth-guard-loading">
                <div className="loading-spinner" />
                <p>Loading...</p>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
