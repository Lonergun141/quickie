"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { useProfileStats } from "@/hooks/useProfileStats";
import { SimpleModal } from "@/components/profile/ProfileComponents";
import { CheckCircle2, Copy, FileText, Trophy, Target, Award, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function ProfilePage() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { user } = useAuthContext();
    const { stats, achievements, badgeDefinitions, loading } = useProfileStats();

    const [activeModal, setActiveModal] = useState<'quiz-info' | 'badges' | null>(null);

    // Get earned badges
    const earnedBadges = Object.values(badgeDefinitions).filter(badge =>
        achievements.some(a => a.badge === badge.id)
    );
    const displayBadges = earnedBadges.slice(0, 6);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            <Sidebar onToggle={setSidebarExpanded} />

            <main className={cn(
                "transition-all duration-300 min-h-screen p-4 lg:p-8 relative",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Background Ambient - Subtle */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Bento Grid */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5 auto-rows-[minmax(120px,auto)]"
                    >
                        {/* User Info Card - Spans 2x2 */}
                        <motion.div
                            variants={item}
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="md:col-span-2 lg:col-span-3 lg:row-span-2 relative group overflow-hidden rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 lg:p-8"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start gap-6 flex-1">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 flex items-center justify-center text-4xl lg:text-5xl font-bold text-primary">
                                            {user?.firstname?.charAt(0).toUpperCase() || "U"}
                                        </div>

                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 pt-1">
                                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground mb-1">
                                            {user?.firstname} {user?.lastname}
                                        </h1>
                                        <p className="text-sm lg:text-base text-muted-foreground font-medium">{user?.email}</p>

                                        {/* Badge count */}
                                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                                            <Trophy className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold text-primary">
                                                <AnimatedCounter value={earnedBadges.length} /> Badges Earned
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats Row */}
                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/5">
                                        <div className="text-xl lg:text-2xl font-bold text-foreground">
                                            <AnimatedCounter value={stats.notesCount} />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Notes</div>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/5">
                                        <div className="text-xl lg:text-2xl font-bold text-foreground">
                                            <AnimatedCounter value={stats.flashcardCount} />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Cards</div>
                                    </div>
                                    <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-black/5 dark:border-white/5">
                                        <div className="text-xl lg:text-2xl font-bold text-foreground">
                                            <AnimatedCounter value={stats.perfectQuizCount} />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Perfect</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Badges Preview Card - Made Bigger (3 cols x 2 rows) */}
                        <motion.div
                            variants={item}
                            whileHover={{ y: -2 }}
                            onClick={() => setActiveModal('badges')}
                            className="md:col-span-2 lg:col-span-3 lg:row-span-2 relative overflow-hidden rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 cursor-pointer group"
                        >
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
                                            <Award className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Achievements</h3>
                                            <p className="text-xs text-muted-foreground">
                                                <AnimatedCounter value={earnedBadges.length} />/{Object.keys(badgeDefinitions).length} unlocked
                                            </p>
                                        </div>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Badge Grid - 3x2 layout */}
                                <div className="flex-1 grid grid-cols-3 gap-3">
                                    {displayBadges.map((badge, idx) => (
                                        <motion.div
                                            key={badge.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                            className="relative aspect-square rounded-xl bg-white/80 dark:bg-zinc-900/50 p-2 border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={badge.image} alt={badge.title} className="w-full h-full object-contain" />
                                            <div className="absolute -bottom-1 -right-1">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 fill-white dark:fill-zinc-950" strokeWidth={2} />
                                            </div>
                                        </motion.div>
                                    ))}
                                    {displayBadges.length < 6 && Array.from({ length: 6 - displayBadges.length }).map((_, idx) => (
                                        <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center opacity-40">
                                            <Star className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>

                                {/* Footer hint */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-muted-foreground/70">Click to view all achievements</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quiz Score Card - Made Smaller (1 col x 1 row) */}
                        <motion.div
                            variants={item}
                            whileHover={{ y: -2 }}
                            onClick={() => setActiveModal('quiz-info')}
                            className="md:col-span-1 lg:col-span-2 relative group overflow-hidden rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 cursor-pointer"
                        >
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
                                        <Target className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                                        MASTERY
                                    </div>
                                </div>

                                {/* Score Display */}
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl lg:text-6xl font-bold text-foreground mb-2 flex items-center justify-center">
                                            <AnimatedCounter value={stats.averageScore} />
                                            <span className="text-4xl lg:text-5xl ml-1">%</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">Quiz Evaluation</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Notes Card */}
                        <motion.div
                            variants={item}
                            whileHover={{ y: -2 }}
                            className="md:col-span-1 lg:col-span-2 relative overflow-hidden rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6"
                        >
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div>
                                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 inline-flex mb-3">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-1">
                                        <AnimatedCounter value={stats.notesCount} />
                                    </h3>
                                    <p className="text-muted-foreground font-medium">Notes Created</p>
                                </div>
                                <div className="text-muted-foreground/10 dark:text-muted-foreground/5">
                                    <FileText className="w-20 h-20 lg:w-24 lg:h-24" strokeWidth={1} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Flashcards Card */}
                        <motion.div
                            variants={item}
                            whileHover={{ y: -2 }}
                            className="md:col-span-1 lg:col-span-2 relative overflow-hidden rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6"
                        >
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div>
                                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 inline-flex mb-3">
                                        <Copy className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-1">
                                        <AnimatedCounter value={stats.flashcardCount} />
                                    </h3>
                                    <p className="text-muted-foreground font-medium">Flashcards</p>
                                </div>
                                <div className="text-muted-foreground/10 dark:text-muted-foreground/5">
                                    <Copy className="w-20 h-20 lg:w-24 lg:h-24" strokeWidth={1} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* Quiz Info Modal */}
            <SimpleModal
                isOpen={activeModal === 'quiz-info'}
                onClose={() => setActiveModal(null)}
                title="Quiz Evaluation Explained"
            >
                <div className="space-y-6">
                    <p className="text-muted-foreground">
                        Your quiz evaluation score is calculated based on your performance across all quizzes you&apos;ve taken.
                        It reflects your mastery of the subjects you study with Quickie.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                            <span className="text-sm">We aggregate all points earned from every quiz session.</span>
                        </li>
                        <li className="flex gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                            <span className="text-sm">We compare this against the total possible points.</span>
                        </li>
                        <li className="flex gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                            <span className="text-sm">The result is your current mastery percentage.</span>
                        </li>
                    </ul>
                </div>
            </SimpleModal>

            {/* Badges Modal */}
            <SimpleModal
                isOpen={activeModal === 'badges'}
                onClose={() => setActiveModal(null)}
                title="Achievements"
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.values(badgeDefinitions).map((badge) => {
                        const isEarned = achievements.some(a => a.badge === badge.id);
                        return (
                            <div key={badge.id} className={cn(
                                "flex flex-col items-center p-4 rounded-2xl border transition-all text-center gap-3 hover:scale-105 duration-300",
                                isEarned
                                    ? "bg-white/80 dark:bg-zinc-900/50 border-primary/20 dark:border-primary/30"
                                    : "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 grayscale opacity-60"
                            )}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={badge.image} alt={badge.title} className="w-20 h-20 object-contain" />
                                <div>
                                    <h3 className={cn("font-bold text-sm", isEarned ? "text-foreground" : "text-muted-foreground")}>{badge.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
                                </div>
                                {isEarned ? (
                                    <span className="text-[10px] w-full py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold border border-green-200 dark:border-green-800/50">
                                        ✓ Earned
                                    </span>
                                ) : (
                                    <span className="text-[10px] w-full py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full font-medium border border-zinc-200 dark:border-zinc-700">
                                        🔒 Locked
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </SimpleModal>
        </div>
    );
}
