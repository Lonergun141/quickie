"use client";

import { PenSquare, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type TabType = "text" | "documents" | "images";

interface HomeTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    orientation?: "horizontal" | "vertical";
}

export function HomeTabs({ activeTab, onTabChange }: HomeTabsProps) {
    const tabs = [
        {
            id: "text",
            label: "Text",
            icon: PenSquare,
            tooltip: "Type or paste text directly"
        },
        {
            id: "documents",
            label: "Files",
            icon: FileText,
            tooltip: "Upload PDF or Word documents"
        },
        {
            id: "images",
            label: "Visuals",
            icon: ImageIcon,
            tooltip: "Upload images for analysis"
        },
    ] as const;

    return (
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 rounded-lg backdrop-blur-md">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md z-10 group",
                            isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTabPill"
                                className="absolute inset-0 bg-white shadow-lg shadow-black/5 dark:shadow-white/10 rounded-md -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <tab.icon size={14} className={cn("relative z-10", isActive && "text-zinc-950")} />
                        <span className="relative z-10">{tab.label}</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-[10px] font-medium rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                            {tab.tooltip}
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-900 dark:border-t-zinc-100" />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
