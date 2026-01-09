"use client";

import { SimpleModal } from "@/components/profile/ProfileComponents";

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function UnsavedChangesModal({ isOpen, onClose, onConfirm }: UnsavedChangesModalProps) {
    return (
        <SimpleModal
            isOpen={isOpen}
            onClose={onClose}
            title="Discard changes?"
        >
            <div className="space-y-5">
                <p className="text-muted-foreground">
                    You have unsaved changes that will be lost if you leave.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Keep Editing
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
                    >
                        Discard
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}
