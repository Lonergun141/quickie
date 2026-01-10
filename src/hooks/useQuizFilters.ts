"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Quiz } from "@/hooks/useQuizzes";
import {
    filterAndSortQuizzes,
    paginateItems,
    countActiveFilters
} from "@/lib/quizFilters";

const ITEMS_PER_PAGE = 9;

export interface QuizFilterState {
    searchTerm: string;
    sortOption: string;
    scoreFilter: string;
    dateFilter: string;
}

export interface UseQuizFiltersReturn {
    // Filter state
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    scoreFilter: string;
    setScoreFilter: (value: string) => void;
    dateFilter: string;
    setDateFilter: (value: string) => void;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    handlePageChange: (page: number) => void;

    // Computed values
    activeFiltersCount: number;
    filteredQuizzes: Quiz[];
    paginatedQuizzes: Quiz[];

    // Actions
    clearFilters: () => void;
}

export function useQuizFilters(quizzes: Quiz[]): UseQuizFiltersReturn {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("dateDesc");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption, scoreFilter, dateFilter]);

    // Count active filters
    const activeFiltersCount = useMemo(() =>
        countActiveFilters({ searchTerm, scoreFilter, dateFilter }),
        [searchTerm, scoreFilter, dateFilter]
    );

    // Filter and sort quizzes
    const filteredQuizzes = useMemo(() =>
        filterAndSortQuizzes(quizzes, {
            searchTerm,
            scoreFilter,
            dateFilter,
            sortOption
        }),
        [quizzes, searchTerm, sortOption, scoreFilter, dateFilter]
    );

    // Pagination
    const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);

    const paginatedQuizzes = useMemo(() =>
        paginateItems(filteredQuizzes, currentPage, ITEMS_PER_PAGE),
        [filteredQuizzes, currentPage]
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setScoreFilter("all");
        setDateFilter("all");
        setCurrentPage(1);
    }, []);

    return {
        // Filter state
        searchTerm,
        setSearchTerm,
        sortOption,
        setSortOption,
        scoreFilter,
        setScoreFilter,
        dateFilter,
        setDateFilter,

        // Pagination
        currentPage,
        setCurrentPage,
        totalPages,
        handlePageChange,

        // Computed values
        activeFiltersCount,
        filteredQuizzes,
        paginatedQuizzes,

        // Actions
        clearFilters
    };
}
