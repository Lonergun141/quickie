"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SettingsCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    action?: React.ReactNode;
    className?: string;
    showArrow?: boolean;
}

export function SettingsCard({
    icon,
    title,
    description,
    onClick,
    action,
    className = "",
    showArrow = false
}: SettingsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className={`group bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer hover:border-black/10 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-zinc-900/60 ${className}`}
        >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {icon}
            </div>

            <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-base text-foreground truncate">{title}</h3>
                <p className="text-sm text-muted-foreground truncate">{description}</p>
            </div>

            {action ? (
                <div onClick={(e) => e.stopPropagation()}>
                    {action}
                </div>
            ) : showArrow ? (
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : null}
        </motion.div>
    );
}
