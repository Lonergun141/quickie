"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ResultsQuestionCard } from "./ResultsQuestionCard";

interface Question {
    id: number;
    TestQuestion: string;
}

interface Choice {
    id: number;
    item_choice_text: string;
    isAnswer: boolean;
}

interface ResultsQuestionListProps {
    questions: Question[];
    choicesByQuestion: { [key: number]: Choice[] };
    userAnswersByQuestion: { [key: number]: Choice | null };
}

export function ResultsQuestionList({
    questions,
    choicesByQuestion,
    userAnswersByQuestion
}: ResultsQuestionListProps) {
    const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({});

    const toggleQuestion = (qId: number) => {
        setExpandedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    return (
        <div className="p-4 lg:p-8 space-y-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between sticky top-0 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl py-4 -mt-4 z-10"
            >
                <h2 className="text-xl font-bold">Question Review</h2>
                <span className="text-sm text-muted-foreground bg-white/60 dark:bg-zinc-900/60 px-3 py-1 rounded-full border border-white/20 dark:border-zinc-800/50">
                    {questions.length} questions
                </span>
            </motion.div>

            {/* Questions List */}
            <div className="space-y-3">
                {questions.map((q, idx) => (
                    <ResultsQuestionCard
                        key={q.id}
                        question={q}
                        index={idx}
                        choices={choicesByQuestion[q.id] || []}
                        userChoice={userAnswersByQuestion[q.id] || null}
                        isExpanded={expandedQuestions[q.id] || false}
                        onToggle={() => toggleQuestion(q.id)}
                    />
                ))}
            </div>
        </div>
    );
}
