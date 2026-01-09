"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Error Icon */}
                    <div className="w-24 h-24 mx-auto mb-8 bg-red-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Something went wrong
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                        Please try again.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={reset}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Try Again
                        </motion.button>

                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="/"
                            className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-stone-200/50 dark:border-white/10 text-foreground px-6 py-3 rounded-full font-medium hover:bg-white dark:hover:bg-white/20 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Go Home
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
