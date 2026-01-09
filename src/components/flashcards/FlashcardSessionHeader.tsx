"use client";

import { ChevronRight, ArrowLeft, RotateCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flashcard } from "@/hooks/useFlashcards";

interface FlashcardSessionHeaderProps {
    onBack: () => void;
    onHome: () => void;
    onNotes: () => void;
    onFlashcards: () => void;
    onNoteDetail: () => void;
    fromParam: string | null;
    noteTitleParam: string | null;
    cards: Flashcard[];
    currentIndex: number;
    studyMode: 'term-first' | 'definition-first';
    setStudyMode: (mode: 'term-first' | 'definition-first') => void;
    onBatchDelete: () => void;
}

export function FlashcardSessionHeader({
    onBack,
    onHome,
    onNotes,
    onFlashcards,
    onNoteDetail,
    fromParam,
    noteTitleParam,
    cards,
    currentIndex,
    studyMode,
    setStudyMode,
    onBatchDelete
}: FlashcardSessionHeaderProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground overflow-hidden whitespace-nowrap mask-linear-fade">
                <span className="hover:text-foreground transition-colors cursor-pointer" onClick={onHome}>Home</span>
                <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />

                {fromParam === 'note' && noteTitleParam && (
                    <>
                        <span className="hover:text-foreground transition-colors cursor-pointer" onClick={onNotes}>Notes</span>
                        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />
                        <span className="hover:text-foreground transition-colors cursor-pointer truncate max-w-[150px]" onClick={onNoteDetail}>{noteTitleParam}</span>
                        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />
                    </>
                )}

                {(!fromParam || fromParam === 'sets') && (
                    <>
                        <span className="hover:text-foreground transition-colors cursor-pointer" onClick={onFlashcards}>Flashcards</span>
                        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />
                    </>
                )}
                <span className="font-medium text-foreground truncate">Session</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 border border-stone-200 dark:border-stone-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Flashcard Session</h1>
                        <p className="text-sm text-muted-foreground">
                            {cards.length > 0 ? `Card ${currentIndex + 1} of ${cards.length}` : 'Loading...'}
                        </p>
                    </div>
                </div>

                {/* Session Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setStudyMode(studyMode === 'term-first' ? 'definition-first' : 'term-first')}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 border border-stone-200 dark:border-stone-800 text-sm font-medium transition-colors"
                    >
                        <RotateCw className={cn("w-4 h-4 transition-transform", studyMode === 'definition-first' && "rotate-180")} />
                        {studyMode === 'term-first' ? 'Terms First' : 'Definitions First'}
                    </button>

                    {cards.length > 0 && (
                        <button
                            onClick={onBatchDelete}
                            className="flex-none p-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 border border-stone-200 dark:border-stone-800 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Using Batch Delete to clear set"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
