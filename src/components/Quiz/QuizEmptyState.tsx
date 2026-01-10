"use client";

import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

interface QuizEmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onGoToDashboard: () => void;
}

export function QuizEmptyState({
    hasActiveFilters,
    onClearFilters,
    onGoToDashboard
}: QuizEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800"
        >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">
                {hasActiveFilters ? 'No Matching Quizzes' : 'No Quiz History Yet'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                {hasActiveFilters
                    ? 'Try adjusting your filters to find more quizzes.'
                    : 'Take quizzes on your notes to start tracking your progress.'
                }
            </p>
            {hasActiveFilters ? (
                <button
                    onClick={onClearFilters}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all"
                >
                    Clear Filters
                </button>
            ) : (
                <button
                    onClick={onGoToDashboard}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all"
                >
                    Go to Dashboard
                </button>
            )}
        </motion.div>
    );
}
