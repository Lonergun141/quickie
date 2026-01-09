"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User, AuthState, RegisterCredentials } from "@/lib/auth/types";
import { authApi } from "@/lib/auth/api";

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    loginAttempts: number;
    canRetryLogin: boolean;
    retryTimerEnd: number | null;
    resetLoginAttempts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const MAX_LOGIN_ATTEMPTS = 4;
const RETRY_COOLDOWN_MS = 60000; // 1 minute

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [canRetryLogin, setCanRetryLogin] = useState(true);
    const [retryTimerEnd, setRetryTimerEnd] = useState<number | null>(null);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try to refresh the token (will fail if no valid refresh token in cookies)
                await authApi.refreshToken();
                // If successful, fetch user data
                const userResponse = await authApi.getUser();
                setUser(userResponse.data.user);
                setIsAuthenticated(true);
            } catch {
                // Not authenticated - this is expected for new users
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // Handle login attempt cooldown timer
    useEffect(() => {
        if (!canRetryLogin && retryTimerEnd) {
            const interval = setInterval(() => {
                const remainingTime = retryTimerEnd - Date.now();
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    setLoginAttempts(0);
                    setCanRetryLogin(true);
                    setRetryTimerEnd(null);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [canRetryLogin, retryTimerEnd]);

    const resetLoginAttempts = useCallback(() => {
        setLoginAttempts(0);
        setCanRetryLogin(true);
        setRetryTimerEnd(null);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        if (!canRetryLogin) {
            throw new Error("Too many login attempts. Please wait before trying again.");
        }

        try {
            const response = await authApi.login(email, password);
            setUser(response.data.user);
            setIsAuthenticated(true);
            resetLoginAttempts();
            router.push("/Home");
        } catch (error) {
            // Increment failed attempts
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);

            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                setCanRetryLogin(false);
                setRetryTimerEnd(Date.now() + RETRY_COOLDOWN_MS);
            }

            throw error;
        }
    }, [canRetryLogin, loginAttempts, resetLoginAttempts, router]);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        await authApi.register(credentials);
        // Don't auto-login - user needs to activate account via email
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            router.push("/login");
        }
    }, [router]);

    const refreshToken = useCallback(async () => {
        await authApi.refreshToken();
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
        loginAttempts,
        canRetryLogin,
        retryTimerEnd,
        resetLoginAttempts,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
