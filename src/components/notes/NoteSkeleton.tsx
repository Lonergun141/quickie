"use client";

import { cn } from "@/lib/utils";

export function NoteSkeleton() {
    return (
        <div className="h-full bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 animate-pulse flex flex-col justify-between">
            <div className="space-y-4 w-full">
                {/* Title Skeleton */}
                <div className="flex justify-between items-start gap-4">
                    <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
                </div>

                {/* Content Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800/50">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
        </div>
    );
}
