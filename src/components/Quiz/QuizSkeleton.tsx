export function QuizSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                    <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-4" />
        </div>
    );
}
