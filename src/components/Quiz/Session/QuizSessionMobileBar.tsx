"use client";

import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSessionMobileBarProps {
    currentIndex: number;
    totalQuestions: number;
    submitting: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

export function QuizSessionMobileBar({
    currentIndex,
    totalQuestions,
    submitting,
    onPrevious,
    onNext,
    onSubmit
}: QuizSessionMobileBarProps) {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 md:hidden z-30">
            <div className="flex items-center gap-3">
                <button
                    onClick={onPrevious}
                    disabled={isFirst}
                    className={cn(
                        "p-3 rounded-xl transition-all",
                        isFirst
                            ? "text-zinc-300 dark:text-zinc-700"
                            : "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                    <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
                </button>

                <button
                    onClick={onNext}
                    disabled={isLast}
                    className={cn(
                        "p-3 rounded-xl transition-all",
                        isLast
                            ? "text-zinc-300 dark:text-zinc-700"
                            : "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900"
                    )}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
