"use client";

import { motion } from "framer-motion";
import { Flag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizChoice } from "@/hooks/useQuizzes";

interface QuizSessionQuestionCardProps {
    questionNumber: number;
    questionText: string;
    choices: QuizChoice[];
    selectedAnswer: number | null;
    isFlagged: boolean;
    onAnswer: (choiceIndex: number) => void;
    onFlag: () => void;
}

export function QuizSessionQuestionCard({
    questionNumber,
    questionText,
    choices,
    selectedAnswer,
    isFlagged,
    onAnswer,
    onFlag
}: QuizSessionQuestionCardProps) {
    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="p-6 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {questionNumber}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Question
                    </span>
                </div>
                <button
                    onClick={onFlag}
                    className={cn(
                        "p-2.5 rounded-xl transition-all duration-200",
                        isFlagged
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-400 hover:text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                    )}
                >
                    <Flag className={cn("w-5 h-5", isFlagged && "fill-current")} />
                </button>
            </div>

            {/* Question Text */}
            <div className="p-6 pt-4">
                <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {questionText}
                </h2>
            </div>

            {/* Choices */}
            <div className="p-6 pt-2 space-y-3">
                {choices.map((choice, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                        <motion.button
                            key={choice.id}
                            onClick={() => onAnswer(index)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                                "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center group",
                                isSelected
                                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                                    : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 hover:border-primary/30 dark:hover:border-primary/30"
                            )}
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center mr-4 text-sm font-bold border transition-all",
                                isSelected
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 group-hover:border-primary/50 group-hover:text-primary"
                            )}>
                                {String.fromCharCode(65 + index)}
                            </div>
                            <span className={cn(
                                "font-medium text-base flex-1",
                                isSelected
                                    ? "text-primary"
                                    : "text-zinc-700 dark:text-zinc-300"
                            )}>
                                {choice.item_choice_text}
                            </span>
                            {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-primary ml-2" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
