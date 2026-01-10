"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastType } from "../components/ui/Toast";
import { AnimatePresence } from "framer-motion";

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toast: {
        success: (message: string, duration?: number) => void;
        error: (message: string, duration?: number) => void;
        info: (message: string, duration?: number) => void;
        warning: (message: string, duration?: number) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg: string, dur?: number) => addToast(msg, "success", dur),
        error: (msg: string, dur?: number) => addToast(msg, "error", dur),
        info: (msg: string, dur?: number) => addToast(msg, "info", dur),
        warning: (msg: string, dur?: number) => addToast(msg, "warning", dur),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <Toast
                            key={t.id}
                            id={t.id}
                            message={t.message}
                            type={t.type}
                            onClose={() => removeToast(t.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
