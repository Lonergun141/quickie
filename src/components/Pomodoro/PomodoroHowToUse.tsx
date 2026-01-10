"use client";

import { CheckCircle, Clock, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDE_ITEMS = [
    {
        icon: CheckCircle,
        title: 'Pick a Task',
        description: 'Choose a note to focus on.'
    },
    {
        icon: Clock,
        title: 'Start Timer',
        description: 'Focus for 25 minutes.'
    },
    {
        icon: Coffee,
        title: 'Short Break',
        description: 'Take a 5-min breather.'
    },
    {
        icon: Zap,
        title: 'Long Break',
        description: 'Rest after 4 cycles.'
    }
];

export function PomodoroHowToUse() {
    return (
        <div className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl h-full">
            <h2 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest mb-6">
                How It Works
            </h2>

            <div className="space-y-6">
                {GUIDE_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-start gap-4 group">
                            <div className="mt-1 w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 transition-colors" />

                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight group-hover:tracking-wide transition-all duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </div>

                            <Icon className="w-4 h-4 text-zinc-300 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
