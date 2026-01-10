"use client";

import { motion } from "framer-motion";
import { Award, ArrowUpRight, Star } from "lucide-react";
import { Badge } from "@/hooks/useProfileStats";

interface ProfileAchievementsCardProps {
    earnedCount: number;
    displayBadges: Badge[];
    onOpen: () => void;
    variants: any;
}

export function ProfileAchievementsCard({ earnedCount, displayBadges, onOpen, variants }: ProfileAchievementsCardProps) {
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -4 }}
            onClick={onOpen}
            className="md:col-span-2 lg:col-span-4 cursor-pointer group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Achievements</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{earnedCount} unlocked</p>
                    </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors" />
            </div>

            <div className="flex gap-4 overflow-hidden">
                {displayBadges.map((badge, idx) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="w-16 h-16 flex-shrink-0 p-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={badge.image} alt={badge.title} className="w-full h-full object-contain drop-shadow-sm" />
                    </motion.div>
                ))}
                {Array.from({ length: Math.max(0, 3 - displayBadges.length) }).map((_, i) => (
                    <div key={i} className="w-16 h-16 flex-shrink-0 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-center opacity-50">
                        <Star className="w-5 h-5 text-zinc-200 dark:text-zinc-700" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
