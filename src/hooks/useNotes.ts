"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Note {
    id: number;
    notetitle: string;
    notesummary: string;
    notecontents: string;
    notedatecreated: string;
    user: number;
}

type SortOption = 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc';
type DateFilter = 'all' | 'week' | 'month' | 'year';

export function useNotes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>('dateDesc');
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const sortNotes = (notesArray: Note[], option: SortOption): Note[] => {
        return [...notesArray].sort((a, b) => {
            switch (option) {
                case 'dateAsc':
                    return new Date(a.notedatecreated).getTime() - new Date(b.notedatecreated).getTime();
                case 'dateDesc':
                    return new Date(b.notedatecreated).getTime() - new Date(a.notedatecreated).getTime();
                case 'titleAsc':
                    return a.notetitle.localeCompare(b.notetitle);
                case 'titleDesc':
                    return b.notetitle.localeCompare(a.notetitle);
                default:
                    return 0;
            }
        });
    };

    const fetchNotes = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/proxy/user-notes', { credentials: 'include' });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            const userNotes = Array.isArray(data) ? data : [];
            const sorted = sortNotes(userNotes, sortOption);
            setNotes(sorted);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    }, [user?.id, sortOption]);

    const deleteNote = async (id: number): Promise<boolean> => {
        try {
            const response = await fetch(`/api/proxy/notes/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete note');
            }

            // Remove from local state
            setNotes(prev => prev.filter(note => note.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting note:', err);
            return false;
        }
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setNotes(prev => sortNotes(prev, option));
    };

    // Filter notes based on search and date
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.notetitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.notesummary.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const noteDate = new Date(note.notedatecreated);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - noteDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateFilter === 'week') matchesDate = diffDays <= 7;
            else if (dateFilter === 'month') matchesDate = diffDays <= 30;
            else if (dateFilter === 'year') matchesDate = diffDays <= 365;
        }

        return matchesSearch && matchesDate;
    });

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes: filteredNotes,
        allNotes: notes,
        loading,
        error,
        sortOption,
        dateFilter,
        setDateFilter,
        searchTerm,
        setSearchTerm,
        handleSortChange,
        deleteNote,
        refreshNotes: fetchNotes,
    };
}
