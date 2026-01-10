"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";
import { Quiz } from "@/hooks/useQuizzes";

interface QuizDeleteModalProps {
    isOpen: boolean;
    quiz: Quiz | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function QuizDeleteModal({
    isOpen,
    quiz,
    isDeleting,
    onClose,
    onConfirm
}: QuizDeleteModalProps) {
    if (!isOpen || !quiz) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => !isDeleting && onClose()}
            />
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Delete Quiz?
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                                Are you sure you want to delete this quiz? This action cannot be undone and will remove your score and progress.
                            </p>
                            {quiz.notetitle && (
                                <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    &ldquo;{quiz.notetitle}&rdquo;
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? 'Deleting...' : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete Quiz
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
