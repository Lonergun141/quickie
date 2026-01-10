"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Trophy } from "lucide-react";

interface ProfileUserCardProps {
    user: any; // Using any for auth context user type for now, ideally strictly typed
    variants: any; // Framer motion variants
}

export function ProfileUserCard({ user, variants }: ProfileUserCardProps) {
    return (
        <motion.div
            variants={variants}
            className="md:col-span-2 lg:col-span-8 relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 h-full">
                {/* Avatar */}
                <div className="relative group shrink-0">
                    <div className="w-28 h-28 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 flex items-center justify-center text-4xl font-bold text-zinc-700 dark:text-zinc-200 shadow-sm">
                        {user?.firstname?.charAt(0).toUpperCase() || "U"}
                    </div>

                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left pt-1">
                    <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                        {user?.firstname} {user?.lastname}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-6">
                        {user?.email}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center gap-2 border border-primary/20">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Rank: Scholar</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-2 border border-zinc-200 dark:border-zinc-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Joined 2024</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
