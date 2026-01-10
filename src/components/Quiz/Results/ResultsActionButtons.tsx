"use client";

import { motion } from "framer-motion";
import { RotateCcw, BookOpen } from "lucide-react";

interface ResultsActionButtonsProps {
    onRetake: () => void;
    onReviewNotes: () => void;
}

export function ResultsActionButtons({
    onRetake,
    onReviewNotes
}: ResultsActionButtonsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mt-auto"
        >
            <button
                onClick={onRetake}
                className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-[0.98]"
            >
                <RotateCcw className="w-4 h-4 group-hover:rotate-[-360deg] transition-transform duration-500" />
                Retake Quiz
            </button>
            <button
                onClick={onReviewNotes}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 font-semibold text-sm hover:bg-white dark:hover:bg-zinc-800 transition-all"
            >
                <BookOpen className="w-4 h-4" />
                Review Notes
            </button>
        </motion.div>
    );
}
