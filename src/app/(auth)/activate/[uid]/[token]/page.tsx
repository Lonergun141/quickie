"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { authApi } from "@/lib/auth/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthMascot } from "@/components/auth/AuthMascot";

export default function ActivateAccountPage() {
    const params = useParams();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const activateAccount = async () => {
        const uid = params.uid as string;
        const token = params.token as string;

        if (!uid || !token) {
            setStatus("error");
            setMessage("Invalid activation link");
            return;
        }

        setStatus("loading");

        try {
            const response = await authApi.activate({ uid, token });
            setStatus("success");
            setMessage(response.message || "Account activated successfully!");
        } catch (error) {
            setStatus("error");
            const errorMessage = error instanceof Error
                ? error.message
                : "Account activation failed. The link may be invalid or expired.";
            setMessage(errorMessage);
        }
    };

    return (
        <AuthSplitLayout leftContent={<AuthMascot type="celebrate" />}>
            <div className="text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        One Last Step!
                    </h2>
                    <p className="text-muted-foreground">
                        Click below to activate your account and start your journey with QuickEase
                    </p>
                </div>

                {status === "loading" && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="mt-4 text-sm text-muted-foreground">Activating your account...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 py-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                            ✓
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                            <p className="font-medium">{message}</p>
                        </div>
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                            Log In Now
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 py-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                            ✕
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-800 dark:text-red-200">
                            <p className="font-medium">{message}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href="/login"
                                className="block w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Back to Login
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Register Again
                            </Link>
                        </div>
                    </div>
                )}

                {status === "idle" && (
                    <button
                        onClick={activateAccount}
                        className="group relative w-full overflow-hidden rounded-xl bg-primary px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                    >
                        <div className="relative flex items-center justify-center gap-2 text-white font-semibold">
                            <span>Activate Account</span>
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </button>
                )}
            </div>
        </AuthSplitLayout>
    );
}
