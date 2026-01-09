const ACCESS_TOKEN_KEY = "quickie_access_token";
const REFRESH_TOKEN_KEY = "quickie_refresh_token";

/**
 * Token storage utilities for managing auth tokens in localStorage.
 * All methods are safe to call on the server (returns null/no-op).
 */
export const tokenStorage = {
    /**
     * Get the access token
     */
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Set the access token
     */
    setAccessToken(token: string): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    /**
     * Get the refresh token
     */
    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Set the refresh token
     */
    setRefreshToken(token: string): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    /**
     * Clear all auth tokens
     */
    clearTokens(): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Check if access token exists
     */
    hasToken(): boolean {
        return !!this.getAccessToken();
    },
};

/**
 * Parse JWT token payload (without verification)
 */
export function parseJwtPayload<T = Record<string, unknown>>(token: string): T | null {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = parseJwtPayload<{ exp?: number }>(token);
    if (!payload?.exp) return true;

    // Check if expired (with 30 second buffer)
    return Date.now() >= (payload.exp * 1000) - 30000;
}
