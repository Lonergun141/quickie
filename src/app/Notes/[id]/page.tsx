"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useNoteDetail } from "@/hooks/useNoteDetail";
import { Loader2, AlertCircle } from "lucide-react";

// Note components
import { NoteHeader } from "@/components/notes/NoteHeader";
import { NoteTitleSection } from "@/components/notes/NoteTitleSection";
import { StudyToolsBar } from "@/components/notes/StudyToolsBar";
import { NoteContent } from "@/components/notes/NoteContent";
import { GenerateModal } from "@/components/notes/GenerateModal";
import { UnsavedChangesModal } from "@/components/notes/UnsavedChangesModal";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function NoteDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar onToggle={setSidebarExpanded} onNavigate={handleSidebarNavigation} />

            <main className={cn(
                "transition-all duration-300 min-h-screen",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                <NoteHeader
                    isEditing={isEditing}
                    onBack={handleBack}
                    onEdit={startEditing}
                    onCancel={handleCancel}
                    onSave={handleSave}
                />

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-6 py-10 overflow-x-hidden">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-10"
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
        </div>
    );
}
