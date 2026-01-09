"use client";

import { motion } from "framer-motion";

export function FlashcardSetSkeleton() {
    return (
        <div className="relative h-full min-h-[12rem]">
            {/* Stack Effect Layers Skeleton */}
            <div className="absolute top-0 left-1 right-1 -mt-2 h-full bg-white/10 dark:bg-zinc-800/10 rounded-3xl border border-stone-200/30 dark:border-stone-800/30 animate-pulse delay-75" />
            <div className="absolute top-0 left-2 right-2 -mt-4 h-full bg-white/5 dark:bg-zinc-800/5 rounded-3xl border border-stone-200/20 dark:border-stone-800/20 animate-pulse delay-150" />

            {/* Main Card Skeleton */}
            <div className="relative h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 flex flex-col animate-pulse">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-200/50 dark:bg-stone-800/50" />
                    <div className="w-16 h-6 rounded-full bg-stone-200/50 dark:bg-stone-800/50" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="w-3/4 h-7 rounded-lg bg-stone-200/50 dark:bg-stone-800/50" />
                    <div className="w-1/2 h-5 rounded-lg bg-stone-200/30 dark:bg-stone-800/30" />
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-dashed border-stone-200/50 dark:border-stone-800/50 flex items-center">
                    <div className="w-4 h-4 rounded bg-stone-200/50 dark:bg-stone-800/50 mr-2" />
                    <div className="w-24 h-4 rounded bg-stone-200/50 dark:bg-stone-800/50" />
                </div>
            </div>
        </div>
    );
}
