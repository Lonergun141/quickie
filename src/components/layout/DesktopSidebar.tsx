"use client";

import { motion } from "framer-motion";
import { ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav, NavItem } from "./SidebarNav";

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
                "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl",
                "border border-stone-200 dark:border-stone-800 rounded-3xl",
                "flex flex-col overflow-hidden"
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

            <div className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-none">
                <SidebarNav
                    items={menuItems}
                    onNavigate={onNavigate}
                    useCustomNavigate={!!onNavigate}
                    isCollapsed={isCollapsed}
                    t={t}
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                <button
                    onClick={onLogout}
                    className={cn(
                        "flex items-center justify-center rounded-xl p-3 transition-all duration-200",
                        "text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20",
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
