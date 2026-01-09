"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useFlashcards, FlashcardSet } from "@/hooks/useFlashcards";
import { FlashcardSetCard } from "@/components/flashcards/FlashcardSetCard";
import { FlashcardsHeader, DateFilter } from "@/components/flashcards/FlashcardsHeader";
import { FlashcardSetSkeleton } from "@/components/flashcards/FlashcardSetSkeleton";
import { NotesPagination } from "@/components/notes/NotesPagination";
import { Copy, Plus } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export default function FlashcardsPage() {
    const router = useRouter();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { fetchFlashcardSets, loading } = useFlashcards();

    // State
    const [sets, setSets] = useState<FlashcardSet[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("dateDesc");
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const loadSets = async () => {
            const data = await fetchFlashcardSets();
            setSets(data);
        };
        loadSets();
    }, [fetchFlashcardSets]);

    // Resets
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption, dateFilter]);

    // Filter & Sort
    const filteredSets = sets.filter(set => {
        const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase());

        // Date Filtering
        const setDate = new Date(set.dateCreated);
        const now = new Date();
        let matchesDate = true;

        if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = setDate >= weekAgo;
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = setDate >= monthAgo;
        } else if (dateFilter === 'year') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            matchesDate = setDate >= startOfYear;
        }

        return matchesSearch && matchesDate;
    }).sort((a, b) => {
        if (sortOption === 'dateDesc') return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        if (sortOption === 'dateAsc') return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        if (sortOption === 'titleAsc') return a.title.localeCompare(b.title);
        if (sortOption === 'titleDesc') return b.title.localeCompare(a.title);
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredSets.length / ITEMS_PER_PAGE);
    const paginatedSets = filteredSets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                    <FlashcardsHeader
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        dateFilter={dateFilter}
                        onDateFilterChange={setDateFilter}
                    />

                    {/* Sets Grid Area */}
                    <div className="relative min-h-[400px]">
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <FlashcardSetSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredSets.length > 0 ? (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPage} // Animate on page change
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]"
                                    >
                                        {paginatedSets.map((set) => (
                                            <motion.div key={set.id} variants={item} layout className="h-full">
                                                <FlashcardSetCard
                                                    set={set}
                                                    onClick={() => router.push(`/Flashcards/${set.id}?from=sets`)}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center">
                                        <NotesPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-dashed border-stone-300 dark:border-stone-800"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce-slow">
                                    <Copy className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">
                                    {searchTerm ? 'No Matching Sets' : 'No Flashcards Yet'}
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    {searchTerm || dateFilter !== 'all'
                                        ? `We couldn't find any sets matching filters. Try adjusting your search.`
                                        : 'Create flashcards from your notes to start practicing.'}
                                </p>
                                <Tooltip content="Go to Notes to create flashcards" side="bottom">
                                    <button
                                        onClick={() => router.push('/Notes')}
                                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
                                    >
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                        Create First Set
                                    </button>
                                </Tooltip>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
