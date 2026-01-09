"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    noteTitle: string;
    isDeleting?: boolean;
}

export function DeleteNoteModal({ isOpen, onClose, onConfirm, noteTitle, isDeleting }: DeleteNoteModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white dark:bg-zinc-950 w-full max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-lg font-bold text-foreground">Delete Note</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-muted-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <p className="text-muted-foreground">
                            Are you sure you want to delete <strong className="text-foreground">&quot;{noteTitle}&quot;</strong>?
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                            This action cannot be undone. All associated flashcards and quizzes will also be removed.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 p-6 pt-0">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-5 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Note"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
