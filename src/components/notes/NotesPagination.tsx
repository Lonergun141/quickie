"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function NotesPagination({ currentPage, totalPages, onPageChange }: NotesPaginationProps) {
    if (totalPages <= 1) return null;

    // Helper to generate page numbers with ellipsis if needed (simple version for now: all pages)
    // For many pages, you might want a more complex sliding window logic.
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border mt-8"
        >
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
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

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-8 h-8 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                            currentPage === page
                                ? "text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                        )}
                    >
                        {currentPage === page && (
                            <motion.div
                                layoutId="activePagination"
                                className="absolute inset-0 bg-primary"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{page}</span>
                    </button>
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
