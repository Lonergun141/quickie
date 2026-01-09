"use client";

import { motion } from "framer-motion";
import { User } from "@/lib/auth/types";
import { Badge, UserStats, Achievement } from "@/hooks/useProfileStats";
import { CheckCircle2, Lock, Medal, Trophy, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// --- User Info Card ---
export function UserInfoCard({ user }: { user: User | null }) {
    if (!user) return null;

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border-2 border-stone-200 dark:border-stone-700 flex items-center justify-center text-4xl font-bold text-primary">
                        {user.firstname?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {user.firstname} {user.lastname}
                    </h1>
                    <p className="text-muted-foreground font-medium">{user.email}</p>

                </div>
            </div>
        </div>
    );
}

// --- Stats Card ---
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    colorClass?: string;
    progressBar?: {
        percentage: number;
        colorClass?: string;
    };
    onClick?: () => void;
}

export function StatCard({ title, value, icon, subtitle, colorClass = "text-primary", progressBar, onClick }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className={cn(
                "relative bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all",
                onClick && "hover:border-primary/50 dark:hover:border-primary/50"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50", colorClass)}>
                    {icon}
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold tracking-tight mb-1">{value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground/60 mt-1">{subtitle}</p>}
            </div>

            {progressBar && (
                <div className="mt-4 h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressBar.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", progressBar.colorClass || "bg-primary")}
                    />
                </div>
            )}
        </motion.div>
    );
}

// --- Badge Grid ---
export function BadgesSection({
    achievements,
    badgeDefinitions,
    onViewAll
}: {
    achievements: Achievement[];
    badgeDefinitions: Record<string, Badge>;
    onViewAll: () => void;
}) {
    const earnedBadgeIds = achievements.map(a => a.badge);
    const badges = Object.values(badgeDefinitions);
    const earnedCount = earnedBadgeIds.length;
    const totalCount = badges.length;

    // Show only first 6 badges or all if specifically designed, sticking to a preview row usually
    // But design requests grid. Let's show up to 6 in the main view.
    const previewBadges = badges.slice(0, 6);

    return (
        <div className="bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Badges</h2>
                        <p className="text-xs text-muted-foreground">{earnedCount} of {totalCount} unlocked</p>
                    </div>
                </div>
                <button
                    onClick={onViewAll}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {previewBadges.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    return (
                        <div key={badge.id} className="group flex flex-col items-center gap-2">
                            <div className={cn(
                                "relative w-full aspect-square rounded-2xl flex items-center justify-center p-3 transition-all duration-300",
                                isEarned
                                    ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50"
                                    : "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 opacity-60 grayscale"
                            )}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={badge.image}
                                    alt={badge.title}
                                    className={cn(
                                        "w-full h-full object-contain drop-shadow-md transition-transform duration-300",
                                        isEarned ? "group-hover:scale-110" : "scale-90"
                                    )}
                                />
                                {isEarned && (
                                    <div className="absolute top-1 right-1">
                                        <CheckCircle2 size={14} className="text-green-500 fill-white dark:fill-zinc-900" />
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-center truncate w-full px-1 text-muted-foreground group-hover:text-foreground transition-colors">
                                {badge.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- Modal ---
export function SimpleModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
                <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-muted-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
