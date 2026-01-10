"use client";

import { cn } from "@/lib/utils";

interface TextInputSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    characterCount: number;
    maxCharacters?: number;
}

export function TextInputSection({ value, onChange, error, characterCount }: TextInputSectionProps) {
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="relative group flex-grow flex flex-col">
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder="// Input text data here"
                    className={cn(
                        "w-full h-full p-0 resize-none outline-none text-sm md:text-base bg-transparent pb-10",
                        "text-foreground placeholder:text-muted-foreground/60 transition-colors",
                        "scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent",
                        "selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black"
                    )}
                    spellCheck={false}
                />

                {/* Technical Stats Footer */}
                <div className="absolute bottom-0 right-0 flex items-center gap-2 md:gap-4 px-2 md:px-4 py-1.5 md:py-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-[10px] tracking-widest text-muted-foreground uppercase transition-colors rounded-tl-lg max-w-full overflow-hidden">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0", characterCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700")} />
                        <span className="hidden sm:inline">INPUT_STATUS:</span>
                        <span>{characterCount > 0 ? "ACTIVE" : "IDLE"}</span>
                    </div>
                    <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-800 flex-shrink-0" />
                    <span className={cn("whitespace-nowrap", characterCount > 10000 && "text-red-500")}>
                        LEN: {characterCount.toLocaleString().padStart(5, '0')}
                    </span>
                    <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-800 hidden sm:block flex-shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">
                        REM: {(10000 - characterCount).toLocaleString().padStart(5, '0')}
                    </span>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500 text-xs pl-1 uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
                    ERROR: {error}
                </div>
            )}
        </div>
    );
}
