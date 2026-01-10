"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, FileText, Image as ImageIcon, PenLine, Terminal, ScanFace, FileJson } from "lucide-react";
import { TabType } from "./HomeTabs";

interface ContextualGuideProps {
    activeTab: TabType;
}

export function ContextualGuide({ activeTab }: ContextualGuideProps) {
    const guides = {
        text: {
            icon: Terminal,
            title: "TEXT INPUT",
            description: "Direct input interface. Raw data is processed into structured intelligence summaries.",
            tips: ["Character Limit: 10k", "Optical Analysis: Instant", "Format: Auto-Detect"]
        },
        documents: {
            icon: FileJson,
            title: "DOC PARSER",
            description: "Bulk document ingestion. Supports multi-format extraction and synthesis.",
            tips: ["Formats: PDF, DOCX", "Batch Processing: Active", "Extraction: Deep"]
        },
        images: {
            icon: ScanFace, // Or ScanLine
            title: "VISUAL RECON",
            description: "Optical character recognition for physical data points and handwritten schemas.",
            tips: ["Accuracy: High", "Source: Camera/File", "Latency: Low"]
        }
    };

    const activeGuide = guides[activeTab];

    return (
        <div className="h-full flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-900 dark:text-white">
                            <activeGuide.icon size={18} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold tracking-widest text-foreground uppercase">
                            {activeGuide.title}
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="pl-14 border-l border-zinc-200 dark:border-white/5">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {activeGuide.description}
                        </p>
                    </div>

                    {/* Technical Specs / Tips */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-2">
                            <span>/// PROTOCOLS</span>
                            <div className="h-[1px] flex-grow bg-zinc-200 dark:bg-zinc-800" />
                        </h3>
                        <ul className="grid gap-3">
                            {activeGuide.tips.map((tip, i) => (
                                <motion.li
                                    key={tip}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-3 text-xs text-zinc-500"
                                >
                                    <div className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-white/50" />
                                    {tip}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
