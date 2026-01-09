"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlashcardSessionControlsProps {
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalCards: number;
}

export function FlashcardSessionControls({
    onPrev,
    onNext,
    currentIndex,
    totalCards,
}: FlashcardSessionControlsProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6 p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-stone-200 dark:border-stone-800 shadow-lg shadow-black/5">
                <button
                    onClick={onPrev}
                    className="p-4 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
                    title="Previous (Left Arrow)"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="px-4 font-mono font-medium text-lg min-w-[3ch] text-center">
                    {currentIndex + 1} / {totalCards}
                </div>

                <button
                    onClick={onNext}
                    className="p-4 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors"
                    title="Next (Right Arrow)"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="text-xs text-muted-foreground font-medium flex gap-4">
                <span>Space to Flip</span>
                <span>•</span>
                <span>Arrows to Navigate</span>
            </div>
        </div>
    );
}
