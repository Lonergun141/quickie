"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FullPageLoaderProps {
    isLoading: boolean;
    text?: string;
    subtext?: string;
}

export function FullPageLoader({
    isLoading,
    text = "PROCESSING",
    subtext = "INITIATING SEQUENCE"
}: FullPageLoaderProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-3xl overflow-hidden"
                >
                    {/* Cinematic Grain/Noise Overlay - Inverted for light mode to stay visible */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 dark:invert-0 invert" />

                    {/* Ambient Light Effects - Adapted colors */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse duration-[5000ms] delay-1000" />

                    <div className="relative flex flex-col items-center gap-12 z-10">
                        {/* Nolan-esque Gyroscope Animation */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32">
                            {/* Ring 1 - Outer Slow */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-[1px] border-zinc-900/20 dark:border-white/20 border-t-zinc-900/80 dark:border-t-white/80 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />

                            {/* Ring 2 - Middle Reverse */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-[1px] border-zinc-900/10 dark:border-white/10 border-b-zinc-900/60 dark:border-b-white/60"
                            />

                            {/* Ring 3 - Inner Fast */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 rounded-full border-[1px] border-zinc-900/30 dark:border-white/30 border-l-zinc-900 dark:border-l-white"
                            />

                            {/* Center Core */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] dark:shadow-[0_0_20px_white]"
                                />
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="flex flex-col items-center gap-4 text-center">
                            <motion.div className="overflow-hidden">
                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                                    className="text-2xl md:text-3xl font-light tracking-[0.3em] text-foreground uppercase"
                                >
                                    {text}
                                </motion.h3>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 1 }}
                                className="h-px w-12 bg-zinc-900/20 dark:bg-white/20"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="text-xs md:text-sm text-foreground/60 tracking-[0.2em] uppercase"
                            >
                                {subtext}
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
