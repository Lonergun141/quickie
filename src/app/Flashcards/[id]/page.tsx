'use client'

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useFlashcards, Flashcard } from "@/hooks/useFlashcards";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { FlashcardPreviewList } from "@/components/flashcards/FlashcardPreviewList";
import { EditCardModal } from "@/components/flashcards/EditCardModal";
import { FlashcardSessionHeader } from "@/components/flashcards/FlashcardSessionHeader";
import { FlashcardSessionControls } from "@/components/flashcards/FlashcardSessionControls";
import { DeleteSetModal } from "@/components/flashcards/DeleteSetModal";
import { RefreshCw } from "lucide-react";

export default function FlashcardSessionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { fetchSetCards, updateCard, deleteCard } = useFlashcards();
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);

    // New Features State
    const [studyMode, setStudyMode] = useState<'term-first' | 'definition-first'>('term-first');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (id) {
                setSessionLoading(true);
                const data = await fetchSetCards(id);
                setCards(data);
                setSessionLoading(false);
            }
        };
        load();
    }, [id, fetchSetCards]);

    // Navigation Logic
    const nextCard = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, [cards.length]);

    const prevCard = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, [cards.length]);

    const handleFlip = useCallback(() => {
        setIsFlipped((prev) => !prev);
    }, []);

    // Card Management Handlers
    const handleEditCard = (card: Flashcard) => {
        setEditingCard(card);
        setIsEditModalOpen(true);
    };

    const handleSaveCard = async (cardId: number, front: string, back: string) => {
        try {
            await updateCard(cardId, { front, back });
            // Optimistic update locally
            setCards(prev => prev.map(c => c.id === cardId ? { ...c, frontCardText: front, backCardText: back } : c));

        } catch (error) {
            console.error("Failed to update card", error);

        }
    };

    const handleDeleteCard = async (cardId: number) => {
        // Confirmation is already handled in the component or via window.confirm (refactoring to sonner dialog in future maybe, but sticking to window.confirm for now as per code)
        if (!window.confirm("Are you sure you want to delete this card?")) return;

        try {
            await deleteCard(cardId);
            setCards(prev => {
                const newCards = prev.filter(c => c.id !== cardId);
                if (newCards.length === 0) return [];

                // Adjust index if needed
                if (currentIndex >= newCards.length) {
                    setCurrentIndex(newCards.length - 1);
                }
                return newCards;
            });

        } catch (error) {
            console.error("Failed to delete card", error);

        }
    };

    const handleBatchDelete = async () => {
        if (cards.length === 0) return;

        setSessionLoading(true);
        try {
            await Promise.all(cards.map(card => deleteCard(card.id)));
            setCards([]);
            setCurrentIndex(0);

        } catch (error) {
            console.error("Failed to delete all cards", error);

        } finally {
            setSessionLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (cards.length === 0 || isEditModalOpen) return;

            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                nextCard();
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                prevCard();
            } else if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                handleFlip();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cards.length, nextCard, prevCard, handleFlip, isEditModalOpen]);

    // Current Card
    const currentCard = cards[currentIndex];

    const searchParams = useSearchParams();
    const fromParam = searchParams.get('from');
    const noteTitleParam = searchParams.get('noteTitle');
    const noteIdParam = searchParams.get('noteId');

    const handleBack = () => {
        if (fromParam === 'note' && noteIdParam) {
            router.push(`/Notes/${noteIdParam}`);
        } else {
            router.push('/Flashcards');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Sidebar onToggle={setSidebarExpanded} />

            <main className={cn(
                "transition-all duration-300 min-h-screen p-4 lg:p-8 relative",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Background Ambient Effects */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                </div>

                <div className="max-w-5xl mx-auto space-y-8">
                    <FlashcardSessionHeader
                        onBack={handleBack}
                        onHome={() => router.push('/Home')}
                        onNotes={() => router.push('/Notes')}
                        onFlashcards={() => router.push('/Flashcards')}
                        onNoteDetail={() => router.push(`/Notes/${noteIdParam}`)}
                        fromParam={fromParam}
                        noteTitleParam={noteTitleParam}
                        cards={cards}
                        currentIndex={currentIndex}
                        studyMode={studyMode}
                        setStudyMode={setStudyMode}
                        onBatchDelete={() => setShowDeleteConfirm(true)}
                    />

                    {/* Main Viewing Area */}
                    <div className="relative min-h-[500px]">
                        {sessionLoading ? (
                            <div className="w-full max-w-2xl h-[400px] mx-auto bg-white/40 dark:bg-zinc-900/40 rounded-3xl animate-pulse border border-white/10" />
                        ) : cards.length > 0 ? (
                            <div className="flex flex-col items-center gap-8">
                                {/* The Card */}
                                <FlashcardViewer
                                    card={currentCard}
                                    isFlipped={isFlipped}
                                    onFlip={handleFlip}
                                    studyMode={studyMode}
                                    onEdit={handleEditCard}
                                    onDelete={handleDeleteCard}
                                />

                                <FlashcardSessionControls
                                    onPrev={prevCard}
                                    onNext={nextCard}
                                    currentIndex={currentIndex}
                                    totalCards={cards.length}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="p-4 rounded-full bg-stone-100 dark:bg-zinc-800 mb-4">
                                    <RefreshCw className="w-6 h-6 text-muted-foreground opacity-50" />
                                </div>
                                <h3 className="text-lg font-semibold">No Cards Found</h3>
                                <p className="text-muted-foreground mb-4">This set seems to be empty or has been cleared.</p>
                                <button
                                    onClick={() => router.push('/Flashcards')}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Return to Sets
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Preview Grid */}
                    {!sessionLoading && cards.length > 0 && (
                        <div className="pt-8 border-t border-dashed border-stone-200 dark:border-stone-800">
                            <FlashcardPreviewList
                                cards={cards}
                                currentIndex={currentIndex}
                                onSelect={(idx) => {
                                    setIsFlipped(false);
                                    setCurrentIndex(idx);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Modals */}
                <EditCardModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    card={editingCard}
                    onSave={handleSaveCard}
                />

                <DeleteSetModal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleBatchDelete}
                    count={cards.length}
                />
            </main>
        </div>
    );
}
