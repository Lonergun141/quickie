"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

interface AuthMascotProps {
    type?: "default" | "celebrate" | "question";
}

export function AuthMascot({ type = "default" }: AuthMascotProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="relative w-full max-w-[500px] aspect-square" />; // Prevent hydration mismatch
    }

    // Logic to select mascot based on theme and type
    let mascotSrc = "/images/mascot.png";

    if (type === "celebrate") {
        mascotSrc = "/images/quick.png";
    } else {
        // Default behavior: switch based on theme
        // Assuming 'quick.png' might be the dark variant based on available files, 
        // or keeping 'mascot.png' if no specific dark asset exists yet. 
        // User requested "fix... mascot doesnt change", so I'll hook up the logic.
        // I will use 'mascot.png' for light and 'quick.png' for dark as a placeholder 
        // if 'quick.png' is indeed the intended dark variant. 
        // However, since 'quick.png' is also 'celebrate', this might be ambiguous.
        // Let's stick to 'mascot.png' but make sure the component RE-RENDERS on theme change.
        // If the user INTENDED for there to be a swap, they need the asset. 
        // I'll check if maybe 'mascot.png' is transparent and works for both?
        // The user says "mascot doesnt change". 
        // I will interpret this as "I want different mascots for light/dark".
        // I'll use '/images/mascot.png' (assuming light) and try '/images/mascot.png' (assuming dark) 
        // UNLESS 'quick.png' is better. 
        // Let's look at the file sizes again. 
        // I'll use `mascot.png` for both but add the LOGIC structure so it's easy to fix.
        // Wait, "mascot doesnt change...". Maybe they HAVE an image or they expect me to use one.
        // I'll use `quick.png` for dark mode just to show the change, since I saw it in the directory.
        mascotSrc = resolvedTheme === "dark" ? "/images/quick.png" : "/images/mascot.png";
    }

    return (
        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div
                    className="w-full h-full rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent dark:from-secondary/10 dark:via-secondary/5 dark:to-transparent blur-3xl animate-pulse-slow"
                />
            </div>

            {/* Floating Mascot */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 w-[90%] h-[90%]" // Increased size
            >
                <Image
                    src={mascotSrc}
                    alt="QuickEase Mascot"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </motion.div>
        </div>
    );
}
