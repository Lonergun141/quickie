"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth/api";
import { useAuth } from "@/hooks/useAuth";
import { AuthButton } from "@/components/auth/AuthButton";

interface DeactivateAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DeactivateAccountModal({ isOpen, onClose }: DeactivateAccountModalProps) {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { logout } = useAuth();

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setPassword("");
            setError(null);
        }
    }, [isOpen]);

    const handleDeactivate = async () => {
        setIsLoading(true);
        setError(null);

        if (!password) {
            setError("Please enter your password to confirm.");
            setIsLoading(false);
            return;
        }

        try {

            await authApi.deleteAccount(password);

            await logout();
            router.push("/login");
            onClose();

        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-3xl border border-red-200 dark:border-red-900/50 shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 flex items-center justify-between bg-red-50/50 dark:bg-red-950/10">
                                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h2 className="text-lg font-semibold">Deactivate Account</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                                        Are you sure you want to delete your account?
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        This action cannot be undone. All your data, including documents, summaries, and settings, will be permanently removed.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password-confirm" className="text-sm font-medium ml-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="password-confirm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pl-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            placeholder="Enter your password"
                                        />
                                        <Lock className="absolute left-3.5 top-3.5 text-muted-foreground" size={18} />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-center font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <AuthButton
                                        onClick={handleDeactivate}
                                        isLoading={isLoading}
                                        loadingText="Deactivating..."
                                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                                    >
                                        Yes, Deactivate
                                    </AuthButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
