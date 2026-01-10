"use client";

import { motion } from "framer-motion";
import { ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav, NavItem } from "./SidebarNav";
import { PomodoroMiniTimer } from "@/components/Pomodoro/PomodoroMiniTimer";

interface DesktopSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    menuItems: NavItem[];
    onNavigate?: (path: string) => void;
    onLogout: () => void;
    t: (key: string) => string;
}

export function DesktopSidebar({ isCollapsed, onToggle, menuItems, onNavigate, onLogout, t }: DesktopSidebarProps) {
    const sidebarVariants = {
        expanded: { width: "16rem" }, // w-64
        collapsed: { width: "5rem" }, // w-20
    };

    return (
        <motion.div
            initial={isCollapsed ? "collapsed" : "expanded"}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={cn(
                "fixed top-4 left-4 h-[calc(100vh-2rem)] z-50",
                "bg-card dark:bg-zinc-900/40 backdrop-blur-2xl",
                "border border-zinc-200 dark:border-white/5 rounded-3xl",
                "flex flex-col overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/20"
            )}
        >
            {/* Header */}
            <div className={cn("flex items-center h-20 px-6", isCollapsed ? "justify-center px-0" : "justify-between")}>
                {!isCollapsed && <SidebarLogo />}

                <button
                    onClick={onToggle}
                    className={cn(
                        "p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground",
                        isCollapsed && "rotate-180"
                    )}
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/10">
                <SidebarNav
                    items={menuItems}
                    onNavigate={onNavigate}
                    useCustomNavigate={!!onNavigate}
                    isCollapsed={isCollapsed}
                    t={t}
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/5 flex flex-col gap-2">
                <PomodoroMiniTimer isCollapsed={isCollapsed} />
                <button
                    onClick={onLogout}
                    className={cn(
                        "flex items-center justify-center rounded-xl p-3 transition-all duration-200",
                        "text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400",
                        !isCollapsed ? "w-full gap-3" : "w-10 h-10 mx-auto"
                    )}
                    title={t('sidebar.logout')}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium">{t('sidebar.logout')}</span>}
                </button>
            </div>
        </motion.div>
    );
}
