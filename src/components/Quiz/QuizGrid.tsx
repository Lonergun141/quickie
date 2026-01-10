"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quiz } from "@/hooks/useQuizzes";
import { QuizCard } from "./QuizCard";
import { QuizSkeleton } from "./QuizSkeleton";
import { QuizEmptyState } from "./QuizEmptyState";

interface QuizGridProps {
    loading: boolean;
    quizzes: Quiz[];
    hasActiveFilters: boolean;
    currentPage: number;
    sortOption: string;
    scoreFilter: string;
    dateFilter: string;
    onQuizClick: (quiz: Quiz) => void;
    onQuizDelete: (quiz: Quiz) => void;
    onClearFilters: () => void;
    onGoToDashboard: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function QuizGrid({
    loading,
    quizzes,
    hasActiveFilters,
    currentPage,
    sortOption,
    scoreFilter,
    dateFilter,
    onQuizClick,
    onQuizDelete,
    onClearFilters,
    onGoToDashboard
}: QuizGridProps) {
    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <QuizSkeleton key={i} />)}
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <QuizEmptyState
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
                onGoToDashboard={onGoToDashboard}
            />
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`page-${currentPage}-${sortOption}-${scoreFilter}-${dateFilter}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {quizzes.map(quiz => (
                    <motion.div key={quiz.note} variants={itemVariants} layout>
                        <QuizCard
                            quiz={quiz}
                            onClick={() => onQuizClick(quiz)}
                            onDelete={() => onQuizDelete(quiz)}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}
