"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

function SummarizeIcon() {
    return (
        <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
    );
}

function FlashcardIcon() {
    return (
        <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

function QuizIcon() {
    return (
        <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    colorClass: string;
    bgClass: string;
}

function FeatureCard({ icon, title, description, colorClass, bgClass }: FeatureCardProps) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${bgClass} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <h3 className={`${colorClass} font-semibold text-sm md:text-base mb-1`}>{title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

export function HeroSection() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use light mascot as default during SSR
    const mascotSrc = mounted && resolvedTheme === "dark"
        ? "/images/quick.png"
        : "/images/mascot.png";

    return (
        <section className="relative pt-28 pb-16 px-6 overflow-hidden">
            {/* Background grid pattern - adapts to light/dark mode */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center"
                >
                    {/* Top Tagline */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-primary text-sm md:text-base font-medium"
                    >
                        A capstone project powered by OpenAI GPT-4o, Google Vision & ConvertAPI — now redesigned.
                    </motion.p>

                    {/* Main Title with Mascot */}
                    <motion.div variants={fadeInUp} className="relative mb-8">
                        <h1
                            style={{ fontFamily: 'var(--font-incompleeta)' }}
                            className="text-[6rem] md:text-[10rem] lg:text-[14rem] tracking-tighter leading-none select-none"
                        >
                            <span className="text-foreground">QUIC</span>
                            <span className="text-primary">EASE</span>
                        </h1>
                        {/* Mascot - switches based on theme with pop animation */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[25%] w-64 md:w-96 lg:w-128 pointer-events-none">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mascotSrc}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                        duration: 0.4
                                    }}
                                >
                                    <Image
                                        src={mascotSrc}
                                        alt="QuickEase Mascot"
                                        width={600}
                                        height={600}
                                        className="drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Feature Card */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative z-10 bg-transparent dark:bg-card/80 backdrop-blur-xl rounded-3xl border border-stone-200 dark:border-white/10 p-8 md:p-10 max-w-3xl mx-auto mt-20 md:mt-28 lg:mt-32"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-8">
                            Study Smarter, Not Harder
                        </h2>

                        <div className="grid grid-cols-3 gap-6 md:gap-12">
                            <FeatureCard
                                icon={<SummarizeIcon />}
                                title="AI Summaries"
                                description="Transform PDFs, images & text into concise notes."
                                colorClass="text-primary"
                                bgClass="bg-primary/10"
                            />
                            <FeatureCard
                                icon={<FlashcardIcon />}
                                title="Auto Flashcards"
                                description="Review key concepts with AI-generated cards."
                                colorClass="text-primary"
                                bgClass="bg-primary/10"
                            />
                            <FeatureCard
                                icon={<QuizIcon />}
                                title="Practice Quizzes"
                                description="Test retention with personalized assessments."
                                colorClass="text-primary"
                                bgClass="bg-primary/10"
                            />
                        </div>
                    </motion.div>

                    {/* Partner Logos */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center justify-center gap-12 md:gap-20 mt-16"
                    >
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Image
                                src="/images/openai.png"
                                alt="OpenAI"
                                width={28}
                                height={28}
                            />
                            <span className="text-sm font-medium">OpenAI</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">Google Vision</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">ConvertAPI</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
