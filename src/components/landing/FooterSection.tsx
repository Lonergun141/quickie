"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const footerLinks = [
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Support", href: "/support" },
    { label: "Trust Center", href: "/trust" },
];

export function FooterSection() {
    return (
        <footer className="relative bg-background overflow-hidden min-h-[80vh] md:min-h-screen">
            {/* Background gradient orbs */}
            <div className="absolute top-20 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-primary/5 rounded-full blur-3xl" />

            {/* Top links - hidden on mobile */}
            <div className="hidden md:flex absolute top-6 right-8 z-10 items-center gap-6">
                {footerLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Main content */}
            <div className="pt-20 sm:pt-32 pb-32 sm:pb-48 relative z-10 px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight"
                    >
                        From Capstone to Something More.
                    </motion.h2>

                    <motion.p
                        variants={fadeInUp}
                        className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto mt-4 sm:mt-6 px-4"
                    >
                        Built with passion, validated by users, and continuously improving.
                    </motion.p>
                </motion.div>
            </div>

            {/* Perspective grid background */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] sm:h-[50%] pointer-events-none">
                <div
                    className="absolute inset-0 opacity-30 dark:opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
                        backgroundSize: '30px 30px',
                        transform: 'perspective(400px) rotateX(55deg)',
                        transformOrigin: 'center top',
                    }}
                />
                {/* Fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            {/* Large QUICKEASE logo */}
            <div
                className="absolute bottom-20 sm:bottom-16 left-0 right-0 flex justify-center pointer-events-none z-0"
                style={{ fontFamily: 'var(--font-incompleeta)' }}
            >
                <span className="text-[3rem] sm:text-[6rem] md:text-[10rem] lg:text-[14rem] font-normal tracking-wider text-foreground/5 select-none whitespace-nowrap">
                    QUICKEASE
                </span>
            </div>

            {/* Copyright, links, and social */}
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-10 px-4 sm:px-8">
                {/* Mobile links */}
                <div className="flex md:hidden flex-wrap justify-center gap-4 mb-4">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} QuickEase. A Capstone Project.
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://github.com/Lonergun141/QuickEase"
                            target="_blank"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="GitHub"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </Link>
                        <Link
                            href="https://quick-ease.vercel.app"
                            target="_blank"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Website"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
