"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeInfo } from "@/lib/quizResults";
import { ResultsScoreCard } from "./ResultsScoreCard";
import { ResultsStatsRow } from "./ResultsStatsRow";
import { ResultsActionButtons } from "./ResultsActionButtons";

interface ResultsLeftPanelProps {
    percentage: number;
    noteTitle: string;
    dateCreated: string;
    gradeInfo: GradeInfo;
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
    onBack: () => void;
    onRetake: () => void;
    onReviewNotes: () => void;
}

export function ResultsLeftPanel({
    percentage,
    noteTitle,
    dateCreated,
    gradeInfo,
    correctCount,
    incorrectCount,
    totalQuestions,
    onBack,
    onRetake,
    onReviewNotes
}: ResultsLeftPanelProps) {
    return (
        <div className="lg:w-[380px] lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen">
            <div className="h-full flex flex-col p-4 lg:p-6 lg:py-8 space-y-4">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Quiz History</span>
                </motion.button>

                {/* Score Card */}
                <ResultsScoreCard
                    percentage={percentage}
                    noteTitle={noteTitle}
                    dateCreated={dateCreated}
                    gradeInfo={gradeInfo}
                />

                {/* Stats Row */}
                <ResultsStatsRow
                    correctCount={correctCount}
                    incorrectCount={incorrectCount}
                    totalQuestions={totalQuestions}
                />

                {/* Action Buttons */}
                <ResultsActionButtons
                    onRetake={onRetake}
                    onReviewNotes={onReviewNotes}
                />
            </div>
        </div>
    );
}
