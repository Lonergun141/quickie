"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSessionNavigationProps {
    currentIndex: number;
    totalQuestions: number;
    answers: (number | null)[];
    onPrevious: () => void;
    onNext: () => void;
    onJumpTo: (index: number) => void;
}

export function QuizSessionNavigation({
    currentIndex,
    totalQuestions,
    answers,
    onPrevious,
    onNext,
    onJumpTo
}: QuizSessionNavigationProps) {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;

    return (
        <div className="flex items-center justify-between mt-6">
            <button
                onClick={onPrevious}
                disabled={isFirst}
                className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                    isFirst
                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-foreground"
                )}
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-1">
                {Array.from({ length: totalQuestions }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => onJumpTo(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            idx === currentIndex
                                ? "w-6 bg-primary"
                                : answers[idx] !== null
                                    ? "bg-emerald-400"
                                    : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                        )}
                    />
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={isLast}
                className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all",
                    isLast
                        ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-foreground"
                )}
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
