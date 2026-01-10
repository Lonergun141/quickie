import { Quiz } from "@/hooks/useQuizzes";

/**
 * Check if a date string is within a specified date range
 */
export function isWithinDateRange(dateStr: string, range: string): boolean {
    if (range === "all") return true;

    const date = new Date(dateStr);
    const now = new Date();

    switch (range) {
        case "today": {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return date >= today;
        }
        case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
        }
        case "month": {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date >= monthAgo;
        }
        case "year": {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return date >= yearAgo;
        }
        default:
            return true;
    }
}

/**
 * Calculate quiz score percentage
 */
export function getQuizPercentage(quiz: Quiz): number {
    if (quiz.TestTotalScore <= 0) return 0;
    return (quiz.TestScore / quiz.TestTotalScore) * 100;
}

/**
 * Check if quiz has been taken (has a score)
 */
export function hasQuizScore(quiz: Quiz): boolean {
    return quiz.TestTotalScore > 0;
}

/**
 * Filter quizzes by search term
 */
export function filterBySearch(quizzes: Quiz[], searchTerm: string): Quiz[] {
    if (!searchTerm.trim()) return quizzes;
    const term = searchTerm.toLowerCase().trim();
    return quizzes.filter(quiz =>
        (quiz.notetitle || "").toLowerCase().includes(term)
    );
}

/**
 * Filter quizzes by score range
 */
export function filterByScore(quizzes: Quiz[], scoreFilter: string): Quiz[] {
    if (scoreFilter === "all") return quizzes;

    return quizzes.filter(quiz => {
        const hasScore = hasQuizScore(quiz);
        const percentage = getQuizPercentage(quiz);

        switch (scoreFilter) {
            case "perfect":
                return hasScore && percentage === 100;
            case "passing":
                return hasScore && percentage >= 70;
            case "needsWork":
                return hasScore && percentage < 70;
            case "notTaken":
                return !hasScore;
            default:
                return true;
        }
    });
}

/**
 * Filter quizzes by date range
 */
export function filterByDate(quizzes: Quiz[], dateFilter: string): Quiz[] {
    if (dateFilter === "all") return quizzes;
    return quizzes.filter(quiz =>
        isWithinDateRange(quiz.TestDateCreated, dateFilter)
    );
}

/**
 * Sort quizzes by specified option
 */
export function sortQuizzes(quizzes: Quiz[], sortOption: string): Quiz[] {
    const sorted = [...quizzes];

    sorted.sort((a, b) => {
        switch (sortOption) {
            case "dateDesc":
                return new Date(b.TestDateCreated).getTime() - new Date(a.TestDateCreated).getTime();
            case "dateAsc":
                return new Date(a.TestDateCreated).getTime() - new Date(b.TestDateCreated).getTime();
            case "scoreDesc": {
                const aScore = getQuizPercentage(a);
                const bScore = getQuizPercentage(b);
                return bScore - aScore;
            }
            case "scoreAsc": {
                const aScore = getQuizPercentage(a);
                const bScore = getQuizPercentage(b);
                return aScore - bScore;
            }
            case "titleAsc":
                return (a.notetitle || "").localeCompare(b.notetitle || "");
            case "titleDesc":
                return (b.notetitle || "").localeCompare(a.notetitle || "");
            default:
                return 0;
        }
    });

    return sorted;
}

/**
 * Apply all filters and sorting to quizzes
 */
export function filterAndSortQuizzes(
    quizzes: Quiz[],
    options: {
        searchTerm: string;
        scoreFilter: string;
        dateFilter: string;
        sortOption: string;
    }
): Quiz[] {
    if (!quizzes || quizzes.length === 0) return [];

    let result = [...quizzes];
    result = filterBySearch(result, options.searchTerm);
    result = filterByScore(result, options.scoreFilter);
    result = filterByDate(result, options.dateFilter);
    result = sortQuizzes(result, options.sortOption);

    return result;
}

/**
 * Paginate an array of items
 */
export function paginateItems<T>(items: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
}

/**
 * Generate page numbers for pagination with ellipsis
 */
export function getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): (number | string)[] {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    return pages;
}

/**
 * Count active filters
 */
export function countActiveFilters(options: {
    searchTerm: string;
    scoreFilter: string;
    dateFilter: string;
}): number {
    let count = 0;
    if (options.scoreFilter !== "all") count++;
    if (options.dateFilter !== "all") count++;
    if (options.searchTerm.trim()) count++;
    return count;
}
