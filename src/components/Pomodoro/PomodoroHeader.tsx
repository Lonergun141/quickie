"use client";

import { motion } from "framer-motion";

export function PomodoroHeader() {
    return (
        <div className="relative overflow-hidden border rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-12 md:py-20 text-center">

            <div className="relative z-10 max-w-2xl mx-auto px-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                        Focus Assist
                    </h1>
                    <div className="h-px w-24 mx-auto bg-zinc-900 dark:bg-zinc-100" />
                    <p className="text-xs md:text-sm font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                        Productivity & Time Management
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
