"use client";

import { motion } from "framer-motion";
import { Copy, Calendar } from "lucide-react";
import { FlashcardSet } from "@/hooks/useFlashcards";

interface FlashcardSetCardProps {
    set: FlashcardSet;
    onClick: () => void;
}

export function FlashcardSetCard({ set, onClick }: FlashcardSetCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative cursor-pointer h-full"
        >
            {/* Stack Effect Layers */}
            {/* Bottom Layer */}
            <div className="absolute top-0 left-2 right-2 -mt-4 h-full bg-stone-200 dark:bg-zinc-800/40 rounded-3xl border border-stone-200 dark:border-stone-800/30 transform scale-[0.92] transition-all duration-300 group-hover:-translate-y-3 group-hover:scale-[0.94] z-0 shadow-sm" />

            {/* Middle Layer */}
            <div className="absolute top-0 left-1 right-1 -mt-2 h-full bg-stone-100 dark:bg-zinc-800/70 rounded-3xl border border-stone-200 dark:border-stone-800/50 transform scale-[0.96] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-[0.98] z-10 shadow-sm" />

            {/* Main Card */}
            <div className="relative h-full z-20 bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-stone-200 dark:border-white/10 rounded-3xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:hover:border-primary/50 flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300">
                        <Copy className="w-6 h-6" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 text-xs font-semibold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                        {set.count} Cards
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {set.title}
                    </h3>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center text-xs text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-2 opacity-70" />

                </div>
            </div>
        </div>
    );
}
