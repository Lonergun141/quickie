"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CheckCircle2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, Achievement } from "@/hooks/useProfileStats";

interface ProfileBadgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    badgeDefinitions: Record<string, Badge>;
    achievements: Achievement[];
}

export function ProfileBadgeModal({
    isOpen,
    onClose,
    badgeDefinitions,
    achievements
}: ProfileBadgeModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    const earnedCount = Object.values(badgeDefinitions).filter(badge =>
        achievements.some(a => a.badge === badge.id)
    ).length;

    const totalCount = Object.keys(badgeDefinitions).length;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 p-6 lg:p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20 text-white">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
                                    <p className="text-muted-foreground font-medium">
                                        {earnedCount} of {totalCount} badges unlocked
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Grid */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                {Object.values(badgeDefinitions).map((badge) => {
                                    const isEarned = achievements.some(a => a.badge === badge.id);

                                    return (
                                        <motion.div
                                            key={badge.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ y: -4 }}
                                            className={cn(
                                                "group relative flex flex-col items-center text-center p-5 rounded-3xl border transition-all duration-300",
                                                isEarned
                                                    ? "bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-white/50 dark:border-white/10 shadow-xl shadow-black/5"
                                                    : "bg-black/5 dark:bg-white/5 border-transparent opacity-60 grayscale hover:opacity-80 hover:grayscale-0"
                                            )}
                                        >
                                            {/* Status Icon */}
                                            <div className="absolute top-3 right-3">
                                                {isEarned ? (
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white dark:fill-zinc-950" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </div>

                                            {/* Badge Image */}
                                            <div className="w-24 h-24 mb-4 relative drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={badge.image}
                                                    alt={badge.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Text */}
                                            <h3 className={cn(
                                                "font-bold text-sm mb-1",
                                                isEarned ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {badge.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {badge.description}
                                            </p>

                                            {/* Shine effect for earned badges */}
                                            {isEarned && (
                                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
