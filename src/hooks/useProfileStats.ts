"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Badge {
    id: string;
    image: string;
    title: string;
    description: string;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    notesCount: number;
    flashcardCount: number;
    averageScore: number;
    perfectQuizAchieved: boolean;
    perfectQuizCount: number;
    userId: string;
}

export interface Achievement {
    id?: number;
    user: number;
    badge: string; // badge id
    date_earned?: string;
}

// Badge Definitions
const BADGE_DEFINITIONS: Record<string, Badge> = {
    NOTE_TAKER: {
        id: '70b81abb-3b90-4d1a-86bf-bb6d301a6469',
        image: '/Badges/badgesImage/badge2.png',
        title: 'Studiest',
        description: 'Created your first note!',
        condition: (stats) => stats.notesCount >= 1,
    },
    FLASH_MASTER: {
        id: 'd2b83c92-b21d-4a7d-8a62-19ad645af597',
        image: '/Badges/badgesImage/badge4.png',
        title: 'Flash Master',
        description: 'Generated at least 160 flashcards',
        condition: (stats) => stats.flashcardCount >= 160,
    },
    QUIZ_WHIZ: {
        id: '311ceeb1-2b9d-4c2a-9be3-c3ea99b12baa',
        image: '/Badges/badgesImage/badge3.png',
        title: 'Quiz Whiz',
        description: 'Achieved 100% on quiz evaluation',
        condition: (stats) => stats.averageScore === 100,
    },
    PERFECTIONIST: {
        id: '9dcc364a-b91c-4419-8de5-c7c5289ec651',
        image: '/Badges/badgesImage/badge1.png',
        title: 'Perfectionist',
        description: 'Achieved a perfect score on a quiz!',
        condition: (stats) => stats.perfectQuizAchieved === true,
    },
    NOTERER: {
        id: '8f75f97c-ad51-408e-868d-cfe347057e0c',
        image: '/Badges/badgesImage/badge5.png',
        title: 'Noterer',
        description: 'Generate 5 notes',
        condition: (stats) => stats.notesCount >= 5,
    },
    DOUBLE_PERFECT: {
        id: '94a316ae-e416-47a4-9cc5-9a403d28649a',
        image: '/Badges/badgesImage/badge6.png',
        title: 'What a Nice',
        description: 'Achieved two perfect scores on quizzes!',
        condition: (stats) => stats.perfectQuizCount >= 2,
    },
    HMMM: {
        id: '2846831f-015d-4c45-8721-05a4061abe70',
        image: '/Badges/badgesImage/badge7.png',
        title: 'Accidental Genius Award',
        description: 'Achieved three perfect scores on quizzes!',
        condition: (stats) => stats.perfectQuizCount >= 3,
    },
    PORTAYMS: {
        id: 'ad382090-b78e-48ff-af35-99c33d251a67',
        image: '/Badges/badgesImage/badge8.png',
        title: 'I Believe You Now',
        description: 'Achieved four perfect scores on quizzes!',
        condition: (stats) => stats.perfectQuizCount >= 4,
    },
};

export function useProfileStats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<UserStats>({
        notesCount: 0,
        flashcardCount: 0,
        averageScore: 0,
        perfectQuizAchieved: false,
        perfectQuizCount: 0,
        userId: '',
    });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [newBadges, setNewBadges] = useState<Badge[]>([]);

    const fetchData = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);

            // Helper to handle fetch and check for HTML responses
            const safeFetch = async (url: string) => {
                const res = await fetch(url, { credentials: 'include' });
                if (!res.ok) {
                    const text = await res.text();
                    console.error(`Fetch failed for ${url}. Status: ${res.status}. Body snippet: ${text.slice(0, 100)}`);
                    throw new Error(`Server returned ${res.status} for ${url}`);
                }
                return res.json();
            };

            // 1. Fetch Flashcards
            const flashcardsData = await safeFetch('/api/proxy/user-flashcards');
            const flashcardCount = Array.isArray(flashcardsData) ? flashcardsData.length : 0;

            // 2. Fetch Notes
            const notesData = await safeFetch('/api/proxy/user-notes');
            const userNotes = Array.isArray(notesData) ? notesData.filter((n: any) => n.user === user.id) : [];
            const notesCount = userNotes.length;

            // 3. Fetch Quizzes & Calculate Scores
            const quizData = await safeFetch('/api/proxy/user-quizzes');

            let totalScore = 0;
            let totalQuizzes = 0;
            let perfectQuizAchieved = false;
            let perfectQuizCount = 0;

            if (Array.isArray(quizData)) {
                quizData.forEach((quiz: any) => {
                    if (quiz.TestScore !== undefined && quiz.TestTotalScore !== undefined) {
                        totalScore += quiz.TestScore;
                        totalQuizzes += quiz.TestTotalScore;

                        if (quiz.TestScore === quiz.TestTotalScore && quiz.TestTotalScore > 0) {
                            perfectQuizAchieved = true;
                            perfectQuizCount++;
                        }
                    }
                });
            }

            const averageScore = totalQuizzes > 0 ? parseFloat(((totalScore / totalQuizzes) * 100).toFixed(2)) : 0;

            const currentStats: UserStats = {
                notesCount,
                flashcardCount,
                averageScore,
                perfectQuizAchieved,
                perfectQuizCount,
                userId: user.id.toString(),
            };

            // 4. Fetch Achievements
            const achievementsData = await safeFetch(`/api/proxy/achievements?user=${user.id}`);
            const currentAchievements = Array.isArray(achievementsData) ? achievementsData : [];

            // Update state
            setStats(currentStats);
            setAchievements(currentAchievements);

            // 5. Check for new badges
            checkAndAwardBadges(currentStats, currentAchievements);

        } catch (error) {
            console.error("[useProfileStats] Final Catch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const checkAndAwardBadges = async (currentStats: UserStats, currentAchievements: Achievement[]) => {
        if (!user) return;

        const newlyEarned: Badge[] = [];

        for (const badgeKey in BADGE_DEFINITIONS) {
            const badge = BADGE_DEFINITIONS[badgeKey];
            const isEarned = currentAchievements.some(a => a.badge === badge.id);

            if (!isEarned && badge.condition(currentStats)) {
                try {
                    // Create achievement
                    const createRes = await fetch('/api/proxy/achievements', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user: user.id,
                            badge: badge.id
                        })
                    });

                    if (createRes.ok) {
                        newlyEarned.push(badge);
                        // Update local state to reflect earned
                        const newAchievement = await createRes.json();
                        setAchievements(prev => [...prev, newAchievement]);
                    }
                } catch (err) {
                    console.error(`Failed to award badge ${badge.title}`, err);
                }
            }
        }

        if (newlyEarned.length > 0) {
            setNewBadges(newlyEarned);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loading,
        stats,
        achievements,
        badgeDefinitions: BADGE_DEFINITIONS,
        newBadges,
        clearNewBadges: () => setNewBadges([]),
        refresh: fetchData
    };
}
