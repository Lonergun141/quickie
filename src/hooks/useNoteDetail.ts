"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Note } from './useNotes';

interface UseNoteDetailReturn {
    note: Note | null;
    loading: boolean;
    error: string | null;
    isEditing: boolean;
    editedTitle: string;
    editedSummary: string;
    hasUnsavedChanges: boolean;
    flashcardsExist: boolean;
    quizExists: boolean;
    isGeneratingFlashcards: boolean;
    isGeneratingQuiz: boolean;
    setEditedTitle: (title: string) => void;
    setEditedSummary: (summary: string) => void;
    startEditing: () => void;
    cancelEditing: () => void;
    saveChanges: () => Promise<boolean>;
    generateFlashcards: () => Promise<boolean>;
    generateQuiz: () => Promise<boolean>;
    refresh: () => void;
}

export function useNoteDetail(noteId: string): UseNoteDetailReturn {
    const { user } = useAuth();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedSummary, setEditedSummary] = useState('');
    const [initialTitle, setInitialTitle] = useState('');
    const [initialSummary, setInitialSummary] = useState('');

    // Flashcard & Quiz state
    const [flashcardsExist, setFlashcardsExist] = useState(false);
    const [quizExists, setQuizExists] = useState(false);
    const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    const fetchNote = useCallback(async () => {
        if (!noteId || !user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/proxy/notes/${noteId}`, { credentials: 'include' });

            if (!response.ok) {
                throw new Error('Failed to fetch note');
            }

            const data = await response.json();
            setNote(data);
            setEditedTitle(data.notetitle || '');
            setEditedSummary(data.notesummary || '');
        } catch (err) {
            console.error('Error fetching note:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch note');
        } finally {
            setLoading(false);
        }
    }, [noteId, user?.id]);

    const checkExistence = useCallback(async () => {
        if (!noteId) return;

        try {
            const [flashcardsRes, quizRes] = await Promise.all([
                fetch(`/api/proxy/flashcards/check/${noteId}`, { credentials: 'include' }),
                fetch(`/api/proxy/quiz/check/${noteId}`, { credentials: 'include' }),
            ]);

            if (flashcardsRes.ok) {
                const flashcardsData = await flashcardsRes.json();
                setFlashcardsExist(flashcardsData.exists);
            }

            if (quizRes.ok) {
                const quizData = await quizRes.json();
                setQuizExists(quizData.exists);
            }
        } catch (err) {
            console.error('Error checking existence:', err);
        }
    }, [noteId]);

    const startEditing = () => {
        if (note) {
            setInitialTitle(note.notetitle || '');
            setInitialSummary(note.notesummary || '');
            setEditedTitle(note.notetitle || '');
            setEditedSummary(note.notesummary || '');
            setIsEditing(true);
        }
    };

    const cancelEditing = () => {
        if (note) {
            setEditedTitle(note.notetitle || '');
            setEditedSummary(note.notesummary || '');
            setIsEditing(false);
        }
    };

    const saveChanges = async (): Promise<boolean> => {
        if (!note || !user) return false;

        try {
            const response = await fetch(`/api/proxy/notes/${noteId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notetitle: editedTitle,
                    notesummary: editedSummary,
                    notecontents: note.notecontents,
                    user: user.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save note');
            }

            const updatedNote = await response.json();
            setNote(updatedNote);
            setIsEditing(false);
            return true;
        } catch (err) {
            console.error('Error saving note:', err);
            return false;
        }
    };

    const generateFlashcards = async (): Promise<boolean> => {
        if (!noteId) return false;

        try {
            setIsGeneratingFlashcards(true);

            const response = await fetch(`/api/proxy/flashcards/create/${noteId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to generate flashcards');
            }

            setFlashcardsExist(true);
            return true;
        } catch (err) {
            console.error('Error generating flashcards:', err);
            return false;
        } finally {
            setIsGeneratingFlashcards(false);
        }
    };

    const generateQuiz = async (): Promise<boolean> => {
        if (!noteId || !note?.notesummary) return false;

        try {
            setIsGeneratingQuiz(true);

            const response = await fetch(`/api/proxy/quiz/create/${noteId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary: note.notesummary }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate quiz');
            }

            setQuizExists(true);
            return true;
        } catch (err) {
            console.error('Error generating quiz:', err);
            return false;
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    // Check for unsaved changes
    const hasUnsavedChanges = isEditing && (
        editedTitle !== initialTitle || editedSummary !== initialSummary
    );

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    useEffect(() => {
        if (note) {
            checkExistence();
        }
    }, [note, checkExistence]);

    return {
        note,
        loading,
        error,
        isEditing,
        editedTitle,
        editedSummary,
        hasUnsavedChanges,
        flashcardsExist,
        quizExists,
        isGeneratingFlashcards,
        isGeneratingQuiz,
        setEditedTitle,
        setEditedSummary,
        startEditing,
        cancelEditing,
        saveChanges,
        generateFlashcards,
        generateQuiz,
        refresh: fetchNote,
    };
}
