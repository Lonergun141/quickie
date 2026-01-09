"use client";

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Flashcard {
    id: number;
    noteID: number; // or string? sticking to number based on logic
    frontCardText: string;
    backCardText: string;
    dateCreated?: string;
    note_title?: string;
}

export interface FlashcardSet {
    id: number; // This is the noteID
    title: string;
    count: number;
    dateCreated: string;
    dateUpdated: string;
    cards?: Flashcard[]; // Optional, populated when fetching specific set
}

export function useFlashcards() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all flashcards and group them by Note ID (Set)
    const fetchFlashcardSets = useCallback(async (): Promise<FlashcardSet[]> => {
        if (!user?.id) return [];
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/proxy/user-flashcards', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch flashcards');

            const data: Flashcard[] = await response.json();

            // Group by noteID
            const grouped = data.reduce((acc, card) => {
                if (!acc[card.noteID]) {
                    // Try to get date from localStorage if previously stored (simulating old app behavior)
                    // Or default to current time if missing. 
                    // In a real app, note_date should come from backend.
                    acc[card.noteID] = {
                        id: card.noteID,
                        title: card.note_title || `Note ${card.noteID}`,
                        count: 0,
                        dateCreated: new Date().toISOString(), // Fallback
                        dateUpdated: new Date().toISOString()
                    };
                }
                acc[card.noteID].count += 1;
                return acc;
            }, {} as Record<string, FlashcardSet>);

            return Object.values(grouped);
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch specific set of cards for a note
    const fetchSetCards = useCallback(async (noteId: string): Promise<Flashcard[]> => {
        setLoading(true);
        setError(null);
        try {
            // Reusing the route seen in useNoteDetail logic or existing patterns
            // The old app used fetchSetFlashcards(noteId).
            // Let's assume /api/proxy/flashcards/set/${noteId} based on standard REST
            // Or maybe /api/proxy/notes/${noteId}/flashcards? 
            // The old file imported fetchSetFlashcards. 
            // Let's guess the proxy route matches the pattern: /api/proxy/flashcards/${noteId}

            const response = await fetch(`/api/proxy/note-flashcards/${noteId}`, { credentials: 'include' });

            // If that fails, we might need to check if it returns all cards and we filter?
            // But typical backend has endpoint. failing that, we'll debug.

            if (!response.ok) throw new Error('Failed to fetch flashcard set');
            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addCard = async (noteId: string, card: { front: string; back: string }) => {
        try {
            const res = await fetch(`/api/proxy/add-flashcard/${noteId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    noteID: noteId,
                    frontCardText: card.front,
                    backCardText: card.back,
                    user: user?.id
                }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to add card');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateCard = async (cardId: number, card: { front: string; back: string }) => {
        try {
            const res = await fetch(`/api/proxy/edit-flashcard/${cardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    frontCardText: card.front,
                    backCardText: card.back
                }),
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to update card');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const deleteCard = async (cardId: number) => {
        try {
            const res = await fetch(`/api/proxy/delete-flashcard/${cardId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete card');
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return {
        loading,
        error,
        fetchFlashcardSets,
        fetchSetCards,
        addCard,
        updateCard,
        deleteCard
    };
}
