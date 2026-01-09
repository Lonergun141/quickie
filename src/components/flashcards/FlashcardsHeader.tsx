"use client";

import { motion } from "framer-motion";
import { Copy, Search, ChevronDown, SortAsc, Filter } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

// Define filter types to match usage in page
export type DateFilter = 'all' | 'week' | 'month' | 'year';

interface FlashcardsHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    dateFilter: DateFilter;
    onDateFilterChange: (filter: DateFilter) => void;
}

export function FlashcardsHeader({
    searchTerm,
    onSearchChange,
    sortOption,
    onSortChange,
    dateFilter,
    onDateFilterChange
}: FlashcardsHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6 md:items-center justify-between"
        >
            {/* Title Section */}
            <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2 w-fit">
                    <Copy className="w-3 h-3" />
                    <span>Study Sets</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Flashcards
                </h1>
                <p className="text-muted-foreground max-w-lg leading-relaxed">
                    Review and practice your key concepts with interactive flashcards.
                </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative group flex-1 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search sets..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-stone-200 dark:border-stone-800 rounded-xl leading-5 bg-white/50 dark:bg-zinc-900/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                    />
                </div>

                {/* Filter */}
                <Tooltip content="Filter by date range" side="bottom">
                    <div className="relative w-full sm:w-40">
                        <select
                            value={dateFilter}
                            onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
                            className="appearance-none w-full px-4 py-3 pl-10 bg-white/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm font-medium"
                        >
                            <option value="all">All Time</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="year">This Year</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
                    </div>
                </Tooltip>

                {/* Sort */}
                <Tooltip content="Sort specific sets" side="bottom">
                    <div className="relative w-full sm:w-48">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="appearance-none w-full px-4 py-3 pl-10 bg-white/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm font-medium"
                        >
                            <option value="dateDesc">Newest First</option>
                            <option value="dateAsc">Oldest First</option>
                            <option value="titleAsc">Title (A-Z)</option>
                            <option value="titleDesc">Title (Z-A)</option>
                        </select>
                        <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none opacity-50" />
                    </div>
                </Tooltip>
            </div>
        </motion.div>
    );
}
