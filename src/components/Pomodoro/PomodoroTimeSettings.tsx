"use client";

import { Clock, Coffee, Zap, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PomodoroTimeSettingsProps {
    studyTime: number;
    shortBreak: number;
    longBreak: number;
    onStudyTimeChange: (value: number) => void;
    onShortBreakChange: (value: number) => void;
    onLongBreakChange: (value: number) => void;
    disabled?: boolean;
}

export function PomodoroTimeSettings({
    studyTime,
    shortBreak,
    longBreak,
    onStudyTimeChange,
    onShortBreakChange,
    onLongBreakChange,
    disabled
}: PomodoroTimeSettingsProps) {
    const settings = [
        {
            key: 'studyTime',
            label: 'Study Session',
            description: 'Focus duration',
            icon: Clock,
            value: studyTime,
            onChange: onStudyTimeChange,
        },
        {
            key: 'shortBreak',
            label: 'Short Break',
            description: 'Quick recharge',
            icon: Coffee,
            value: shortBreak,
            onChange: onShortBreakChange,
        },
        {
            key: 'longBreak',
            label: 'Long Break',
            description: 'Deep rest',
            icon: Zap,
            value: longBreak,
            onChange: onLongBreakChange,
        },
    ];

    const handleChange = (onChange: (value: number) => void, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 120) {
            onChange(numValue);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-2">Timer Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {settings.map(({ key, label, description, icon: Icon, value, onChange }) => (
                    <div
                        key={key}
                        className="group relative bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-white/10 p-6 flex flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-colors duration-500 rounded-3xl"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                {label}
                            </span>
                            <Icon className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                        </div>

                        <div className="relative mt-2">
                            <div className="flex items-baseline gap-1">
                                <input
                                    type="number"
                                    id={key}
                                    value={value}
                                    onChange={(e) => handleChange(onChange, e.target.value)}
                                    disabled={disabled}
                                    min="1"
                                    max="120"
                                    className="w-full bg-transparent border-none p-0 text-5xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 placeholder-zinc-200 focus:ring-0"
                                />
                                <span className="absolute bottom-2 right-0 text-sm font-medium text-zinc-400">min</span>
                            </div>
                        </div>

                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 font-medium tracking-wide">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
