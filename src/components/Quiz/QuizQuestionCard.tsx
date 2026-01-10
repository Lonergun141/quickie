"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestionCardProps {
    questionNumber: number;
    question: string;
    choices: string[];
    selectedAnswer: number | null;
    onAnswer: (index: number) => void;
    onFlag: () => void;
    isFlagged: boolean;
}

export function QuizQuestionCard({
    questionNumber,
    question,
    choices,
    selectedAnswer,
    onAnswer,
    onFlag,
    isFlagged
}: QuizQuestionCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
                    Question {questionNumber}
                </span>
                <button
                    onClick={onFlag}
                    className={cn(
                        "p-2 rounded-full transition-all duration-200",
                        isFlagged
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
                            : "bg-zinc-100 text-zinc-400 hover:text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <Flag className={cn("w-5 h-5", isFlagged && "fill-current")} />
                </button>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 leading-relaxed">
                {question}
            </h2>

            {/* Choices */}
            <div className="space-y-3">
                {choices.map((choice, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                        <motion.button
                            key={index}
                            onClick={() => onAnswer(index)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group",
                                isSelected
                                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                                    : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-primary/50 dark:hover:border-primary/50"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-sm font-bold border transition-colors",
                                isSelected
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 group-hover:border-primary/50 group-hover:text-primary"
                            )}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className={cn(
                                "font-medium text-base",
                                isSelected
                                    ? "text-primary bg-transparent" // fixed text-primary
                                    : "text-zinc-700 dark:text-zinc-300"
                            )}>
                                {choice}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
