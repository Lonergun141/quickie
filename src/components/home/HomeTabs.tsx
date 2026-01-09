"use client";

import { PenSquare, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";

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
            tooltip: "Type or paste your notes directly"
        },
        {
            id: "documents",
            label: "Documents",
            icon: FileText,
            tooltip: "Upload PDF, DOCX, or TXT files"
        },
        {
            id: "images",
            label: "Images",
            icon: ImageIcon,
            tooltip: "Upload screenshots or handwritten notes"
        },
    ] as const;

    return (
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
            {tabs.map((tab) => (
                <Tooltip key={tab.id} content={tab.tooltip} side="top">
                    <button
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-md w-full md:w-auto",
                            activeTab === tab.id
                                ? "text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabPill"
                                className="absolute inset-0 bg-primary rounded-md"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <tab.icon size={16} className="relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                </Tooltip>
            ))}
        </div>
    );
}
