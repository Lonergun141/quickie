"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteSetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
}

export function DeleteSetModal({ isOpen, onClose, onConfirm, count }: DeleteSetModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-background border border-border rounded-xl shadow-lg w-full max-w-sm p-6"
                    >
                        <div className="flex items-center gap-3 mb-4 text-destructive">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="text-lg font-bold">Delete All Cards?</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete ALL {count} cards in this set? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium transition-colors"
                            >
                                Delete All
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
