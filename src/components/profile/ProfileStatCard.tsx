"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";

interface ProfileStatCardProps {
    title: string;
    value: number;
    subtext: string;
    icon: LucideIcon;
    colorClass: string; // e.g., "text-blue-600 dark:text-blue-400"
    bgClass: string; // e.g., "bg-blue-50 dark:bg-blue-900/20"
    borderHoverClass?: string; // e.g., "hover:border-blue-500/30"
    barColorClass: string; // e.g., "bg-blue-500"
    variants: any;
    onClick?: () => void;
    showPercent?: boolean;
}

export function ProfileStatCard({
    title,
    value,
    subtext,
    icon: Icon,
    colorClass,
    bgClass,
    borderHoverClass,
    barColorClass,
    variants,
    onClick,
    showPercent = false
}: ProfileStatCardProps) {
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={cn(
                "md:col-span-1 lg:col-span-4 relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col justify-between transition-colors group",
                onClick && "cursor-pointer",
                borderHoverClass
            )}
        >
            <div className="flex justify-between items-start">
                <div className={cn("p-2.5 rounded-xl", bgClass, colorClass)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-1">{title}</div>
            </div>

            <div>
                <div className="text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-2 flex items-baseline gap-1">
                    <AnimatedCounter value={value} />
                    {showPercent && <span className="text-2xl text-zinc-300 dark:text-zinc-600">%</span>}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{subtext}</p>
            </div>

            {/* Simple Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: showPercent ? `${Math.min(value, 100)}%` : "100%" }}
                    transition={{ duration: 1 }}
                    className={cn("h-full rounded-full", barColorClass)}
                />
            </div>
        </motion.div>
    );
}
