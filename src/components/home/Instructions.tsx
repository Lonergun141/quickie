"use client";

import {
    FileText,
    Image as ImageIcon,
    PenSquare
} from "lucide-react";
import { motion } from "framer-motion";

export function Instructions() {
    const cards = [
        {
            icon: PenSquare,
            title: "Quick Notes",
            desc: "Paste study material directly for instant summaries.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: FileText,
            title: "Smart Documents",
            desc: "Upload PDFs or Docs. We extract, analyze, and summarize.",
            color: "text-violet-500",
            bg: "bg-violet-500/10"
        },
        {
            icon: ImageIcon,
            title: "Visual Learning",
            desc: "Snap a photo of your textbook. AI converts it to study aids.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    return (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                    className="group p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                    <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                        <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.desc}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
