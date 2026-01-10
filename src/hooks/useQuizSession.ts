"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuizzes, QuizQuestion } from "@/hooks/useQuizzes";

export interface QuizSessionState {
    questions: QuizQuestion[];
    answers: (number | null)[];
    flags: boolean[];
    currentIndex: number;
    loading: boolean;
    submitting: boolean;
    navigatorOpen: boolean;
    confirmModalOpen: boolean;
}

export interface QuizSessionStats {
    answeredCount: number;
    unansweredCount: number;
    flaggedCount: number;
    progressPercent: number;
}

export interface QuizSessionActions {
    handleAnswer: (choiceIndex: number) => void;
    handleFlag: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
    handleJumpTo: (index: number) => void;
    handleSubmitClick: () => void;
    handleConfirmSubmit: () => Promise<void>;
    setNavigatorOpen: (open: boolean) => void;
    setConfirmModalOpen: (open: boolean) => void;
    setCurrentIndex: (index: number) => void;
}

export function useQuizSession(noteId: string, retake: boolean) {
    const router = useRouter();
    const { fetchQuizSession, submitQuiz, fetchQuizReview, updateTestScore } = useQuizzes();

    // Quiz State
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [flags, setFlags] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Navigation State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [navigatorOpen, setNavigatorOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    // Load quiz on mount
    useEffect(() => {
        const loadQuiz = async () => {
            if (!noteId) return;

            if (!retake) {
                const reviewData = await fetchQuizReview(noteId);
                if (reviewData && (reviewData.userTest.TestScore > 0 || reviewData.userTest.TestTotalScore > 0)) {
                    router.replace(`/Quiz/${noteId}/results`);
                    return;
                }
            }

            const data = await fetchQuizSession(noteId);
            setQuestions(data);
            setAnswers(new Array(data.length).fill(null));
            setFlags(new Array(data.length).fill(false));
            setLoading(false);
        };
        loadQuiz();
    }, [noteId, fetchQuizSession, fetchQuizReview, retake, router]);

    // Handlers
    const handleAnswer = useCallback((choiceIndex: number) => {
        setAnswers(prev => {
            const next = [...prev];
            next[currentIndex] = choiceIndex;
            return next;
        });
    }, [currentIndex]);

    const handleFlag = useCallback(() => {
        setFlags(prev => {
            const next = [...prev];
            next[currentIndex] = !next[currentIndex];
            return next;
        });
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, questions.length]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const handleJumpTo = useCallback((index: number) => {
        setCurrentIndex(index);
        setNavigatorOpen(false);
    }, []);

    const handleSubmitClick = useCallback(() => {
        setConfirmModalOpen(true);
    }, []);

    const handleConfirmSubmit = useCallback(async () => {
        setConfirmModalOpen(false);
        setSubmitting(true);
        try {
            const formattedAnswers = answers
                .map((ans, idx) => {
                    if (ans === null) return null;
                    const question = questions[idx];
                    const choice = question.choices?.[ans];
                    return choice ? { questionIndex: idx, choiceId: choice.id } : null;
                })
                .filter(Boolean) as { questionIndex: number, choiceId: number }[];

            await submitQuiz(noteId, formattedAnswers, questions.length);

            let score = 0;
            answers.forEach((ansIndex, qIndex) => {
                if (ansIndex !== null) {
                    const question = questions[qIndex];
                    const choice = question.choices?.[ansIndex];
                    if (choice && choice.isAnswer) {
                        score++;
                    }
                }
            });

            try {
                await updateTestScore(noteId, score, questions.length);
            } catch (e) {
                console.error("Failed to update score", e);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            router.push(`/Quiz/${noteId}/results`);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setSubmitting(false);
        }
    }, [answers, questions, noteId, submitQuiz, updateTestScore, router]);

    // Computed stats
    const answeredCount = answers.filter(a => a !== null).length;
    const unansweredCount = questions.length - answeredCount;
    const flaggedCount = flags.filter(f => f).length;
    const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    const state: QuizSessionState = {
        questions,
        answers,
        flags,
        currentIndex,
        loading,
        submitting,
        navigatorOpen,
        confirmModalOpen
    };

    const stats: QuizSessionStats = {
        answeredCount,
        unansweredCount,
        flaggedCount,
        progressPercent
    };

    const actions: QuizSessionActions = {
        handleAnswer,
        handleFlag,
        handleNext,
        handlePrevious,
        handleJumpTo,
        handleSubmitClick,
        handleConfirmSubmit,
        setNavigatorOpen,
        setConfirmModalOpen,
        setCurrentIndex
    };

    return { state, stats, actions };
}
