"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeInfo, getScoreColorClass, getBadgeColorClasses } from "@/lib/quizResults";

interface ResultsScoreCardProps {
    percentage: number;
    noteTitle: string;
    dateCreated: string;
    gradeInfo: GradeInfo;
}

export function ResultsScoreCard({
    percentage,
    noteTitle,
    dateCreated,
    gradeInfo
}: ResultsScoreCardProps) {
    const GradeIcon = gradeInfo.icon;
    const strokeColor = getScoreColorClass(percentage, 'stroke');
    const badgeColors = getBadgeColorClasses(percentage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-800/50 p-6 relative overflow-hidden flex flex-col"
        >
            {/* Decorative gradients */}
            <div className={cn(
                "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20",
                percentage >= 70 ? "bg-emerald-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"
            )} />
            <div className={cn(
                "absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-10",
                percentage >= 70 ? "bg-emerald-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500"
            )} />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                >
                    <h1 className="text-xl font-bold mb-1">Quiz Results</h1>
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                        {noteTitle || "Quiz"}
                    </p>
                </motion.div>

                {/* Large Circular Score */}
                <div className="relative mb-4">
                    <svg className="w-32 h-32 -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            className="stroke-zinc-200 dark:stroke-zinc-800"
                            strokeWidth="10"
                            fill="none"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            className={strokeColor}
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ strokeDasharray: `${(percentage / 100) * 352} 352` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-bold"
                        >
                            {percentage}%
                        </motion.span>
                        <span className="text-xs text-muted-foreground">Score</span>
                    </div>
                </div>

                {/* Grade Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4", badgeColors)}
                >
                    <GradeIcon className="w-4 h-4" />
                    {gradeInfo.message}
                </motion.div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(dateCreated).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
            </div>
        </motion.div>
    );
}
