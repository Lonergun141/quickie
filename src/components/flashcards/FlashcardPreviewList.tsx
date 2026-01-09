"use client";

import { cn } from "@/lib/utils";
import { Flashcard } from "@/hooks/useFlashcards";

interface FlashcardPreviewListProps {
    cards: Flashcard[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

export function FlashcardPreviewList({ cards, currentIndex, onSelect }: FlashcardPreviewListProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold tracking-tight">All Cards ({cards.length})</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cards.map((card, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <div
                            key={card.id || index}
                            onClick={() => onSelect(index)}
                            className={cn(
                                "group relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border",
                                isActive
                                    ? "bg-primary/5 border-primary/30 ring-1 ring-primary/30 shadow-sm"
                                    : "bg-white/50 dark:bg-zinc-900/50 border-stone-200 dark:border-stone-800 hover:border-primary/20 hover:bg-white dark:hover:bg-zinc-900"
                            )}
                        >
                            {/* Index Badge */}
                            <div className={cn(
                                "absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                isActive
                                    ? "bg-primary text-white"
                                    : "bg-stone-100 dark:bg-zinc-800 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                            )}>
                                {index + 1}
                            </div>

                            <div className="space-y-3 mt-4">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Front</div>
                                    <p className="text-sm font-medium text-foreground line-clamp-2">
                                        {card.frontCardText}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-dashed border-stone-200 dark:border-stone-800/50">
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Back</div>
                                    <p className="text-sm text-foreground/80 line-clamp-2">
                                        {card.backCardText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
