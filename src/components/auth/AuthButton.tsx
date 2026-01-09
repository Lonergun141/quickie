"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ className, children, isLoading, loadingText, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200",
                    "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
                    "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                    "flex items-center justify-center gap-2",
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                )}
                {isLoading ? (loadingText || "Loading...") : children}
            </button>
        );
    }
);

AuthButton.displayName = "AuthButton";
