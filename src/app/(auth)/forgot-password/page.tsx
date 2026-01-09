"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/auth/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");
        setError("");

        if (!email) {
            setError("Email is required");
            setStatus("idle");
            return;
        }

        try {
            await authApi.forgotPassword(email);
            setStatus("success");
            setMessage("Password reset link sent to your email.");
        } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Failed to send reset link");
        }
    };

    return (
        <AuthSplitLayout leftContent={<AuthBranding />}>
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Forgot password?
                </h2>
                <p className="text-muted-foreground">
                    Enter your email to receive a reset code
                </p>
            </div>

            {status === "success" ? (
                <div className="text-center space-y-6">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <p className="font-medium">{message}</p>
                    </div>
                    <Link href="/login" className="block w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {status === "error" && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {message}
                        </div>
                    )}

                    <AuthInput
                        id="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter your email"
                        error={error}
                        disabled={status === "loading"}
                    />

                    <AuthButton
                        type="submit"
                        isLoading={status === "loading"}
                        loadingText="Sending..."
                    >
                        Send Reset Link
                    </AuthButton>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </AuthSplitLayout>
    );
}
