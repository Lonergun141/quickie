"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizzes, ReviewData } from "@/hooks/useQuizzes";
import { cn } from "@/lib/utils";
import {
    calculateQuizStats,
    getGradeInfo,
    mapUserAnswersToQuestions
} from "@/lib/quizResults";
import {
    ResultsLeftPanel,
    ResultsQuestionList,
    ResultsLoadingState
} from "@/components/Quiz/Results";

export default function QuizResultsPage() {
    const params = useParams();
    const router = useRouter();
    const noteId = params.id as string;
    const { fetchQuizReview, loading } = useQuizzes();
    const [data, setData] = useState<ReviewData | null>(null);

    useEffect(() => {
        const loadResults = async () => {
            if (!noteId) return;
            const resultData = await fetchQuizReview(noteId);
            setData(resultData);
        };
        loadResults();
    }, [noteId, fetchQuizReview]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!data) return null;
        return calculateQuizStats(data.userTest.TestScore, data.userTest.TestTotalScore);
    }, [data]);

    // Get grade info
    const gradeInfo = useMemo(() => {
        if (!stats) return null;
        return getGradeInfo(stats.percentage);
    }, [stats]);

    // Map user answers to questions
    const userAnswersByQuestion = useMemo(() => {
        if (!data) return {};
        return mapUserAnswersToQuestions(data.answersByNote, data.choicesByQuestion);
    }, [data]);

    // Handlers
    const handleRetake = () => {
        router.push(`/Quiz/${noteId}?retake=true`);
    };

    const handleReviewNotes = () => {
        router.push(`/Notes/${noteId}`);
    };

    const handleBack = () => {
        router.push('/Quiz');
    };

    // Loading state
    if (loading || !data || !stats || !gradeInfo) {
        return <ResultsLoadingState />;
    }

    const { userTest, questions, choicesByQuestion } = data;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className={cn(
                    "absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20",
                    stats.percentage >= 70 ? "bg-emerald-500" : stats.percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                )} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
            </div>

            {/* Main Layout - Side by Side */}
            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Panel */}
                <ResultsLeftPanel
                    percentage={stats.percentage}
                    noteTitle={userTest.notetitle || "Quiz"}
                    dateCreated={userTest.TestDateCreated}
                    gradeInfo={gradeInfo}
                    correctCount={stats.correctCount}
                    incorrectCount={stats.incorrectCount}
                    totalQuestions={questions.length}
                    onBack={handleBack}
                    onRetake={handleRetake}
                    onReviewNotes={handleReviewNotes}
                />

                {/* Right Panel - Question Review */}
                <div className="flex-1 lg:border-l border-zinc-200 dark:border-zinc-800">
                    <ResultsQuestionList
                        questions={questions}
                        choicesByQuestion={choicesByQuestion}
                        userAnswersByQuestion={userAnswersByQuestion}
                    />
                </div>
            </div>
        </div>
    );
}
