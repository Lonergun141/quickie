"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useNoteDetail } from "@/hooks/useNoteDetail";
import { Loader2, AlertCircle } from "lucide-react";
import { PomodoroMiniTimer } from "@/components/Pomodoro/PomodoroMiniTimer";

// Note components
import { NoteHeader } from "@/components/notes/NoteHeader";
import { NoteTitleSection } from "@/components/notes/NoteTitleSection";
import { StudyToolsBar } from "@/components/notes/StudyToolsBar";
import { NoteContent } from "@/components/notes/NoteContent";
import { GenerateModal } from "@/components/notes/GenerateModal";
import { UnsavedChangesModal } from "@/components/notes/UnsavedChangesModal";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function NoteDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);

    const {
        note,
        loading,
        isEditing,
        editedTitle,
        editedSummary,
        hasUnsavedChanges,
        flashcardsExist,
        quizExists,
        isGeneratingFlashcards,
        isGeneratingQuiz,
        setEditedTitle,
        setEditedSummary,
        startEditing,
        cancelEditing,
        saveChanges,
        generateFlashcards,
        generateQuiz,
    } = useNoteDetail(id);

    const [showGenerateModal, setShowGenerateModal] = useState<'flashcards' | 'quiz' | null>(null);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [unsavedAction, setUnsavedAction] = useState<'back' | 'cancel' | 'navigate'>('back');
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    // Intercept browser back/close when editing with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isEditing && hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isEditing, hasUnsavedChanges]);

    // Handle sidebar navigation
    const handleSidebarNavigation = (path: string) => {
        if (isEditing && hasUnsavedChanges) {
            setPendingNavigation(path);
            setUnsavedAction('navigate');
            setShowUnsavedModal(true);
        } else {
            router.push(path);
        }
    };

    const handleBack = () => {
        if (isEditing && hasUnsavedChanges) {
            setUnsavedAction('back');
            setShowUnsavedModal(true);
        } else {
            router.push('/Notes');
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setUnsavedAction('cancel');
            setShowUnsavedModal(true);
        } else {
            cancelEditing();
        }
    };

    const handleSave = async () => {
        await saveChanges();
    };

    const handleFlashcardsClick = () => {
        if (flashcardsExist) {
            const params = new URLSearchParams({
                from: 'note',
                noteId: id,
                noteTitle: note?.notetitle || 'Note'
            });
            router.push(`/Flashcards/${id}?${params.toString()}`);
        } else {
            setShowGenerateModal('flashcards');
        }
    };

    const handleQuizClick = () => {
        if (quizExists) {
            const params = new URLSearchParams({
                from: 'note',
                noteId: id,
                noteTitle: note?.notetitle || 'Note'
            });
            router.push(`/Quiz/${id}?${params.toString()}`);
        } else {
            setShowGenerateModal('quiz');
        }
    };

    const handleGenerateConfirm = async () => {
        if (showGenerateModal === 'flashcards') {
            const success = await generateFlashcards();
            if (success) {
                const params = new URLSearchParams({
                    from: 'note',
                    noteId: id,
                    noteTitle: note?.notetitle || 'Note'
                });
                router.push(`/Flashcards/${id}?${params.toString()}`);
            }
        } else if (showGenerateModal === 'quiz') {
            const success = await generateQuiz();
            if (success) {
                const params = new URLSearchParams({
                    from: 'note',
                    noteId: id,
                    noteTitle: note?.notetitle || 'Note'
                });
                router.push(`/Quiz/${id}?${params.toString()}`);
            }
        }
        setShowGenerateModal(null);
    };

    const handleUnsavedConfirm = () => {
        setShowUnsavedModal(false);
        cancelEditing();
        if (unsavedAction === 'back') {
            router.push('/Notes');
        } else if (unsavedAction === 'navigate' && pendingNavigation) {
            router.push(pendingNavigation);
            setPendingNavigation(null);
        }
    };

    const formattedDate = note?.notedatecreated
        ? new Date(note.notedatecreated).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading note...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!note) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Note not found</p>
                    <button
                        onClick={() => router.push('/Notes')}
                        className="text-primary hover:underline text-sm"
                    >
                        Back to Notes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            {/* Sidebar - Hidden in Zen Mode */}
            <div className={cn(
                "transition-all duration-500 ease-in-out absolute left-0 top-0 h-full z-30",
                isZenMode ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
            )}>
                <Sidebar onToggle={setSidebarExpanded} onNavigate={handleSidebarNavigation} />
            </div>

            <main className={cn(
                "transition-all duration-500 ease-in-out min-h-screen",
                isZenMode ? "ml-0" : (sidebarExpanded ? "lg:ml-64" : "lg:ml-20")
            )}>
                {isZenMode && (
                    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
                        <PomodoroMiniTimer isCollapsed={false} disableAutoOpen={true} />
                    </div>
                )}
                <NoteHeader
                    isEditing={isEditing}
                    onBack={handleBack}
                    onEdit={startEditing}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    isZenMode={isZenMode}
                    onToggleZenMode={() => setIsZenMode(!isZenMode)}
                />

                {/* Main Content */}
                <div className={cn(
                    "mx-auto px-6 py-10 overflow-x-hidden transition-all duration-500 ease-in-out",
                    isZenMode ? "max-w-3xl" : "max-w-4xl"
                )}>
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={cn("space-y-10", isZenMode && "py-12")}
                    >
                        <NoteTitleSection
                            title={note.notetitle}
                            date={formattedDate}
                            isEditing={isEditing}
                            editedTitle={editedTitle}
                            onTitleChange={setEditedTitle}
                        />

                        <StudyToolsBar
                            flashcardsExist={flashcardsExist}
                            quizExists={quizExists}
                            isGeneratingFlashcards={isGeneratingFlashcards}
                            isGeneratingQuiz={isGeneratingQuiz}
                            onFlashcardsClick={handleFlashcardsClick}
                            onQuizClick={handleQuizClick}
                        />

                        {/* Divider */}
                        <div className="h-px bg-border" />

                        <NoteContent
                            isEditing={isEditing}
                            content={note.notesummary}
                            editedContent={editedSummary}
                            onContentChange={setEditedSummary}
                        />
                    </motion.article>
                </div>
            </main>

            {/* Modals */}
            <GenerateModal
                type={showGenerateModal}
                onClose={() => setShowGenerateModal(null)}
                onConfirm={handleGenerateConfirm}
            />

            <UnsavedChangesModal
                isOpen={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onConfirm={handleUnsavedConfirm}
            />

            <FullPageLoader
                isLoading={isGeneratingFlashcards || isGeneratingQuiz}
                text={isGeneratingFlashcards ? "Generating Flashcards..." : "Creating Quiz..."}
                subtext={isGeneratingFlashcards ? "Analyzing your note and creating cards..." : "Crafting challenging questions..."}
            />
        </div>
    );
}
