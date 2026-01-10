"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { useProfileStats } from "@/hooks/useProfileStats";
import { SimpleModal } from "@/components/profile/ProfileComponents";
import { ProfileBadgeModal } from "@/components/profile/ProfileBadgeModal";
import { Target, FileText, Copy } from "lucide-react";
import { motion } from "framer-motion";

// New Components
import { ProfileUserCard } from "@/components/profile/ProfileUserCard";
import { ProfileAchievementsCard } from "@/components/profile/ProfileAchievementsCard";
import { ProfileStatCard } from "@/components/profile/ProfileStatCard";

export default function ProfilePage() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const { user } = useAuthContext();
    const { stats, achievements, badgeDefinitions } = useProfileStats();

    const [activeModal, setActiveModal] = useState<'quiz-info' | 'badges' | null>(null);

    // Get earned badges
    const earnedBadges = Object.values(badgeDefinitions).filter(badge =>
        achievements.some(a => a.badge === badge.id)
    );
    // Display top 3 badges in the preview card
    const displayBadges = earnedBadges.slice(0, 3);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground overflow-x-hidden">
            <Sidebar onToggle={setSidebarExpanded} />

            <main className={cn(
                "transition-all duration-300 min-h-screen p-4 lg:p-8 relative",
                sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
            )}>
                {/* Subtle Background Blobs */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40" />
                </div>

                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Profile
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Overview of your learning progress
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-[minmax(180px,auto)]"
                    >
                        {/* 1. User Profile Card (Spans 8 cols) */}
                        <ProfileUserCard
                            user={user}
                            variants={item}
                        />

                        {/* 2. Achievements (Spans 4 cols) */}
                        <ProfileAchievementsCard
                            earnedCount={earnedBadges.length}
                            displayBadges={displayBadges}
                            onOpen={() => setActiveModal('badges')}
                            variants={item}
                        />

                        {/* 3. Quiz Mastery (Spans 4 cols) */}
                        <ProfileStatCard
                            title="Mastery"
                            value={stats.averageScore}
                            subtext="Average Quiz Score"
                            icon={Target}
                            colorClass="text-blue-600 dark:text-blue-400"
                            bgClass="bg-blue-50 dark:bg-blue-900/20"
                            borderHoverClass="hover:border-primary/30"
                            barColorClass="bg-blue-500"
                            variants={item}
                            onClick={() => setActiveModal('quiz-info')}
                            showPercent={true}
                        />

                        {/* 4. Notes Count (Spans 4 cols) */}
                        <ProfileStatCard
                            title="Production"
                            value={stats.notesCount}
                            subtext="Notes Created"
                            icon={FileText}
                            colorClass="text-emerald-600 dark:text-emerald-400"
                            bgClass="bg-emerald-50 dark:bg-emerald-900/20"
                            borderHoverClass="hover:border-emerald-500/30"
                            barColorClass="bg-emerald-500/20" // Or styled differently for "count" if needed
                            variants={item}
                        />

                        {/* 5. Flashcards Count (Spans 4 cols) */}
                        <ProfileStatCard
                            title="Review"
                            value={stats.flashcardCount}
                            subtext="cards generated"
                            icon={Copy}
                            colorClass="text-violet-600 dark:text-violet-400"
                            bgClass="bg-violet-50 dark:bg-violet-900/20"
                            borderHoverClass="hover:border-violet-500/30"
                            barColorClass="bg-violet-500/20"
                            variants={item}
                        />
                    </motion.div>
                </div>
            </main>

            {/* Quiz Info Modal */}
            <SimpleModal
                isOpen={activeModal === 'quiz-info'}
                onClose={() => setActiveModal(null)}
                title="Quiz Mastery Score"
            >
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto">
                        Your mastery score is the weighted average of all your quiz results.
                        Aim for 100% to unlock the <span className="font-bold text-primary">Master Scholar</span> badge!
                    </p>
                </div>
            </SimpleModal>

            {/* Badges Modal */}
            <ProfileBadgeModal
                isOpen={activeModal === 'badges'}
                onClose={() => setActiveModal(null)}
                badgeDefinitions={badgeDefinitions}
                achievements={achievements}
            />
        </div>
    );
}
