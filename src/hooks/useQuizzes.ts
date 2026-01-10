"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface QuizChoice {
    id: number;
    question: number;
    item_choice_text: string;
    isAnswer: boolean;
}

export interface QuizQuestion {
    id: number;
    note: number;
    TestQuestion: string;
    choices?: QuizChoice[];
}

export interface Quiz {
    note: number; // This is the ID used to fetch the quiz (linked to note)
    user: number;
    TestScore: number;
    TestTotalScore: number;
    TestDateCreated: string;
    notetitle?: string; // Enhanced property
}

export interface ReviewData {
    userTest: Quiz;
    questions: QuizQuestion[];
    choicesByQuestion: { [key: number]: QuizChoice[] };
    answersByNote: { id: number; answer: number; question: number }[];
}

export function useQuizzes() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Quiz History (User Tests)
    const fetchQuizHistory = useCallback(async (): Promise<Quiz[]> => {
        if (!user?.id) return [];
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/proxy/user-quizzes', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch quizzes');

            const quizzes: Quiz[] = await response.json();

            // Fetch note titles for each quiz
            // We can do this in parallel, but be mindful of rate limits if many quizzes.
            // For now, simple Promise.all is fine as user likely has < 100 quizzes.
            const enhancedQuizzes = await Promise.all(quizzes.map(async (quiz) => {
                try {
                    const noteRes = await fetch(`/api/proxy/notes/${quiz.note}`, { credentials: 'include' });
                    if (noteRes.ok) {
                        const noteData = await noteRes.json();
                        return { ...quiz, notetitle: noteData.notetitle };
                    }
                } catch (e) {
                    console.warn(`Failed to fetch note title for quiz ${quiz.note}`, e);
                }
                return { ...quiz, notetitle: `Quiz ${quiz.note}` };
            }));

            return enhancedQuizzes;
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch Quiz Content (Questions & Choices)
    const fetchQuizSession = useCallback(async (noteId: string): Promise<QuizQuestion[]> => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Questions
            const qRes = await fetch(`/api/proxy/quiz/questions/${noteId}`, { credentials: 'include' });
            if (!qRes.ok) throw new Error('Failed to fetch quiz questions');
            const questions: QuizQuestion[] = await qRes.json();

            if (!Array.isArray(questions)) throw new Error('Invalid questions data');

            // 2. Fetch Choices for each question
            // Randomize questions first? The old app did shuffleArray.
            // We'll shuffle in the Component to keep hook pure regarding data fetching.

            const questionsWithChoices = await Promise.all(questions.map(async (q) => {
                const cRes = await fetch(`/api/proxy/quiz/choices/${q.id}`, { credentials: 'include' });
                const choices = cRes.ok ? await cRes.json() : [];
                return { ...q, choices };
            }));

            return questionsWithChoices;
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Submit Quiz
    // Strategy: Delete all old answers for this test, then create new ones in loop.
    const submitQuiz = async (noteId: string, answers: { questionIndex: number, choiceId: number }[], totalQuestions: number) => {
        try {
            setLoading(true);

            // 1. Get existing answers to delete (or just use deleteAll endpoint logic if we had one, but we have to fetch-then-delete based on old service)
            // Old service: fetchAllChoiceAnswersForNote -> delete each.
            const ansRes = await fetch(`/api/proxy/quiz/answers-by-note/${noteId}`, { credentials: 'include' });
            if (ansRes.ok) {
                const existingAnswers = await ansRes.json();
                if (Array.isArray(existingAnswers)) {
                    await Promise.all(existingAnswers.map((ans: any) =>
                        fetch(`/api/proxy/quiz/answer-detail/${ans.answer || ans.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                    ));
                }
            }

            // 2. Submit new answers
            let score = 0;
            // We don't verify correctness here against backend unless backend returns correctness on submit.
            // Old app calculates score on frontend by checking `isAnswer` on choice.
            // We'll leave calculation to component or here?
            // "The component calculates score locally and passed to Results page."
            // But we still need to submit to backend so backend record is correct?
            // "submitQuizAnswer" endpoint: POST `/choice-answer/create/${choiceId}/`

            await Promise.all(answers.map(async (ans) => {
                await fetch(`/api/proxy/quiz/submit-answer/${ans.choiceId}`, {
                    method: 'POST',
                    credentials: 'include'
                });
            }));

            // Note: We are NOT updating the test score on the backend explicitly via `updateTestScore` 
            // because `quiz.jsx` didn't seem to call it. 
            // However, `quizServices.js` HAD `updateTestScore`. 
            // If the backend doesn't auto-calculate, the history will show 0/0 or old score.
            // I should probably update the score if I can.
            // I'll add a helper for that.

            return true;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteQuiz = async (noteId: number) => {
        try {
            // Delete the quiz (UserTest) and answers
            // Logic in `quizServices.js`: delete `/usertest-detail/${noteId}` then `deleteAllChoiceAnswers`.
            // But `deleteQuiz` in services does delete UserTest FIRST.
            // wait... if you delete UserTest, cascade delete might handle answers?
            // Service deletes UserTest THEN answers.
            // I'll follow service.

            const res = await fetch(`/api/proxy/quiz/detail/${noteId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to delete quiz');

            // also delete answers (clean up)
            const ansRes = await fetch(`/api/proxy/quiz/answers-by-note/${noteId}`, { credentials: 'include' });
            if (ansRes.ok) {
                const existingAnswers = await ansRes.json();
                if (Array.isArray(existingAnswers)) {
                    await Promise.all(existingAnswers.map((ans: any) =>
                        fetch(`/api/proxy/quiz/answer-detail/${ans.answer || ans.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                    ));
                }
            }

            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    const fetchQuizReview = useCallback(async (noteId: string): Promise<ReviewData | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/proxy/quiz/review/${noteId}`, { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch quiz review');
            return await response.json();
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTestScore = async (noteId: string, score: number, total: number) => {
        try {
            // The backend might expect a specific endpoint for updating score, 
            // OR we might update the UserTest via PUT /detail/[id]
            // The old code used `updateTestScore` service which likely hit a specific endpoint or PUT.
            // Looking at `route.ts` for `/detail/[id]`, it supports PUT.
            // We'll assume PUT to `/usertest-detail/${id}/` updates the score.

            const response = await fetch(`/api/proxy/quiz/detail/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    TestScore: score,
                    TestTotalScore: total
                })
            });

            if (!response.ok) throw new Error('Failed to update score');
            return await response.json();

        } catch (err: any) {
            console.error("Score update failed", err);
            // Don't set global error for background updates usually, but here maybe?
        }
    };

    return {
        loading,
        error,
        fetchQuizHistory,
        fetchQuizSession,
        fetchQuizReview,
        submitQuiz,
        deleteQuiz,
        updateTestScore
    };
}
