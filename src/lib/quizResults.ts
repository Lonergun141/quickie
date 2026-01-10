import { Trophy, Sparkles, Target, BookOpen, AlertCircle, LucideIcon } from "lucide-react";

export interface GradeInfo {
    grade: string;
    message: string;
    color: string;
    icon: LucideIcon;
}

export interface QuizStats {
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
}

/**
 * Calculate quiz statistics from test scores
 */
export function calculateQuizStats(testScore: number, testTotalScore: number): QuizStats {
    const percentage = testTotalScore > 0
        ? Math.round((testScore / testTotalScore) * 100)
        : 0;

    return {
        percentage,
        correctCount: testScore,
        incorrectCount: testTotalScore - testScore,
        totalQuestions: testTotalScore
    };
}

/**
 * Get grade info (letter grade, message, color, icon) based on percentage
 */
export function getGradeInfo(percentage: number): GradeInfo {
    if (percentage >= 90) return { grade: "A", message: "Outstanding!", color: "emerald", icon: Trophy };
    if (percentage >= 80) return { grade: "B", message: "Great job!", color: "blue", icon: Sparkles };
    if (percentage >= 70) return { grade: "C", message: "Good effort!", color: "amber", icon: Target };
    if (percentage >= 60) return { grade: "D", message: "Keep practicing!", color: "orange", icon: BookOpen };
    return { grade: "F", message: "Don't give up!", color: "red", icon: AlertCircle };
}

/**
 * Get score color class based on percentage
 */
export function getScoreColorClass(percentage: number, type: 'stroke' | 'bg' | 'text' = 'stroke'): string {
    const colorMap = {
        stroke: {
            high: "stroke-emerald-500",
            medium: "stroke-amber-500",
            low: "stroke-red-500"
        },
        bg: {
            high: "bg-emerald-500",
            medium: "bg-amber-500",
            low: "bg-red-500"
        },
        text: {
            high: "text-emerald-500",
            medium: "text-amber-500",
            low: "text-red-500"
        }
    };

    const level = percentage >= 70 ? 'high' : percentage >= 50 ? 'medium' : 'low';
    return colorMap[type][level];
}

/**
 * Get badge color classes based on percentage
 */
export function getBadgeColorClasses(percentage: number): string {
    if (percentage >= 70) {
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    }
    if (percentage >= 50) {
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    }
    return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
}

/**
 * Map user answers to questions by finding which question each choice belongs to
 */
export function mapUserAnswersToQuestions(
    answersByNote: any[] | null,
    choicesByQuestion: { [key: string]: any[] } | null
): { [key: string]: any } {
    const userAnswersByQuestion: { [key: string]: any } = {};

    if (!answersByNote || !Array.isArray(answersByNote) || !choicesByQuestion) {
        return userAnswersByQuestion;
    }

    answersByNote.forEach((answerObj: any) => {
        const choiceId = answerObj.answer;
        if (!choiceId) return;

        // Find the question that this choice belongs to
        let questionId: string | undefined;

        for (const qId in choicesByQuestion) {
            const choices = choicesByQuestion[qId];
            if (Array.isArray(choices) && choices.some((choice: any) => choice.id === choiceId)) {
                questionId = qId;
                break;
            }
        }

        if (questionId) {
            const userChoice = choicesByQuestion[questionId]?.find(
                (choice: any) => choice.id === choiceId
            );
            if (userChoice) {
                userAnswersByQuestion[questionId] = userChoice;
            }
        }
    });

    return userAnswersByQuestion;
}

/**
 * Format date for display
 */
export function formatQuizDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
