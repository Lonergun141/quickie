"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Hash } from "lucide-react";

interface ResultsStatsRowProps {
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
}

export function ResultsStatsRow({
    correctCount,
    incorrectCount,
    totalQuestions
}: ResultsStatsRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2"
        >
            {/* Correct */}
            <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20 p-3 text-center">
                <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</p>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Correct</p>
            </div>

            {/* Incorrect */}
            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200/50 dark:border-red-500/20 p-3 text-center">
                <XCircle className="w-4 h-4 mx-auto text-red-600 dark:text-red-400 mb-1" />
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{incorrectCount}</p>
                <p className="text-[10px] text-red-600/70 dark:text-red-400/70">Incorrect</p>
            </div>

            {/* Total */}
            <div className="bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-white/20 dark:border-zinc-800/50 p-3 text-center">
                <Hash className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold">{totalQuestions}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
        </motion.div>
    );
}
