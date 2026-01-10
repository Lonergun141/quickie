"use client";

import { Quiz } from "@/hooks/useQuizzes";
import { format } from "date-fns";
import { MoreVertical, Trash, PlayCircle, CheckCircle2, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface QuizCardProps {
    quiz: Quiz;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export function QuizCard({ quiz, onClick, onDelete }: QuizCardProps) {
    const scorePercentage = quiz.TestTotalScore > 0
        ? (quiz.TestScore / quiz.TestTotalScore) * 100
        : 0;
    const isPassing = scorePercentage >= 70;

    return (
        <div
            onClick={onClick}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/20 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mr-4">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-primary transition-colors">
                        {quiz.notetitle || `Quiz ${quiz.note}`}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Taken {format(new Date(quiz.TestDateCreated), 'MMM d, yyyy')}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5
                        ${isPassing
                            ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-100/50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                    >
                        {isPassing ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {quiz.TestScore}/{quiz.TestTotalScore}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 -mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    onDelete(e);
                                }}
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                            >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete Quiz
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Progress Bar Visual */}
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isPassing ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${scorePercentage}%` }}
                />
            </div>

            <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <PlayCircle className="w-4 h-4 mr-1.5" />
                Retake Quiz
            </div>
        </div>
    );
}
