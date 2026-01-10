"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav, NavItem } from "./SidebarNav";
import { PomodoroMiniTimer } from "@/components/Pomodoro/PomodoroMiniTimer";

interface MobileSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    menuItems: NavItem[];
    onNavigate?: (path: string) => void;
    onLogout: () => void;
    t: (key: string) => string;
}

export function MobileSidebar({ isOpen, onToggle, menuItems, onNavigate, onLogout, t }: MobileSidebarProps) {
    return (
        <>
            {/* Sticky Header */}
            <header className="sticky top-0 left-0 right-0 z-40 w-full px-4 py-3 flex items-center justify-between bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggle}
                        className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <SidebarLogo />
                </div>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggle}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-[85vw] max-w-[280px] bg-background/95 backdrop-blur-2xl border-r border-border z-50 p-6 shadow-2xl flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <SidebarLogo />
                                <button onClick={onToggle} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto -mx-2 px-2 scrollbar-none">
                                <SidebarNav
                                    items={menuItems}
                                    onNavigate={(path) => {
                                        onToggle();
                                        if (onNavigate) onNavigate(path);
                                    }}
                                    useCustomNavigate={!!onNavigate}
                                    isCollapsed={false}
                                    t={t}
                                />
                            </div>

                            <div className="mt-auto pt-4 flex flex-col gap-4 shrink-0 border-t border-border">
                                <PomodoroMiniTimer isCollapsed={false} />
                                <button
                                    onClick={onLogout}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all font-medium border border-destructive/20"
                                >
                                    <LogOut size={20} />
                                    <span>{t('sidebar.logout')}</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
