"use client";

import { motion } from "framer-motion";
import { Note } from "@/hooks/useNotes";
import { Trash2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface NoteCardProps {
    note: Note;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
    const formattedDate = new Date(note.notedatecreated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const cleanTitle = note.notetitle.replace(/[\"*]/g, '');

    // Create a plain text preview from notesummary or notecontents
    // Improved logic to handle HTML entities and block tags
    const previewText = note.notesummary
        ? note.notesummary
            .replace(/<\/?[^>]+(>|$)/g, ' ') // Replace tags with spaces
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim()
        : "No additional text";

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            onClick={onClick}
            className="group relative flex flex-col justify-between h-full bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
        >
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
                        {cleanTitle}
                    </h3>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed opacity-80">
                    {previewText}
                </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800/50">
                <span className="text-xs font-medium text-muted-foreground/80 bg-stone-100 dark:bg-stone-900 px-2 py-1 rounded-md">
                    {formattedDate}
                </span>

                <Tooltip content="Delete note" side="left">
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </Tooltip>
            </div>

            {/* Subtle gradient accent on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
