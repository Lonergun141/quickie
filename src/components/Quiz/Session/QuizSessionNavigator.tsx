"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSessionNavigatorProps {
    isOpen: boolean;
    onClose: () => void;
    totalQuestions: number;
    currentIndex: number;
    answers: (number | null)[];
    flags: boolean[];
    answeredCount: number;
    flaggedCount: number;
    progressPercent: number;
    onJumpTo: (index: number) => void;
}

export function QuizSessionNavigator({
    isOpen,
    onClose,
    totalQuestions,
    currentIndex,
    answers,
    flags,
    answeredCount,
    flaggedCount,
    progressPercent,
    onJumpTo
}: QuizSessionNavigatorProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Navigator Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden"
                    >
                        <div className="p-6 h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-bold text-lg">Question Navigator</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {answeredCount} of {totalQuestions} answered
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mb-6 p-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-emerald-500" />
                                    <span className="text-muted-foreground">Answered</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-amber-500" />
                                    <span className="text-muted-foreground">Flagged</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-zinc-300 dark:bg-zinc-700" />
                                    <span className="text-muted-foreground">Unanswered</span>
                                </div>
                            </div>

                            {/* Question Grid */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                                        const isAnswered = answers[idx] !== null;
                                        const isFlagged = flags[idx];
                                        const isCurrent = idx === currentIndex;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => onJumpTo(idx)}
                                                className={cn(
                                                    "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative border-2",
                                                    isCurrent
                                                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                                                        : isFlagged
                                                            ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                                            : isAnswered
                                                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                                : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
                                                )}
                                            >
                                                {idx + 1}
                                                {isFlagged && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                                                        <Flag className="w-2 h-2 text-white fill-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="mt-6 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Flagged for Review</span>
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">{flaggedCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Unanswered</span>
                                    <span className="font-semibold text-zinc-600 dark:text-zinc-400">{totalQuestions - answeredCount}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
