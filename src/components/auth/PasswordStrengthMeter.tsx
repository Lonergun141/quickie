"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PasswordStrengthMeterProps {
    password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    // Calculate strength (0-4)
    const getStrength = (pwd: string) => {
        let score = 0;
        if (!pwd) return 0;

        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;

        // Cap at 4
        return Math.min(score, 4);
    };

    const strength = getStrength(password);

    // Labels corresponding to 0-4
    const labels = ["Enter password", "Weak", "Fair", "Good", "Strong"];

    // Colors for active segments based on TOTAL strength
    // If strength is 1, active bars are Red.
    // If strength is 2, active bars are Yellow.
    // If strength is 3, active bars are Green.
    // If strength is 4, active bars are Emerald.
    const colors = [
        "bg-zinc-200 dark:bg-zinc-800", // 0 (Inactive base)
        "bg-red-500",                   // 1
        "bg-yellow-500",                // 2
        "bg-green-500",                 // 3
        "bg-emerald-500"                // 4
    ];

    return (
        <div className="space-y-2 mt-3">
            {/* Bars */}
            <div className="flex gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((level) => {
                    const isActive = strength >= level;
                    const activeColor = colors[strength]; // Use the color corresponding to current TOTAL strength for uniform look

                    return (
                        <div
                            key={level}
                            className="flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    width: isActive ? "100%" : "0%",
                                }}
                                className={cn(
                                    "h-full w-full rounded-full transition-colors duration-300",
                                    isActive ? activeColor : ""
                                )}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Label & Requirements */}
            <div className="flex justify-between items-start">
                <span className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    strength > 0 ? "text-zinc-900 dark:text-white" : "text-muted-foreground"
                )}>
                    {password ? labels[strength] : "Password strength"}
                </span>

                {/* Optional mini helper text if needed, or keep clean */}
            </div>

            {/* Detailed Requirements (Optional, but good UX) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                <Requirement label="12+ characters" met={password.length >= 12} />
                <Requirement label="Uppercase letter" met={/[A-Z]/.test(password)} />
                <Requirement label="Number" met={/[0-9]/.test(password)} />
                <Requirement label="Special character" met={/[^a-zA-Z0-9]/.test(password)} />
            </div>
        </div>
    );
}

function Requirement({ label, met }: { label: string; met: boolean }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn(
                "w-3 h-3 rounded-full flex items-center justify-center text-[8px]",
                met ? "bg-emerald-500/20 text-emerald-600" : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground"
            )}>
                {met && "✓"}
            </div>
            <span className={cn(
                "text-xs",
                met ? "text-zinc-700 dark:text-zinc-300" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </div>
    );
}
