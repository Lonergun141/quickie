"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useQuizzes, Quiz } from "@/hooks/useQuizzes";
import { useQuizFilters } from "@/hooks/useQuizFilters";
import { QuizHistoryHeader } from "@/components/Quiz/QuizHistoryHeader";
import { QuizGrid } from "@/components/Quiz/QuizGrid";
import { QuizDeleteModal } from "@/components/Quiz/QuizDeleteModal";
import { Pagination } from "@/components/Quiz/Pagination";
import { cn } from "@/lib/utils";

export default function QuizHistoryPage() {
    const router = useRouter();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { fetchQuizHistory, deleteQuiz, loading } = useQuizzes();

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use the filter hook
    const filters = useQuizFilters(quizzes);

    useEffect(() => {
        const loadQuizzes = async () => {
            const data = await fetchQuizHistory();
            setQuizzes(data);
        };
        loadQuizzes();
    }, [fetchQuizHistory]);

    const handleDelete = useCallback(async () => {
        if (!quizToDelete) return;
        setIsDeleting(true);
        try {
            await deleteQuiz(quizToDelete.note);
            setQuizzes(prev => prev.filter(q => q.note !== quizToDelete.note));
            setDeleteModalOpen(false);
            setQuizToDelete(null);
        } catch (error) {
            console.error("Failed to delete quiz", error);
        } finally {
            setIsDeleting(false);
        }
    }, [quizToDelete, deleteQuiz]);

    const handleQuizClick = useCallback((quiz: Quiz) => {
        router.push(`/Quiz/${quiz.note}/results`);
    }, [router]);

    const handleQuizDelete = useCallback((quiz: Quiz) => {
        setQuizToDelete(quiz);
        setDeleteModalOpen(true);
    }, []);

    const handleGoToDashboard = useCallback(() => {
        router.push('/home');
    }, [router]);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Sidebar onToggle={setSidebarExpanded} />

            <main className={cn(
                "transition-all duration-300 min-h-screen p-4 lg:p-8 relative",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow delay-1000" />
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    <QuizHistoryHeader
                        searchTerm={filters.searchTerm}
                        onSearchChange={filters.setSearchTerm}
                        sortOption={filters.sortOption}
                        onSortChange={filters.setSortOption}
                        scoreFilter={filters.scoreFilter}
                        onScoreFilterChange={filters.setScoreFilter}
                        dateFilter={filters.dateFilter}
                        onDateFilterChange={filters.setDateFilter}
                        activeFiltersCount={filters.activeFiltersCount}
                        onClearFilters={filters.clearFilters}
                    />

                    {/* Results Count */}
                    {!loading && filters.filteredQuizzes.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Showing {filters.paginatedQuizzes.length} of {filters.filteredQuizzes.length} quizzes
                            {filters.activeFiltersCount > 0 && ` (filtered from ${quizzes.length} total)`}
                        </div>
                    )}

                    <div className="relative min-h-[400px]">
                        <QuizGrid
                            loading={loading}
                            quizzes={filters.paginatedQuizzes}
                            hasActiveFilters={filters.activeFiltersCount > 0}
                            currentPage={filters.currentPage}
                            sortOption={filters.sortOption}
                            scoreFilter={filters.scoreFilter}
                            dateFilter={filters.dateFilter}
                            onQuizClick={handleQuizClick}
                            onQuizDelete={handleQuizDelete}
                            onClearFilters={filters.clearFilters}
                            onGoToDashboard={handleGoToDashboard}
                        />
                    </div>

                    <Pagination
                        currentPage={filters.currentPage}
                        totalPages={filters.totalPages}
                        onPageChange={filters.handlePageChange}
                    />
                </div>
            </main>

            <QuizDeleteModal
                isOpen={deleteModalOpen}
                quiz={quizToDelete}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
