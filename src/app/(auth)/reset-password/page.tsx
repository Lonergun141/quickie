"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/auth/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ password?: string; rePassword?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        let isValid = true;
        const newErrors: { password?: string; rePassword?: string } = {};

        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 12) {
            newErrors.password = "Password must be at least 12 characters";
            isValid = false;
        }

        if (password !== rePassword) {
            newErrors.rePassword = "Passwords do not match";
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        if (!uid || !token) {
            setStatus("error");
            setMessage("Invalid reset link");
            return;
        }

        setStatus("loading");

        try {
            await authApi.resetPasswordConfirm({
                uid,
                token,
                new_password: password,
                re_new_password: rePassword
            });
            setStatus("success");
            setMessage("Your password has been reset successfully.");
            setTimeout(() => router.push("/login"), 3000);
        } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Failed to reset password");
        }
    };

    if (!uid || !token) {
        return (
            <AuthSplitLayout leftContent={<AuthBranding />}>
                <div className="text-center space-y-4">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                        Invalid password reset link.
                    </div>
                    <Link href="/forgot-password" className="text-primary hover:underline">
                        Request a new link
                    </Link>
                </div>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout leftContent={<AuthBranding />}>
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Reset your password
                </h2>
                <p className="text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            {status === "success" ? (
                <div className="text-center space-y-6">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <p className="font-medium">{message}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {status === "error" && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {message}
                        </div>
                    )}

                    <div className="space-y-4">
                        <AuthInput
                            id="password"
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            placeholder="Create new password"
                            error={errors.password}
                            disabled={status === "loading"}
                        />

                        <AuthInput
                            id="rePassword"
                            label="Confirm Password"
                            type="password"
                            value={rePassword}
                            onChange={(e) => {
                                setRePassword(e.target.value);
                                if (errors.rePassword) setErrors({ ...errors, rePassword: undefined });
                            }}
                            placeholder="Confirm new password"
                            error={errors.rePassword}
                            disabled={status === "loading"}
                        />
                    </div>

                    <AuthButton
                        type="submit"
                        isLoading={status === "loading"}
                        loadingText="Resetting..."
                    >
                        Reset Password
                    </AuthButton>
                </form>
            )}
        </AuthSplitLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
