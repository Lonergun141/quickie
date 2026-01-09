"use client";

import { Calendar } from "lucide-react";

interface NoteTitleSectionProps {
    title: string;
    date: string;
    isEditing: boolean;
    editedTitle: string;
    onTitleChange: (title: string) => void;
}

export function NoteTitleSection({
    title,
    date,
    isEditing,
    editedTitle,
    onTitleChange,
}: NoteTitleSectionProps) {
    return (
        <header className="space-y-4">
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full text-3xl lg:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                    placeholder="Note Title..."
                    autoFocus
                />
            ) : (
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                    {title.replace(/[\"*]/g, '')}
                </h1>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {date}
                </span>
            </div>
        </header>
    );
}
