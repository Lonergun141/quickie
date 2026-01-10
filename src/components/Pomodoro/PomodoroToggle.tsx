"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Power, Timer } from "lucide-react";

interface PomodoroToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

export function PomodoroToggle({ enabled, onChange, disabled }: PomodoroToggleProps) {
    return (
        <div className="w-full h-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between group hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 rounded-lg">

            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Focus Timer
                    </h2>
                    <p className="text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-500 mt-2">
                        {enabled ? "Timer is Active" : "Timer is Disabled"}
                    </p>
                </div>

                <button
                    onClick={() => !disabled && onChange(!enabled)}
                    disabled={disabled}
                    className={cn(
                        "relative w-14 h-8 transition-all duration-300",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {/* Track */}
                    <div className={cn(
                        "absolute inset-0 rounded-full border transition-all duration-300",
                        enabled
                            ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100"
                            : "border-zinc-300 dark:border-zinc-700 bg-transparent"
                    )} />

                    {/* Thumb */}
                    <motion.div
                        initial={false}
                        animate={{
                            x: enabled ? 24 : 4,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                        className={cn(
                            "absolute top-1 left-0 w-6 h-6 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm z-10 rounded-full",
                            enabled ? "dark:bg-black" : ""
                        )}
                    />
                </button>
            </div>

            <div className="mt-8 flex items-center gap-3 opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 text-zinc-900 dark:text-zinc-100">
                <Timer className="w-5 h-5" />
                <span className="text-xs font-medium tracking-wide">
                    {enabled ? "Running" : "Paused"}
                </span>
            </div>
        </div>
    );
}
