"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNav, NavItem } from "./SidebarNav";

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
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={onToggle}
                    className="p-2 bg-background/80 backdrop-blur-md border rounded-lg shadow-sm hover:bg-accent transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggle}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-72 bg-background/90 backdrop-blur-xl border-r z-50 p-4 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <SidebarLogo />
                                <button onClick={onToggle} className="p-2 hover:bg-accent rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

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

                            <div className="absolute bottom-8 left-0 w-full px-4">
                                <button
                                    onClick={onLogout}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-medium"
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
