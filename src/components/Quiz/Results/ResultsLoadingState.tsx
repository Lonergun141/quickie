"use client";

import { Loader2 } from "lucide-react";

export function ResultsLoadingState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading results...</p>
        </div>
    );
}
