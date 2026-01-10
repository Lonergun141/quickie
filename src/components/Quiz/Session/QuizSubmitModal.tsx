"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Send, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    answeredCount: number;
    unansweredCount: number;
    flaggedCount: number;
    totalQuestions: number;
    submitting: boolean;
}

export function QuizSubmitModal({
    isOpen,
    onClose,
    onConfirm,
    answeredCount,
    unansweredCount,
    flaggedCount,
    totalQuestions,
    submitting
}: QuizSubmitModalProps) {
    const hasWarnings = unansweredCount > 0 || flaggedCount > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto border border-zinc-200 dark:border-zinc-800">
                            {/* Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                                        hasWarnings
                                            ? "bg-amber-100 dark:bg-amber-900/30"
                                            : "bg-primary/10"
                                    )}>
                                        {hasWarnings ? (
                                            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        ) : (
                                            <Send className="w-6 h-6 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-foreground">
                                            Submit Quiz?
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {hasWarnings
                                                ? "Please review before submitting:"
                                                : "You're about to submit your quiz."}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 -m-2 rounded-xl text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Warnings */}
                            {hasWarnings && (
                                <div className="px-6 space-y-2">
                                    {unansweredCount > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <HelpCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                                    {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}
                                                </p>
                                                <p className="text-xs text-red-600/70 dark:text-red-400/70">
                                                    These will be marked as incorrect
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {flaggedCount > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <Flag className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                    {flaggedCount} flagged question{flaggedCount > 1 ? 's' : ''}
                                                </p>
                                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                                                    You marked these for review
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stats Summary */}
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm text-muted-foreground">Answered</span>
                                    </div>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {answeredCount} / {totalQuestions}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-2 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Review Answers
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={submitting}
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    <span>Submit</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
