"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, ChevronDown, SortAsc, Filter } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip"; // Using my custom tooltip

interface NotesHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    dateFilter: string;
    onDateFilterChange: (value: string) => void;
}

export function NotesHeader({
    searchTerm,
    onSearchChange,
    sortOption,
    onSortChange,
    dateFilter,
    onDateFilterChange
}: NotesHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 lg:p-8 shadow-sm"
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
                {/* Title Section */}
                <div className="flex-1 space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full w-fit"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Your Knowledge Base</span>
                    </motion.div>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                        Summary Notes
                    </h1>
                    <p className="text-muted-foreground text-sm lg:text-base max-w-xl">
                        View, manage, and study your AI-generated summaries.
                        Use the search and sort options to organize your library.
                    </p>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:block">
                            <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded border bg-background">ESC</span>
                        </div>
                    </div>

                    {/* Date Filter */}
                    <Tooltip content="Filter by timeframe" side="bottom">
                        <div className="relative w-full sm:w-40">
                            <select
                                value={dateFilter}
                                onChange={(e) => onDateFilterChange(e.target.value)}
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
                    <Tooltip content="Sort your notes" side="bottom">
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
            </div>
        </motion.div>
    );
}
