"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useNotes, Note } from "@/hooks/useNotes";
import { NoteCard } from "@/components/notes/NoteCard";
import { DeleteNoteModal } from "@/components/notes/DeleteNoteModal";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesPagination } from "@/components/notes/NotesPagination";
import { NoteSkeleton } from "@/components/notes/NoteSkeleton";
import { Plus, FileText } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export default function NotesPage() {
    const router = useRouter();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    // Notes Logic
    const {
        notes, // This is already filtered by searchTerm in useNotes
        loading,
        sortOption,
        dateFilter,
        setDateFilter,
        searchTerm,
        setSearchTerm,
        handleSortChange,
        deleteNote,
    } = useNotes();

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 9;

    // Reset pagination when filter/sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption, dateFilter]);

    // Calculate Pagination
    const totalPages = Math.ceil(notes.length / notesPerPage);
    const startIndex = (currentPage - 1) * notesPerPage;
    const currentNotes = notes.slice(startIndex, startIndex + notesPerPage);

    const handleNoteClick = (id: number) => {
        router.push(`/Notes/${id}`);
    };

    const openDeleteModal = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        setNoteToDelete(note);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!noteToDelete) return;

        setIsDeleting(true);
        const success = await deleteNote(noteToDelete.id);
        setIsDeleting(false);

        if (success) {
            setShowDeleteModal(false);
            setNoteToDelete(null);
            // If we deleted the last item on the page, go back one page
            if (currentNotes.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        }
    };

    const handleCreateNote = () => {
        router.push('/Home');
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
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
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <NotesHeader
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortOption={sortOption}
                        onSortChange={(val) => handleSortChange(val as any)}
                        dateFilter={dateFilter}
                        onDateFilterChange={(val) => setDateFilter(val as any)}
                    />

                    {/* Notes Grid Area */}
                    <div className="relative min-h-[400px]">
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-[250px]">
                                        <NoteSkeleton />
                                    </div>
                                ))}
                            </div>
                        ) : notes.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage} // Animate on page change
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]"
                                >
                                    {currentNotes.map((note) => (
                                        <motion.div key={note.id} variants={item} layout className="h-full">
                                            <NoteCard
                                                note={note}
                                                onClick={() => handleNoteClick(note.id)}
                                                onDelete={(e) => openDeleteModal(e, note)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-dashed border-stone-300 dark:border-stone-800"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce-slow">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">
                                    {searchTerm ? 'No Matching Notes' : 'Your Digital Notebook is Empty'}
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    {searchTerm
                                        ? `We couldn't find any notes matching "${searchTerm}". Try a different term or clear the filter.`
                                        : 'Start capturing your thoughts and summaries. Create your first note to build your personal knowledge base.'}
                                </p>
                                <Tooltip content="Create a new note from your dashboard" side="bottom">
                                    <button
                                        onClick={handleCreateNote}
                                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
                                    >
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                        Create New Note
                                    </button>
                                </Tooltip>
                            </motion.div>
                        )}
                    </div>

                    {/* Pagination */}
                    <NotesPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            {/* Delete Modal */}
            <DeleteNoteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setNoteToDelete(null);
                }}
                onConfirm={handleDelete}
                noteTitle={noteToDelete?.notetitle.replace(/[\"*]/g, '') || ''}
                isDeleting={isDeleting}
            />
        </div>
    );
}
