"use client";

import { ArrowLeft, Pencil, Save, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteHeaderProps {
    isEditing: boolean;
    onBack: () => void;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    isZenMode?: boolean;
    onToggleZenMode?: () => void;
}

export function NoteHeader({
    isEditing,
    onBack,
    onEdit,
    onCancel,
    onSave,
    isZenMode,
    onToggleZenMode,
}: NoteHeaderProps) {
    return (
        <header className={cn(
            "sticky top-0 z-20 transition-all duration-500",
            isZenMode ? "bg-transparent pointer-events-none" : "bg-background/95 backdrop-blur-md"
        )}>
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Notes</span>
                </button>

                <div className="flex items-center gap-2 pointer-events-auto">
                    {onToggleZenMode && (
                        <button
                            onClick={onToggleZenMode}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all mr-2",
                                isZenMode
                                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            title={isZenMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                        >
                            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            <span className="hidden sm:inline">{isZenMode ? "Exit Focus" : "Focus"}</span>
                        </button>
                    )}
                    {!isEditing ? (
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                        >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
