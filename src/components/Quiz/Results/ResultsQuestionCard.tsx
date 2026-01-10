"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Choice {
    id: number;
    item_choice_text: string;
    isAnswer: boolean;
}

interface Question {
    id: number;
    TestQuestion: string;
}

interface ResultsQuestionCardProps {
    question: Question;
    index: number;
    choices: Choice[];
    userChoice: Choice | null;
    isExpanded: boolean;
    onToggle: () => void;
}

export function ResultsQuestionCard({
    question,
    index,
    choices,
    userChoice,
    isExpanded,
    onToggle
}: ResultsQuestionCardProps) {
    const isCorrect = userChoice?.isAnswer ?? false;
    const userChoiceId = userChoice?.id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.02 }}
            className={cn(
                "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border overflow-hidden transition-all",
                isExpanded
                    ? "border-primary/30 shadow-lg shadow-primary/5"
                    : "border-white/20 dark:border-zinc-800/50 hover:border-primary/20"
            )}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-start gap-4 p-5 text-left transition-colors"
            >
                {/* Question Number Badge */}
                <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors",
                    isCorrect
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                )}>
                    {index + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {isCorrect ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Correct
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                                <XCircle className="w-3 h-3" /> Incorrect
                            </span>
                        )}
                    </div>
                    <h3 className="font-medium leading-relaxed">{question.TestQuestion}</h3>

                    {!isExpanded && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                            Your answer: {userChoice?.item_choice_text || "Skipped"}
                        </p>
                    )}
                </div>

                {/* Expand Icon */}
                <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isExpanded ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                            <div className="pt-4 space-y-2">
                                {choices.map((choice, choiceIdx) => {
                                    const isUserChoice = choice.id === userChoiceId;
                                    const isCorrectAnswer = choice.isAnswer;

                                    return (
                                        <div
                                            key={choice.id}
                                            className={cn(
                                                "p-4 rounded-xl text-sm border-2 flex items-start gap-3 transition-all",
                                                isCorrectAnswer
                                                    ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                                                    : isUserChoice
                                                        ? "bg-red-50 border-red-300 dark:bg-red-500/10 dark:border-red-500/30"
                                                        : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700"
                                            )}
                                        >
                                            <span className={cn(
                                                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                                isCorrectAnswer
                                                    ? "bg-emerald-500 text-white"
                                                    : isUserChoice
                                                        ? "bg-red-500 text-white"
                                                        : "bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300"
                                            )}>
                                                {String.fromCharCode(65 + choiceIdx)}
                                            </span>
                                            <span className="flex-1">{choice.item_choice_text}</span>
                                            {isCorrectAnswer && (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                            )}
                                            {isUserChoice && !isCorrectAnswer && (
                                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
