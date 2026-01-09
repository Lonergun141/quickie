"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useColorTheme, colorThemes, type ColorTheme } from "@/context/ColorThemeContext";
import { usePreferences, type Language } from "@/context/PreferencesContext";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";
import { DeactivateAccountModal } from "@/components/settings/DeactivateAccountModal";
import { Moon, Sun, Lock, ShieldAlert, Palette, Monitor, Languages, Type, ChevronDown } from "lucide-react";

export default function SettingsPage() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { colorTheme, setColorTheme } = useColorTheme();
    const { language, setLanguage, fontSize, setFontSize, t } = usePreferences();
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false);

    const handleSidebarToggle = (expanded: boolean) => {
        setSidebarExpanded(expanded);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background w-full text-foreground selection:bg-primary/20 overflow-hidden">
            <Sidebar onToggle={handleSidebarToggle} />

            <main className={cn(
                "transition-all duration-300 flex-grow relative min-h-screen p-6",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Background Ambient */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                </div>

                <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col gap-2 pt-4">
                        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-incompleeta)' }}>
                            {t('settings.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('settings.subtitle')}
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-0">

                        {/* Appearance Block - Large */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group lg:col-span-2 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-primary" />
                                    {t('settings.lookAndFeel')}
                                </h2>
                                <p className="text-sm text-muted-foreground mb-6">{t('settings.lookAndFeelDesc')}</p>

                                <div className="space-y-6">
                                    {/* Theme Mode */}
                                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-stone-100 dark:border-stone-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                                {resolvedTheme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{t('settings.themeMode')}</p>
                                                <p className="text-xs text-muted-foreground">{theme === "dark" ? t('settings.dark') : t('settings.light')} {t('settings.modeActive')}</p>
                                            </div>
                                        </div>
                                        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                                            {(["light", "system", "dark"] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setTheme(mode)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                        theme === mode
                                                            ? "bg-white dark:bg-zinc-700 text-foreground shadow-sm"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    {t(`settings.${mode}`)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {colorThemes.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setColorTheme(t.id as ColorTheme)}
                                                className={cn(
                                                    "relative group/btn flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300",
                                                    colorTheme === t.id
                                                        ? "bg-primary/5 border-primary/50 shadow-sm"
                                                        : "bg-white/40 dark:bg-zinc-900/40 border-stone-200 dark:border-stone-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                                )}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-transform group-hover/btn:scale-110"
                                                    style={{ backgroundColor: t.color }}
                                                >
                                                    {colorTheme === t.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-3 h-3 rounded-full bg-white"
                                                            layoutId="activeColorDot"
                                                        />
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium transition-colors",
                                                    colorTheme === t.id ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {t.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Security Block - Vertical Stack */}
                        <div className="flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex-1 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6"
                            >
                                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    {t('settings.security')}
                                </h2>
                                <p className="text-sm text-muted-foreground mb-6">{t('settings.securityDesc')}</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setPasswordModalOpen(true)}
                                        className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 hover:bg-white/80 dark:hover:bg-zinc-900/80 border border-stone-100 dark:border-stone-800/50 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                                                <Lock size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-sm">{t('settings.changePassword')}</p>
                                                <p className="text-xs text-muted-foreground">{t('settings.changePasswordDesc')}</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setDeactivateModalOpen(true)}
                                        className="w-full flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200/50 dark:border-red-900/30 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                                                <ShieldAlert size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-sm text-red-600 dark:text-red-400">{t('settings.deactivateAccount')}</p>
                                                <p className="text-xs text-red-600/70 dark:text-red-400/70">{t('settings.deactivateAccountDesc')}</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Preferences Block - Large */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-3 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-6"
                        >
                            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-primary" />
                                {t('settings.preferences')}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-6">{t('settings.preferencesDesc')}</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Language */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Languages size={16} className="text-muted-foreground" />
                                        {t('settings.language')}
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full appearance-none bg-white/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:bg-white/80 dark:hover:bg-zinc-900/80 cursor-pointer"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as Language)}
                                        >
                                            <option value="en">English (United States)</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                            <option value="ja">日本語</option>
                                            <option value="ko">한국어</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t('settings.languageDesc')}</p>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Type size={16} className="text-muted-foreground" />
                                        {t('settings.fontSize')}
                                    </label>
                                    <div className="flex items-center gap-3 p-1.5 bg-white/50 dark:bg-zinc-900/50 border border-stone-200 dark:border-stone-800 rounded-xl">
                                        {(['small', 'medium', 'large'] as const).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setFontSize(size)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center py-2 rounded-lg transition-all",
                                                    fontSize === size
                                                        ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground ring-1 ring-black/5 dark:ring-white/5"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                                                )}
                                            >
                                                <span className={cn(
                                                    "font-medium",
                                                    size === 'small' ? "text-xs" : size === 'medium' ? "text-sm" : "text-base"
                                                )}>
                                                    Aa
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t('settings.fontSizeDesc')}</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
            <DeactivateAccountModal
                isOpen={isDeactivateModalOpen}
                onClose={() => setDeactivateModalOpen(false)}
            />
        </div>
    );
}
