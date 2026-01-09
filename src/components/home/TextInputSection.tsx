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
        <div className="space-y-4">
            <div className="relative group">
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder="Paste your text here..."
                    className={cn(
                        "w-full min-h-[400px] p-6 resize-none outline-none",
                        "bg-transparent rounded-2xl",
                        "border-2 border-transparent focus:border-white/10 transition-all",
                        "text-lg leading-relaxed placeholder:text-muted-foreground/40",
                        "scrollbar-thin scrollbar-thumb-white/10"
                    )}
                />

                {/* Floating Stats */}
                <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border text-xs font-medium text-muted-foreground shadow-sm">
                    <span className={cn(characterCount > 10000 && "text-red-500")}>
                        {characterCount.toLocaleString()} chars
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <span>
                        {(10000 - characterCount).toLocaleString()} left
                    </span>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm pl-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                </div>
            )}
        </div>
    );
}
