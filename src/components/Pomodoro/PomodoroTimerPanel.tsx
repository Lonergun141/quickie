"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    SkipForward,
    RotateCcw,
    X,
    Minimize2,
    Coffee,
    Brain,
    Zap
} from "lucide-react";
import { usePomodoroTimer, TimerPhase } from "@/context/PomodoroTimerContext";
import { cn } from "@/lib/utils";

interface PomodoroTimerPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed?: boolean; // For desktop positioning
}

export function PomodoroTimerPanel({ isOpen, onClose, isCollapsed }: PomodoroTimerPanelProps) {
    const {
        timeRemaining,
        totalDuration,
        currentPhase,
        isRunning,
        isPaused,
        completedPomodoros,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        skipPhase,
        formatTime
    } = usePomodoroTimer();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const progress = 100 - (timeRemaining / totalDuration) * 100;

    const phaseConfig: Record<TimerPhase, { label: string; icon: any; color: string; bgColor: string }> = {
        study: {
            label: "Study Time",
            icon: Brain,
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        shortBreak: {
            label: "Short Break",
            icon: Coffee,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10"
        },
        longBreak: {
            label: "Long Break",
            icon: Zap,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10"
        }
    };

    const currentConfig = phaseConfig[currentPhase];
    const Icon = currentConfig.icon;

    // Responsive variants
    const panelVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            x: 0
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] lg:hidden"
                    />

                    <motion.div
                        key="panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                            "fixed z-[100] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6",
                            // Mobile: Bottom Sheet
                            "bottom-4 inset-x-4 rounded-3xl w-auto",
                            // Desktop: Sidebar Popover
                            "lg:bottom-8 lg:w-80",
                            isCollapsed
                                ? "lg:left-24" // Next to collapsed sidebar
                                : "lg:left-72" // Next to expanded sidebar
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className={cn("p-2 rounded-2xl", currentConfig.bgColor)}>
                                    <Icon className={cn("w-4 h-4", currentConfig.color)} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                                        {currentConfig.label}
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Session {completedPomodoros + 1}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <div className="relative flex items-center justify-center mb-8">
                            {/* Circular Progress */}
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        className="stroke-zinc-100 dark:stroke-zinc-800 fill-none stroke-[6]"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        className={cn("fill-none stroke-[6] transition-all duration-1000 ease-linear", currentConfig.color)}
                                        strokeDasharray={2 * Math.PI * 88}
                                        strokeDashoffset={(2 * Math.PI * 88) * (1 - progress / 100)}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={cn("text-4xl font-bold font-mono tracking-wider", currentConfig.color)}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-widest">
                                        {isRunning && !isPaused ? "Running" : isPaused ? "Paused" : "Ready"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={resetTimer}
                                className="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                title="Reset Timer"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>

                            {!isRunning || isPaused ? (
                                <button
                                    onClick={isRunning ? resumeTimer : startTimer}
                                    className={cn(
                                        "p-4 rounded-full text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all",
                                        currentPhase === 'study' ? "bg-primary" :
                                            currentPhase === 'shortBreak' ? "bg-emerald-500" : "bg-amber-500"
                                    )}
                                >
                                    <Play className="w-6 h-6 fill-current pl-1" />
                                </button>
                            ) : (
                                <button
                                    onClick={pauseTimer}
                                    className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    <Pause className="w-6 h-6 fill-current" />
                                </button>
                            )}

                            <button
                                onClick={skipPhase}
                                className="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                title="Skip Phase"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
