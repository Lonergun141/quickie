import {
    AuthResponse,
    RegisterResponse,
    TokenRefreshResponse,
    MessageResponse,
    RegisterCredentials,
    ActivateAccountRequest,
    ResetPasswordRequest,
} from "./types";

/**
 * Authentication API methods
 * All methods call internal Next.js API routes which proxy to the Djoser backend
 */
export const authApi = {
    /**
     * Login with email and password
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Include cookies
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    },

    /**
     * Register a new user
     */
    async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data;
    },

    /**
     * Logout the current user
     */
    async logout(): Promise<MessageResponse> {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Logout failed");
        }

        return data;
    },

    /**
     * Refresh the access token
     */
    async refreshToken(): Promise<TokenRefreshResponse> {
        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Token refresh failed");
        }

        return data;
    },

    /**
     * Activate user account
     */
    async activate(credentials: ActivateAccountRequest): Promise<MessageResponse> {
        const response = await fetch("/api/auth/activate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Account activation failed");
        }

        return data;
    },

    /**
     * Request password reset email
     */
    async forgotPassword(email: string): Promise<MessageResponse> {
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to send reset email");
        }

        return data;
    },

    /**
     * Reset password with uid and token
     */
    async resetPasswordConfirm(credentials: ResetPasswordRequest): Promise<MessageResponse> {
        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Password reset failed");
        }

        return data;
    },
};
