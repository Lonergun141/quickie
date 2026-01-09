"use client";

import { useState, InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";

        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        return (
            <div className="space-y-2">
                <label
                    htmlFor={props.id}
                    className={cn(
                        "text-sm font-medium transition-colors",
                        error ? "text-red-500" : "text-zinc-900 dark:text-zinc-100"
                    )}
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-900 transition-all outline-none",
                            "placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed",
                            "focus:ring-2 focus:ring-offset-0",
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-zinc-200 dark:border-zinc-800 focus:border-primary focus:ring-primary/20",
                            className
                        )}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-500 font-medium animate-in slide-in-from-top-1 fade-in-0 mt-1 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";
