import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flashcard } from "@/hooks/useFlashcards";
import { Edit2, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface FlashcardViewerProps {
    card: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
    studyMode: 'term-first' | 'definition-first';
    onEdit?: (card: Flashcard) => void;
    onDelete?: (cardId: number) => void;
}

export function FlashcardViewer({
    card,
    isFlipped,
    onFlip,
    studyMode,
    onEdit,
    onDelete
}: FlashcardViewerProps) {
    if (!card) return null;

    // Determine what to show on front vs back based on study mode
    const frontText = studyMode === 'term-first' ? card.frontCardText : card.backCardText;
    const backText = studyMode === 'term-first' ? card.backCardText : card.frontCardText;
    const frontLabel = studyMode === 'term-first' ? "Front" : "Back";
    const backLabel = studyMode === 'term-first' ? "Back" : "Front";

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div
                className="w-full h-[400px] relative cursor-pointer group perspective-1000"
                onClick={onFlip}
            >
                <motion.div
                    className="relative w-full h-full transition-all duration-500"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {/* Front Side */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-3xl shadow-xl bg-white dark:bg-zinc-900 border-2 border-stone-100 dark:border-stone-800 flex flex-col items-center justify-center p-8 lg:p-12 text-center pointer-events-none select-none"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="absolute top-6 left-6 text-xs font-bold tracking-wider text-muted-foreground/50 uppercase">
                            {frontLabel}
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                                {frontText}
                            </p>
                        </div>
                        <div className="absolute bottom-6 text-xs text-muted-foreground/40 font-medium">
                            Click to flip
                        </div>
                    </div>

                    {/* Back Side */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-3xl shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border-2 border-primary/20 flex flex-col items-center justify-center p-8 lg:p-12 text-center pointer-events-none select-none"
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden"
                        }}
                    >
                        <div className="absolute top-6 left-6 text-xs font-bold tracking-wider text-primary/60 uppercase">
                            {backLabel}
                        </div>
                        <div className="flex-1 flex items-center justify-center w-full overflow-y-auto custom-scrollbar">
                            <div className="max-h-full w-full flex items-center justify-center">
                                <p className="text-xl md:text-2xl font-medium text-foreground/90 leading-relaxed dark:text-white/90">
                                    {backText}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Card Actions */}
            <div className="flex justify-end gap-2 px-2">
                {onEdit && (
                    <Tooltip content="Edit card" side="bottom">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(card);
                            }}
                            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip content="Delete card" side="bottom">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(card.id);
                            }}
                            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
