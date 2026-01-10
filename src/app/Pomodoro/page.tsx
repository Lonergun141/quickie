"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { usePomodoro } from "@/hooks/usePomodoro";
import {
    PomodoroHeader,
    PomodoroToggle,
    PomodoroTimeSettings,
    PomodoroHowToUse
} from "@/components/Pomodoro";
import { cn } from "@/lib/utils";

export default function PomodoroPage() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { settings, loading, saving, error, updateSetting } = usePomodoro();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">Loading settings...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Sidebar onToggle={setSidebarExpanded} />

            <main className={cn(
                "transition-all duration-300 min-h-screen p-4 lg:p-8 relative",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] pb-4 flex flex-col gap-6">
                    {/* Error Banner */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-center gap-3 rounded-2xl"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-red-700 dark:text-red-300 font-mono text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

                        {/* Left Column: Header (Top) + Settings (Bottom) */}
                        <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
                            {/* Header - Fixed Height */}
                            <div className="h-64 flex-shrink-0">
                                <PomodoroHeader />
                            </div>

                            {/* Settings - Fills remaining space */}
                            <div className="flex-1 min-h-0">
                                <PomodoroTimeSettings
                                    studyTime={settings.studyTime}
                                    shortBreak={settings.shortBreak}
                                    longBreak={settings.longBreak}
                                    onStudyTimeChange={(value) => updateSetting('studyTime', value)}
                                    onShortBreakChange={(value) => updateSetting('shortBreak', value)}
                                    onLongBreakChange={(value) => updateSetting('longBreak', value)}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        {/* Right Column: Toggle + Guide */}
                        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
                            <div className="flex-shrink-0">
                                <PomodoroToggle
                                    enabled={settings.showTimer}
                                    onChange={(value) => updateSetting('showTimer', value)}
                                    disabled={saving}
                                />
                            </div>

                            <div className="flex-1 min-h-0">
                                <PomodoroHowToUse />
                            </div>
                        </div>
                    </div>

                    {/* Saving Indicator */}
                    {saving && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 shadow-2xl rounded-full z-50"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest">Saving Changes</span>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
