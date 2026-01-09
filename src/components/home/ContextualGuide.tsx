"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, FileText, Image as ImageIcon, PenLine } from "lucide-react";
import { TabType } from "./HomeTabs";

interface ContextualGuideProps {
    activeTab: TabType;
}

export function ContextualGuide({ activeTab }: ContextualGuideProps) {
    const guides = {
        text: {
            icon: PenLine,
            title: "Smart Editor",
            description: "Paste your raw notes, articles, or rough ideas. We'll structure them into clear, concise summaries.",
            tips: ["Supports up to 10k characters", "Great for articles & essays", "Instant analysis"]
        },
        documents: {
            icon: FileText,
            title: "Document Analysis",
            description: "Upload your study materials. We support major formats and extract wisdom from every page.",
            tips: ["PDF, DOCX, PPTX supported", "Bulk processing", "Deep text extraction"]
        },
        images: {
            icon: ImageIcon,
            title: "Visual Scanner",
            description: "Transform physical notes into digital knowledge. Snap a photo and let AI do the rest.",
            tips: ["Textbook pages", "Handwritten notes", "Screenshots & diagrams"]
        }
    };

    const activeGuide = guides[activeTab];

    return (
        <div className="h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary backdrop-blur-sm">
                        <activeGuide.icon size={24} strokeWidth={1.5} />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {activeGuide.title}
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                            {activeGuide.description}
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                            <Lightbulb size={16} />
                            <span>Quick Tips</span>
                        </h3>
                        <ul className="space-y-2">
                            {activeGuide.tips.map((tip, i) => (
                                <motion.li
                                    key={tip}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-3 text-sm font-medium text-foreground/80"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
