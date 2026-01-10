"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPageNumbers } from "@/lib/quizFilters";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border mt-8"
        >
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2 bg-white/40 dark:bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/10 dark:border-white/5">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-muted-foreground"
                    aria-label="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pages.map((page, idx) => (
                    typeof page === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "w-8 h-8 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                                currentPage === page
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                            )}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={idx} className="px-1 text-muted-foreground">...</span>
                    )
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-muted-foreground"
                    aria-label="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
