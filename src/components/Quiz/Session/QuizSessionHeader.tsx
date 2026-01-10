"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Send, LayoutGrid } from "lucide-react";

interface QuizSessionHeaderProps {
    currentIndex: number;
    totalQuestions: number;
    answeredCount: number;
    flaggedCount: number;
    progressPercent: number;
    submitting: boolean;
    onBack: () => void;
    onNavigatorOpen: () => void;
    onSubmit: () => void;
}

export function QuizSessionHeader({
    currentIndex,
    totalQuestions,
    answeredCount,
    flaggedCount,
    progressPercent,
    submitting,
    onBack,
    onNavigatorOpen,
    onSubmit
}: QuizSessionHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Back + Title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="font-semibold text-sm">Quiz Session</h1>
                            <p className="text-xs text-muted-foreground">
                                Question {currentIndex + 1} of {totalQuestions}
                            </p>
                        </div>
                    </div>

                    {/* Center: Progress Bar (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
                        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {answeredCount}/{totalQuestions}
                        </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Navigator Toggle */}
                        <button
                            onClick={onNavigatorOpen}
                            className="p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
                        >
                            <LayoutGrid className="w-5 h-5" />
                            {flaggedCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {flaggedCount}
                                </span>
                            )}
                        </button>

                        {/* Submit Button (Desktop) */}
                        <button
                            onClick={onSubmit}
                            disabled={submitting}
                            className="hidden md:flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Progress */}
                <div className="md:hidden pb-3">
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
