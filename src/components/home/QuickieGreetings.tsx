"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function QuickieGreetings() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const mascotSrc = mounted && resolvedTheme === "dark"
        ? "/images/quick.png"
        : "/images/mascot.png";

    if (!mounted) return null;

    return (
        <div className="flex items-end justify-between relative h-full">
            <div className="space-y-4 mb-2 z-10 relative max-w-[65%] pb-4 pl-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                >
                    <div className="text-xs text-muted-foreground/80 uppercase tracking-[0.2em] mb-2">
                        Identity Confirmed
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight text-foreground">
                        <span className="block text-muted-foreground font-light tracking-normal text-2xl md:text-3xl mb-1">Hello,</span>
                        {user?.firstname || "Creator"}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed max-w-[90%]"
                >
                    Ready to initialize knowledge transfer?
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
                className="absolute -right-25 -bottom-8 z-0 translate-y-[35%]"
            >
                {/* Mascot Image - Larger & Hidden Bottom */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
                    <img
                        src={mascotSrc}
                        alt="Quickie Mascot"
                        className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${resolvedTheme === 'dark'
                            ? 'brightness-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]'
                            : 'brightness-100 drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]'
                            }`}
                    />
                </div>
            </motion.div>
        </div>
    );
}
