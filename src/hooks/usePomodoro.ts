"use client";

import { usePomodoroTimer, PomodoroSettings } from "@/context/PomodoroTimerContext";

export type { PomodoroSettings };

export function usePomodoro() {
    const {
        settings,
        settingsId,
        loading,
        saving,
        error,
        updateSetting,
        refetchSettings
    } = usePomodoroTimer();

    return {
        settings,
        settingsId,
        loading,
        saving,
        error,
        updateSetting,
        refetch: refetchSettings,
    };
}
