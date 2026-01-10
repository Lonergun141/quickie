"use client";

import { Search, SortAsc, Filter, Calendar, Trophy, X } from "lucide-react";

interface QuizHistoryHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    scoreFilter: string;
    onScoreFilterChange: (value: string) => void;
    dateFilter: string;
    onDateFilterChange: (value: string) => void;
    activeFiltersCount: number;
    onClearFilters: () => void;
}

export function QuizHistoryHeader({
    searchTerm,
    onSearchChange,
    sortOption,
    onSortChange,
    scoreFilter,
    onScoreFilterChange,
    dateFilter,
    onDateFilterChange,
    activeFiltersCount,
    onClearFilters
}: QuizHistoryHeaderProps) {
    return (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 p-6 rounded-3xl shadow-sm space-y-4">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                        Quiz History
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Review your past performance and track your progress
                    </p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64 transition-all"
                    />
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Filter className="w-4 h-4" />
                    Filters:
                </span>

                {/* Sort */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SortAsc className="w-4 h-4 text-zinc-400" />
                    </div>
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="pl-9 pr-6 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-sm transition-all"
                    >
                        <option value="dateDesc">Newest First</option>
                        <option value="dateAsc">Oldest First</option>
                        <option value="scoreDesc">Highest Score</option>
                        <option value="scoreAsc">Lowest Score</option>
                        <option value="titleAsc">Title A-Z</option>
                        <option value="titleDesc">Title Z-A</option>
                    </select>
                </div>

                {/* Score Filter */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Trophy className="w-4 h-4 text-zinc-400" />
                    </div>
                    <select
                        value={scoreFilter}
                        onChange={(e) => onScoreFilterChange(e.target.value)}
                        className="pl-9 pr-6 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-sm transition-all"
                    >
                        <option value="all">All Scores</option>
                        <option value="perfect">Perfect (100%)</option>
                        <option value="passing">Passing (≥70%)</option>
                        <option value="needsWork">Needs Work (&lt;70%)</option>
                        <option value="notTaken">Not Taken</option>
                    </select>
                </div>

                {/* Date Filter */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                    </div>
                    <select
                        value={dateFilter}
                        onChange={(e) => onDateFilterChange(e.target.value)}
                        className="pl-9 pr-6 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-sm transition-all"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Clear ({activeFiltersCount})
                    </button>
                )}
            </div>
        </div>
    );
}
