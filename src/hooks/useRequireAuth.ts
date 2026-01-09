"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

interface UseRequireAuthOptions {
    redirectTo?: string;
}

/**
 * Hook to protect pages that require authentication.
 * Redirects to login page if user is not authenticated.
 * 
 * Usage:
 * ```tsx
 * function ProtectedPage() {
 *   const { user, isLoading } = useRequireAuth();
 *   
 *   if (isLoading) return <Loading />;
 *   
 *   return <div>Welcome {user?.name}</div>;
 * }
 * ```
 */
export function useRequireAuth({ redirectTo = "/login" }: UseRequireAuthOptions = {}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isLoading, isAuthenticated, router, redirectTo]);

    return { user, isLoading, isAuthenticated };
}
