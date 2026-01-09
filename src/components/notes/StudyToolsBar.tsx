"use client";

import { Copy, Lightbulb, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyToolsBarProps {
    flashcardsExist: boolean;
    quizExists: boolean;
    isGeneratingFlashcards: boolean;
    isGeneratingQuiz: boolean;
    onFlashcardsClick: () => void;
    onQuizClick: () => void;
}

export function StudyToolsBar({
    flashcardsExist,
    quizExists,
    isGeneratingFlashcards,
    isGeneratingQuiz,
    onFlashcardsClick,
    onQuizClick,
}: StudyToolsBarProps) {
    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={onFlashcardsClick}
                disabled={isGeneratingFlashcards}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                    flashcardsExist
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
            >
                {isGeneratingFlashcards ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
                {flashcardsExist ? 'Flashcards' : 'Create Flashcards'}
                {flashcardsExist && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
            </button>

            <button
                onClick={onQuizClick}
                disabled={isGeneratingQuiz}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                    quizExists
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
            >
                {isGeneratingQuiz ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Lightbulb className="w-4 h-4" />
                )}
                {quizExists ? 'Quiz' : 'Create Quiz'}
                {quizExists && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
            </button>
        </div>
    );
}
