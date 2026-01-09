"use client";

import { motion } from "framer-motion";

export function AuthBranding() {
    return (
        <div className="text-center space-y-12">
            <div className="relative">
                {/* Glow Effect */}
                <div
                    className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-secondary/20 dark:to-primary/20 blur-3xl rounded-full opacity-75"
                />

                <h1 className="relative text-7xl lg:text-8xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-incompleeta)' }}>
                    <span className="text-zinc-800 dark:text-white">QUICK</span>
                    <span className="text-primary dark:text-primary">EASE</span>
                </h1>
            </div>

            <p className="text-xl text-muted-foreground max-w-md mx-auto relative z-10">
                Your AI-powered study assistant for smarter, faster learning.
            </p>
        </div>
    );
}
