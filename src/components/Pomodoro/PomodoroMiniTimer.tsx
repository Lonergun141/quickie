"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Maximize2 } from "lucide-react";
import { usePomodoroTimer, TimerPhase } from "@/context/PomodoroTimerContext";
import { PomodoroTimerPanel } from "./PomodoroTimerPanel";
import { cn } from "@/lib/utils";

interface PomodoroMiniTimerProps {
    isCollapsed: boolean;
    disableAutoOpen?: boolean;
}

export function PomodoroMiniTimer({ isCollapsed, disableAutoOpen = false }: PomodoroMiniTimerProps) {
    const {
        timeRemaining,
        currentPhase,
        isRunning,
        isPaused,
        showTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        formatTime,
        showCompletionModal,
        setShowCompletionModal
    } = usePomodoroTimer();

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        if (showCompletionModal && !disableAutoOpen) {
            setIsPanelOpen(true);
            setShowCompletionModal(false);
        }
    }, [showCompletionModal, disableAutoOpen, setShowCompletionModal]);

    if (!showTimer) return null;

    const phaseColor = {
        study: "text-primary bg-primary/10",
        shortBreak: "text-emerald-500 bg-emerald-500/10",
        longBreak: "text-amber-500 bg-amber-500/10"
    }[currentPhase];

    return (
        <>
            <div className={cn(
                "px-3 py-2 mt-auto mb-2",
                isCollapsed ? "flex justify-center" : ""
            )}>
                <div className={cn(
                    "relative overflow-hidden rounded-2xl transition-all duration-300",
                    isCollapsed ? "w-10 h-10 p-0" : "w-full p-3",
                    "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                )}>
                    {isCollapsed ? (
                        // Collapsed View - Just a circular progress or icon
                        <button
                            onClick={() => setIsPanelOpen(true)}
                            className="w-full h-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                isRunning && !isPaused ? "animate-pulse" : "",
                                currentPhase === 'study' ? "bg-primary" :
                                    currentPhase === 'shortBreak' ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                        </button>
                    ) : (
                        // Expanded View (in expanded sidebar)
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={isRunning && !isPaused ? pauseTimer : (isPaused ? resumeTimer : startTimer)}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                                        phaseColor
                                    )}
                                >
                                    {isRunning && !isPaused ? (
                                        <Pause className="w-3.5 h-3.5 fill-current" />
                                    ) : (
                                        <Play className="w-3.5 h-3.5 fill-current pl-0.5" />
                                    )}
                                </button>

                                <div className="flex flex-col">
                                    <span className="text-xl font-bold font-mono leading-none tracking-tight text-zinc-900 dark:text-zinc-100">
                                        {formatTime(timeRemaining)}
                                    </span>
                                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                        {currentPhase.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPanelOpen(true)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <PomodoroTimerPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                isCollapsed={isCollapsed}
            />
        </>
    );
}
