"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthSplitLayoutProps {
    children: ReactNode;
    leftContent: ReactNode;
}

export function AuthSplitLayout({ children, leftContent }: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
            {/* Left Panel - Branding/Mascot (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-zinc-50 to-secondary/5 dark:from-secondary/5 dark:via-zinc-950 dark:to-primary/5" />

                    {/* Dynamic Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]">
                        <div
                            className="absolute w-full h-full pulse-bg"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                                `,
                                backgroundSize: '48px 48px'
                            }}
                        />
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative w-full h-full flex flex-col items-center justify-center p-16">
                    {leftContent}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white dark:bg-zinc-950 relative">
                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 right-6 p-2 rounded-full text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    aria-label="Back to Home"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </Link>
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <h1 className="text-3xl font-bold tracking-tight">
                                <span className="text-zinc-900 dark:text-white">QUICK</span>
                                <span className="text-primary">EASE</span>
                            </h1>
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
