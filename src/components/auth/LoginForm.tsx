
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { login, canRetryLogin, retryTimerEnd, resetLoginAttempts } = useAuth();

    // Calculate remaining retry time
    const getRetrySeconds = () => {
        if (!retryTimerEnd) return 0;
        return Math.max(0, Math.ceil((retryTimerEnd - Date.now()) / 1000));
    };

    const [retrySeconds, setRetrySeconds] = useState(getRetrySeconds());

    // Update retry timer display
    useState(() => {
        if (!canRetryLogin && retryTimerEnd) {
            const interval = setInterval(() => {
                const remaining = getRetrySeconds();
                setRetrySeconds(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    });

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        let isValid = true;

        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await login(email, password);
            // Redirect will be handled by AuthContext
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
            setErrors({ form: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {errors.form && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    {errors.form}
                </div>
            )}

            <div className="space-y-4">
                <AuthInput
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    error={errors.email}
                    disabled={isLoading || !canRetryLogin}
                    autoComplete="email"
                />

                <AuthInput
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Enter your password"
                    error={errors.password}
                    disabled={isLoading || !canRetryLogin}
                    autoComplete="current-password"
                />
            </div>

            <div className="flex justify-end py-5">
                <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <AuthButton
                type="submit"
                isLoading={isLoading}
                disabled={!canRetryLogin}
                loadingText="Signing in..."
            >
                {!canRetryLogin
                    ? `Retry in ${retrySeconds}s`
                    : "Sign In"
                }
            </AuthButton>

            <div className="text-center py-5">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </form>
    );
}

