"use client";

import { useAuthContext } from "@/context/AuthContext";

/**
 * Custom hook for accessing authentication state and methods.
 * 
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth() {
    return useAuthContext();
}
