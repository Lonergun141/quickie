"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface NavItem {
    icon: LucideIcon;
    textKey: string;
    path: string;
}

interface SidebarNavProps {
    items: NavItem[];
    onNavigate?: (path: string) => void;
    useCustomNavigate?: boolean;
    isCollapsed: boolean;
    t: (key: string) => string;
}

export function SidebarNav({ items, onNavigate, useCustomNavigate, isCollapsed, t }: SidebarNavProps) {
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent, path: string) => {
        if (useCustomNavigate && onNavigate) {
            e.preventDefault();
            onNavigate(path);
        } else if (onNavigate) {
            onNavigate(path);
        }
    };

    return (
        <ul className="space-y-2">
            {items.map((item) => {
                const isActive = pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                    <li key={item.path}>
                        <Link
                            href={item.path}
                            onClick={(e) => handleClick(e, item.path)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-primary font-semibold bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
                                isCollapsed && "justify-center px-0 py-3"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <Icon
                                size={22}
                                className={cn(
                                    "relative z-10 transition-transform duration-200",
                                    isActive && "scale-110",
                                    !isActive && "group-hover:scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="relative z-10 truncate"
                                >
                                    {t(item.textKey)}
                                </motion.span>
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
