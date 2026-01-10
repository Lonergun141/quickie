"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: () => void;
}

const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const styles = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    warning: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
};

export function Toast({ id, message, type, onClose }: ToastProps) {
    const Icon = icons[type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px] max-w-[400px]",
                "bg-white/80 dark:bg-zinc-900/80", // Glass background
                styles[type]
            )}
        >
            <Icon size={20} className="shrink-0" />
            <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
