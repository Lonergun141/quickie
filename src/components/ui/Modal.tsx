"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    X,
    AlertTriangle,
    CheckCircle,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalType = "success" | "error" | "warning" | "info";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: ModalType;
}

export function Modal({ isOpen, onClose, title, message, type = "info" }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "success": return CheckCircle;
            case "error": return X;
            case "warning": return AlertTriangle;
            default: return Info;
        }
    };

    const getColorClass = () => {
        switch (type) {
            case "success": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case "error": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "warning": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        }
    };

    const Icon = getIcon();

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-background border rounded-2xl shadow-xl w-full max-w-md transform transition-all scale-100 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", getColorClass())}>
                            <Icon className="text-xl" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
