"use client";

import { Sparkles } from "lucide-react";
import { SimpleModal } from "@/components/profile/ProfileComponents";

interface GenerateModalProps {
    type: 'flashcards' | 'quiz' | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function GenerateModal({ type, onClose, onConfirm }: GenerateModalProps) {
    return (
        <SimpleModal
            isOpen={type !== null}
            onClose={onClose}
            title={type === 'flashcards' ? 'Generate Flashcards' : 'Generate Quiz'}
        >
            <div className="space-y-5">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-foreground font-medium">
                            {type === 'flashcards'
                                ? 'Create flashcards from this note'
                                : 'Create a quiz from this note'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {type === 'flashcards'
                                ? 'AI will extract key concepts and create study cards automatically.'
                                : 'AI will generate multiple-choice questions to test your knowledge.'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                    >
                        Generate
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}
